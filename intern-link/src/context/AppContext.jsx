import { createContext, useEffect, useState } from "react";
import { internshipData } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: '',
    });
    const [isSearched, setIsSearched] = useState(true);
    const [internships, setInternships] = useState([])
    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)
    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)
    const [userToken, setUserToken] = useState(null)
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)

    // Function to fetch internships from the database
    const fetchinternships = async () => {
        try {
            setLoading(true)
            const { data } = await axios.get(`${backendUrl}/api/internships`)
            
            if (data.success) {
                setInternships(data.internships)
            } else {
                toast.error(data.message || 'Failed to fetch internships')
                // Fallback to static data if API fails
                setInternships(internshipData)
            }
        } catch (error) {
            console.error('Error fetching internships:', error)
            toast.error('Error fetching internships. Using sample data instead.')
            // Fallback to static data if API fails
            setInternships(internshipData)
        } finally {
            setLoading(false)
        }
    }

    const fetchCompanyData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/company/company', { headers: { token: companyToken } })
            if (data.success) {
                setCompanyData(data.company)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/users/user', {
                headers: { Authorization: `Bearer ${userToken}` }
            })
            if (data.success) {
                setUserData(data.user)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchinternships()
        const storedCompanyToken = localStorage.getItem('companyToken')
        const storedUserToken = localStorage.getItem('userToken')
        
        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken)
        }
        if (storedUserToken) {
            setUserToken(storedUserToken)
        }
    }, [])

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData()
        }
    }, [companyToken])

    useEffect(() => {
        if (userToken) {
            fetchUserData()
        }
    }, [userToken])

    const value = {
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        internships, setInternships,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        userToken, setUserToken,
        userData, setUserData,
        backendUrl,
        loading
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};