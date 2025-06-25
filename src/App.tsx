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
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    setVh()
  }, [])

  const imageUrl = data.images[0].src
  let attributes = new Map<string, string>()
  data.attributes.forEach(x => {
    attributes.set(x.slug, x.options[0])
  })

  return <div style={{ width: "100vw", height: "200vh" }}>
    <div style={{ width: "100vw", height: "100vh", backgroundImage: 'url("background.png")' }}>
      <div style={{
        backgroundColor: 'white', width: "calc(100vw - 6vw)", height: "calc(100vh - 6vw)",
        position: "relative",
        top: "3vw",
        left: "3vw",
        borderRadius: "5px"
      }}>
        <div style={{
          width: "92%", height: "40%", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "stretch", padding: "4%",
        }}>
          <img src={imageUrl} crossOrigin="anonymous" style={{
            objectFit: "cover",
            width: "30%",
            height: "100%",
            paddingRight: "4%",
          }} />
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}>
            <p className="main-heading">{data.name}</p>
            <p style={{ margin: 0 }}>&nbsp;</p>
            <p className="attribute-label">Spróbuj w temperaturze</p>
            <p className="attribute-value">{attributes.get("pa_temperatura-spozycia")}</p>
            <p style={{ margin: 0 }}>&nbsp;</p>
            <p className="attribute-label">Szczep</p>
            <p className="attribute-value">{attributes.get("pa_szczep")}</p>
          </div>
        </div>
        <hr style={{ border: "none", height: "1px", backgroundColor: "#aaaaaa", width: "90%" }} />
        <p className="mini-attribute">Struktura - <span style={{ fontWeight: "bold" }}>{attributes.get("pa_struktura")}</span></p>
        <p className="mini-attribute">Aromaty - <span style={{ fontWeight: "bold" }}>{attributes.get("pa_aromaty")}</span></p>
        <p className="mini-attribute">Pasujo do:</p>
        {attributes.get("pa_pairings")?.split("|").map((x, i) =>
          <p className="mini-attribute">{i + 1}) {x}</p>
        )}
      </div>
    </div>
    <h1>{data.name}</h1>
  </div >
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
