import { Link } from 'react-router-dom'
import '../styles/container.css'

function Article({ sku, name, image }) {

    return (
        <article>
            <Link className='link' to={`/${sku}`}>
                <img className="product-image" src={image} alt={name}></img>
                <div className="product-name">{name}</div>
                <div className="product-sku">{sku}</div>
            </Link>
        </article>
    )
}


function Container({ products, searchQ, count , loadmore}) {
    return(
        <div className="container">
            
            <div className="product-grid">
                {products.map(product => <Article key={product.sku} sku={product.sku} name={product.name} image={product.image} />)}
            </div>
            {
                products.length < count && searchQ === '' &&
                <div className="load-more--btn" onClick={loadmore}>Load more</div>
            }
        </div>
    )
}


export default Container