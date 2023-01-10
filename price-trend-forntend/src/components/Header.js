import { Link } from 'react-router-dom'
import logo from '../images/logo-white.svg'
import '../styles/home.css'
import {MdHome} from "react-icons/md"

function Header() {

    return (
        <div className='header'>
          <Link className='link' to='/'>
            <MdHome className="home-icon" size={30}/>
          </Link>
            <div className='header-title'>
              <h1>Price Trend</h1>
              <img className='logo' src={logo} alt="logo"/>
            </div>
        </div>
    )
}

export default Header