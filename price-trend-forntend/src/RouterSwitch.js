import { Routes, Route, useMatch } from "react-router-dom";
import App from "./App";
import Product from "./Product";

const RouteSwitch = () => {
    const match = useMatch('/:sku')
    const productSku = match ? match.params.sku : null

    return (
        <Routes>
            <Route path="/:sku" element={<Product sku={productSku}/>} />
            <Route path="/" element={<App />} />
        </Routes>
    );
};

export default RouteSwitch;