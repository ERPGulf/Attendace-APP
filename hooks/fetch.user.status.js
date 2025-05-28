import { useState, useEffect } from 'react';
import { getUserCustomIn } from '../api/userApi';

export const useUserStatus = employeeCode => {
  const [data, setData] = useState({
    loading: true,
    custom_in: null,
    error: null,
    custom_loction: null,
    custom_radius: null,
  });

  const fetchStatus = async () => {
    try {
      await getUserCustomIn(employeeCode)
        .then(jsonData => {
          const {
            custom_in,
            custom_restrict_location,
            custom_reporting_radius,
          } = jsonData;

          setData(prev => ({
            ...prev,
            custom_in,
            loading: false,
            custom_loction: custom_restrict_location,
            custom_radius: custom_reporting_radius,
          }));
        })
        .catch(error => {
          setData(prev => ({ ...prev, error, loading: false }));
        });
    } catch (error) {
      setData(prev => ({ ...prev, error, loading: false }));
    }
  };

  const retry = () => {
    setData({
      loading: true,
      custom_in: null,
      error: null,
      custom_loction: null,
      custom_radius: null,
    });
    fetchStatus();
  };

  useEffect(() => {
    fetchStatus();
  }, [employeeCode]);
  return { ...data, retry };
};
