

import { decodeToken } from '../utils/tokenUtils';
import axiosInstance from '../api/axiosInstance';

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

const getLessons = async () => {

  try {
    const res = await axiosInstance('/user/dyslexic?sentence_count=10&refresh=false')

    if (res?.status === 200) {
      return res?.data;
    }
  } catch (error) {
    console.log(error)
  }

}

const getQuizzes = async () => {

  try {
    const res = await axiosInstance('/user/dyslexic/quiz?sentence_count=10&quiz_count=8')

    if (res?.status === 200) {
      return res?.data;
    }
  } catch (error) {
    console.log(error)
  }

}

export { getUserDetails, getLessons, getQuizzes } 
