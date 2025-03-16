import {jwtDecode} from 'jwt-decode';

export const decodeToken = (tokenName) => {
  const token = localStorage.getItem(tokenName);
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};