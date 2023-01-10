import { useState } from "react"
import {MdSearch} from "react-icons/md"

function Search({searchQuery, clearSearch}) {
    const [query, setQuery] = useState('')

    const searchPorduct = (event) => {
        console.log('************************')
        event.preventDefault()
        searchQuery(query)
        setQuery('')
    }

    return (
        <div className="search-container">
            <form className="search-form" onSubmit={searchPorduct} >
                <input className="search-input" value={query} onChange={({target}) => setQuery(target.value)} 
                                            type='text' minLength={3} placeholder="Search..."/>
                <button className="search-button" type="submit">
                    <MdSearch className="search-icon" size={20}/>
                </button>
            </form>
            <button onClick={clearSearch} className='clear-search'>Clear</button>
        </div>
    )
}

export default Search