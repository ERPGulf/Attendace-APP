import { getUserCustomIn } from "../api/userApi";
import { useState, useEffect } from "react";

export const useUserStatus = (employeeCode) => {
    const [data, setData] = useState({ loading: false, custom_in: null, error: null, custom_loction: null });

    const fetchStatus = async () => {
        try {
            setData(prev => ({ ...prev, loading: true, error: null }));
            getUserCustomIn(employeeCode).then((jsonData) => {
                const [{ custom_in }] = jsonData.data;
                const [{ custom_restrict_location }] = jsonData.data;
                setData(prev => ({ ...prev, custom_in: custom_in, loading: false, custom_loction: custom_restrict_location }));
            }).catch((error) => {
                setData(prev => ({ ...prev, error: error, loading: false }));
            });

        } catch (error) {
            setData(prev => ({ ...prev, error: error, loading: false }));
        }
    };

    const retry = () => {
        fetchStatus();
    };

    useEffect(() => {
        fetchStatus();
    }, [employeeCode]);
    return { ...data, retry };
}
