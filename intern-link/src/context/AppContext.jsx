import { createContext, use, useEffect, useState } from "react";
import { internshipData } from "../assets/assets";
import { data } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [searchFilter, setSearchFilter] = useState({
        title:'',
        location:'',
    });
    const [isSearched,setIsSearched] = useState(true);
    const [internships, setInternships] = useState([])
    const [showRecruiterLogin,setShowRecruiterLogin] = useState(false)
    const [companyToken, setCompanyToken] = useState(null)
    const [companyData,setCompanyData] = useState(null)
//Function to fetch internships
    const fetchinternships = async () =>{
        setInternships(internshipData)
    }

    const fetchCompanyData = async () =>{
        try{
            const {data}= await axios.get(backendUrl +'/api/company/company',{headers:{token:companyToken}})
            if(data.success){
                setCompanyData(data.company)
            } else{
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }
    useEffect(() =>{
        fetchinternships()
        const storedCompanyToken = localStorage.getItem('companyToken')
        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)  
            console.log(data);
        }
    },[])
    useEffect(() =>{
        if(companyToken){
            fetchCompanyData()
        }
    },[companyToken])

    const value = {
       searchFilter,setSearchFilter,
       isSearched,setIsSearched,
       internships,setInternships,
       showRecruiterLogin,setShowRecruiterLogin,
       companyToken, setCompanyToken,
       companyData,setCompanyData,
       backendUrl
    };
    return (<AppContext.Provider value = {value}>
        {props.children}
    </AppContext.Provider>);
};