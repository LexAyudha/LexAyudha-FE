

import { decodeToken } from '../utils/tokenUtils';
import axiosInstance from '../api/axiosInstance';
import { QueryClient } from '@tanstack/react-query';

// Create and export a configured QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    },
  },
});

/**
 * @returns {Promise<Object>} - Returns user details from the server.
 * @description This function fetches user details from the server using the userId from the refresh token.
 */
const getUserDetails = async () => {
    const parsedToken = decodeToken('refreshToken')

    try {
        if (parsedToken) {
            const res = await axiosInstance.get(`/user/${parsedToken?.userId}`)

            if (res?.status === 200) {

                return res?.data

            }
        }

    } catch (error) {
        console.log(error)
    }
}

export {getUserDetails} 