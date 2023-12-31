import { getUserCustomIn } from "../api/userApi";
import { useState, useEffect } from "react";

export const useUserStatus = (employeeCode) => {
    const [data, setData] = useState({ loading: true, custom_in: null, error: null, custom_loction: null ,custom_radius:null});

    const fetchStatus = async () => {
        try {
            await getUserCustomIn(employeeCode).then((jsonData) => {
                const [{ custom_in }] = jsonData.data;
                const [{ custom_restrict_location }] = jsonData.data;
                const [{ custom_reporting_radius }] = jsonData.data;
                
                setData(prev => ({ ...prev, custom_in: custom_in, loading: false, custom_loction: custom_restrict_location,custom_radius:custom_reporting_radius }));
            }).catch((error) => {
                setData(prev => ({ ...prev, error: error, loading: false }));
            });

        } catch (error) {
            setData(prev => ({ ...prev, error: error, loading: false }));
        }
    };

    const retry = () => {
        setData(({ loading: true, custom_in: null, error: null, custom_loction: null,custom_radius:null }))
        fetchStatus();
    };

    useEffect(() => {
        fetchStatus();
    }, [employeeCode]);
    return { ...data, retry };
}
