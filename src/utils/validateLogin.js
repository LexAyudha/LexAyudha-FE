import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {jwtDecode} from 'jwt-decode';

const useVerifyLoginState = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyLoginState = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        navigate('/login');
        return;
      }

      const fetchNewAccessToken = async () => {
        try {
          const res = await axiosInstance.get('/auth/', {
            headers: { Authorization: `Bearer ${refreshToken}` },
          });

          if (res.status === 200 && res?.data?.accessToken) {
            localStorage.setItem('accessToken', res?.data?.accessToken);
            return true;
          }
        } catch (error) {
          console.error(error);
        }
        navigate('/login');
      };

      if (!accessToken) {
        return fetchNewAccessToken();
      }

      const decodedToken = jwtDecode(accessToken);
      if (decodedToken.exp < Date.now() / 1000) {
        return fetchNewAccessToken();
      }

      return true;
    };

    verifyLoginState();
  }, [navigate]);
};

export default useVerifyLoginState;