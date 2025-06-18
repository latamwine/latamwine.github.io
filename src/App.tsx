import { useEffect, useState } from "react";
import "./App.css";
import { useParams } from "react-router";

type ProductData = {
  name: string,
  attributes: any[]
}

function App() {
  const { productId } = useParams<{ productId: string }>()
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchProduct() {
    try {
      setLoading(true)
      const res = await fetch(`https://latamwine.com/wp-json/wc/v3/products/${productId}`)
      if (!res.ok) throw new Error('Failed to fetch product')
      const data = await res.json()
      setProductData(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!productId) return
    fetchProduct()
  }, [productId])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!productData) return <p>No data found</p>

  return (
    <>
      <h2>{productData.name}</h2>
      {productData.attributes.map((x, i) => <p key={i}>{x.name}: {x.options[0]}</p>)}
    </>
  )
}

export default App;
