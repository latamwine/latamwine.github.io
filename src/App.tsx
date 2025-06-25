import { useEffect, useState } from "react";
import "./App.css";
import { useParams } from "react-router";

type ProductData = {
  name: string;
  attributes: any[];
  images: any[];
}
type ProductProps = {
  data: ProductData;
}

function ProductView({ data }: ProductProps) {
  const imageUrl = data.images[0].src

  return <div style={{ width: "100vw", height: "200vh" }}>
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "red" }}>
      <div>
        <img src={imageUrl} crossOrigin="anonymous" />
      </div>
    </div>
    <h1>{data.name}</h1>
  </div>
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

  return <ProductView data={productData} />
}

export default App;
