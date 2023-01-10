const shoesRouter = require('express').Router()
const Pool = require('pg').Pool
const config = require('../utils/config')


const pool = new Pool({
    user: config.PG_USER,
    host: config.PG_HOST,
    database: config.PG_DB,
    password: config.PG_PASS,
    port: config.PG_PORT,
})

const LIMIT = 500

shoesRouter.get('/count', async (request, response) => {
    let query = 'SELECT count(*) FROM products;'
    const results = await pool.query(query)
    response.status(200).json(results.rows[0])
})

shoesRouter.get('/', async (request, response) => {
    let page = Number(request.query.page)
    page = page && page > 0 ? Math.floor(page) : 1
    let offset = (page-1)*100

    let query = `SELECT * FROM products LIMIT ${LIMIT} OFFSET ${offset}`
    const results = await pool.query(query)
    response.status(200).json(results.rows)
})

shoesRouter.get('/search', async (request, response) => {
    let term = request.query.q
    if(term){
        let page = Number(request.query.page)
        page = page && page > 0 ? Math.floor(page) : 1
        let offset = (page-1)*100
    
        let query = `SELECT * FROM products WHERE (name ILIKE '%${term}%') OR (sku ILIKE '%${term}%') LIMIT 100`
        const results = await pool.query(query)
        response.status(200).json(results.rows)
    }
    else{
        response.status(200).json([])
    }
})

shoesRouter.get('/:sku', async (request, response) => {
    const sku = request.params.sku
    let detail_query = `SELECT * FROM products WHERE sku ILIKE '${sku}'`
    let price_query = `SELECT price, timestamp FROM price WHERE sku ILIKE '${sku}'`
    
    const details = await pool.query(detail_query)
    let prices = await pool.query(price_query)

    prices = prices.rows.map(row => {
        row.price = JSON.parse(row.price)
        return row
    })

    const result = {
        ...details.rows[0],
        prices
    }
    response.status(200).json(result)
})



module.exports = shoesRouter