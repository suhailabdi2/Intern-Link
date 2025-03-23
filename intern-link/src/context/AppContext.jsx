import { createContext, useEffect, useState } from "react";
import { internshipData } from "../assets/assets";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const [searchFilter, setSearchFilter] = useState({
        title:'',
        location:'',
    });
    const [isSearched,setIsSearched] = useState(true);
    const [internships, setInternships] = useState([])
    const [showRecruiterLogin,setShowRecruiterLogin] = useState(false)
//Function to fetch internships
    const fetchinternships = async () =>{
        setInternships(internshipData)
    }
    useEffect(() =>{
        fetchinternships()
    },[])

    const value = {
       searchFilter,setSearchFilter,
       isSearched,setIsSearched,
       internships,setInternships,
       showRecruiterLogin,setShowRecruiterLogin
    };
    return (<AppContext.Provider value = {value}>
        {props.children}
    </AppContext.Provider>);
};