import { useEffect, useState } from "react"
import Header from "./components/Header"
import { getProduct } from "./services/shoes"
import moment from "moment/moment"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Label, Tooltip, ResponsiveContainer } from 'recharts';
import './styles/product.css'



function Product({sku}) {
    const [product, setProduct] = useState([])
    const [allTrendData, setAllTrendData] = useState({})
    const [trendData, setTrendData] = useState([])
    const [sizes, setSizes] = useState([])
    const [selectedSize, setSelectedSize] = useState('')
    const [timeframe, setTimeframe] = useState(1)
    const DATEFORMAT = 'DD-MM'

    const getSizePrices = (size, prices) => {

        let priceList = prices.map(record => {
            if(size in record.price){
                let price = record.price[size]
                price = Number(price.match(/\d+(\.\d+)?/)[0])
                let date = record.timestamp
                return {price, date}
            } 
            return {}
        })

        priceList = priceList.filter(value => value.price)
        return priceList
    }

    const getPriceForTimeframe = (prices) => {
        let limit = moment().subtract(timeframe, 'month')

        let filteredP = JSON.parse(JSON.stringify(prices))
        filteredP = filteredP.filter(record => moment(record.date).isAfter(limit))

        filteredP.sort((left, right) => {
            return moment(left.date).diff(moment(right.date))
        })

        return filteredP.map(record => {
            record.date = moment(record.date).format(DATEFORMAT)
            return record
        })
    }

    useEffect(() => {
        const prices = async () => {
            const response = await getProduct(sku)
            setProduct(response)

            const initSizes = []
            if(response.prices){
                response.prices.forEach(element => {
                    Object.keys(element.price).forEach(key => {
                        if(initSizes.indexOf(key) === -1) initSizes.push(key)
                    })
                })
            }
            setSizes(initSizes)

            const initTrendData = {}
            initSizes.forEach(elem => {
                initTrendData[elem] = getSizePrices(elem, response.prices)
            })

            setAllTrendData(initTrendData)
            setSelectedSize(initSizes[0])
        }
        
        prices()
    }, [])


    useEffect(() =>{
        if(Object.keys(allTrendData).length !== 0){
            setTrendData(getPriceForTimeframe(allTrendData[selectedSize]))
        }
    }, [timeframe, selectedSize, allTrendData])


    const changeSize = ({target}) => {
        setSelectedSize(target.value)
    }
    
    const legendStyle = {
        fontWeight : 700,
        fontSize: 16
    }

    const changeTimeframe = (event) => {
        setTimeframe(event.target.value)
    }

    return(
        <div>
            <div className="App">
                <Header></Header>
                
                <h1 className="product-title">{product.name}</h1>
                <div className="details">
                    <div className="sku">SKU: {product.sku}</div>
                    <div>
                        <a href={product.url}>View Product</a>
                    </div>
                </div>

                <div className="image-container">
                    <img src={product.image} alt={product.name}/>
                </div>
                
                
                <div className="dropdown-container">
                    <div>Select Size</div>
                    <select className="size-select" onChange={changeSize}>
                        {sizes.map(size => <option key={size} value={size}>{size}</option>)}
                    </select>
                </div>

                <div className="trend-chart">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData} margin={{
                                top: 5,
                                right: 10,
                                left: 10,
                                bottom: 5
                            }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" angle={-10} > 
                                <Label value="Date" offset={-5} position="insideBottom" style={legendStyle} />
                            </XAxis>
                            <YAxis>
                                <Label value="Price €" angle={-90} position="insideLeft" style={legendStyle}/>
                            </YAxis>
                            <Tooltip formatter={(value, name, props) => [`€ ${value}`, 'price']}/>
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#8884d8"
                                dot={{ r: 2 }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="timeframe" onChange={changeTimeframe}>
                    <label>
                        <input type='radio' name='timeframe' value='1' defaultChecked />
                        1 month
                    </label>
                    <label>
                        <input type='radio' name='timeframe' value='3'/>
                        3 month
                    </label>
                    <label>
                        <input type='radio' name='timeframe' value='6'/>
                        6 month
                    </label>
                </div>
            </div>
        </div>
    )
}

export default Product