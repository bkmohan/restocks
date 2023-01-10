import axios from 'axios'

const base_url = 'http://localhost:3003/api/shoes'


const getProducts = async (page) => {
    try{
        const response = await axios.get(`${base_url}?page=${page}`)
        return response.data
    }
    catch(error){
        return ''
    }
}

const getProduct = async (sku) => {
    try{
        const response = await axios.get(`${base_url}/${sku}`)
        return response.data
    }
    catch(error){
        return ''
    }
}

const searchProduct = async (query, page) => {
    try{
        const response = await axios.get(`${base_url}/search?q=${query}`)
        return response.data
    }
    catch(error){
        return ''
    }
}

const getProductCount = async () => {
    try{
        const response = await axios.get(`${base_url}/count`)
        return response.data
    }
    catch(error){
        return ''
    }
}

export {getProducts, getProduct, getProductCount, searchProduct}