import { useState } from "react"
import { getContracts } from "../api/userApi"


export const getFieldValue = (searchTerms = "") => {
    const [data, setData] = useState({ isloading: true, apiData: null, error: null })
    try {
        const formData = new FormData()
        formData.append('name', searchTerms)
        const fetchContracts = () => {
            getContracts(searchTerms)
        }
    } catch (error) {
        return error
    }
}