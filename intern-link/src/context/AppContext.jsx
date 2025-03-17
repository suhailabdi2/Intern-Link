import { createContext, useState } from "react";

const AppContext = createContext()

export const AppContextProvider = (props) => {

    const [searchFilter, setSearchFilter] = useState({
        title:'',
        location:'',
    })
    const [isSearched,setIsSearched] = useState(false)
    const value = {
       searchFilter,setSearchFilter,
       isSearched,setIsSearched,

    }
    return (<AppContext.Provider value = {value}>
        {props.children}
    </AppContext.Provider>)
}