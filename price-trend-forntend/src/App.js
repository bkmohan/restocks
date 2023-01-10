import { useEffect, useState } from "react";
import Container from "./components/Container";
import Header from "./components/Header";
import Search from "./components/Search";
import { getProductCount, getProducts, searchProduct } from "./services/shoes";
// import './styles/home.css'


function App() {
  const [products, setProducts] = useState([])
  const [productCount, setProductCount] = useState(0)
  const [page, setPage] = useState(1)
  const [searchQ, setSearchQ] = useState('')



  useEffect(() => {
      const counts = async () => {
        const total = await getProductCount()
        setProductCount(total.count)
      }
      const prods = async () => {
        const pros = await getProducts(1)
        setProducts( initProducts => initProducts.concat(pros))
        setPage(p => p+1)
      }
      
      counts()
      prods()
  }, [])


  const loadmore = async () => {
      let prods = []
      prods = await getProducts(page)
      setProducts( initProducts => initProducts.concat(prods))
      setPage(p => p+1)
  }

  const searchQuery = async (query) => {
      const prods = await searchProduct(query)
      setProducts(prods)
      setSearchQ(query)
  }

  const clearSearch = async () =>{
    const pros = await getProducts(1)
    setProducts(pros)

    setSearchQ('')
    setPage(1)
    
  }

  return (
    <div className="App">
      <Header></Header>
      <Search searchQuery={searchQuery} clearSearch={clearSearch}></Search>

      <div className='body'>
          {searchQ === '' ? 
          <>
            <div className="count">{productCount} items</div> 
            <Container products={products} searchQ={''} count={productCount} loadmore={loadmore}></Container>
          </> :
          <>
            <div className='search-info'>
                <div className="search-text">
                    {products.length > 0 ? `Top Results for "${searchQ}"` : `No Products found for "${searchQ}"`}
                </div>
            </div>
            <Container products={products} searchQ={searchQ} count={0} loadmore={loadmore}></Container>
          </>
          }
      </div>

    </div>
  );
}

export default App;
