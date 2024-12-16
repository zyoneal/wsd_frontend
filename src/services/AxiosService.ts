import axios, {AxiosError} from 'axios';

import {baseURL} from '../constants/urls';
import {AuthService} from './AuthService';

const axiosService = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Accept-Language': 'uk',
  },
});

export const setupInterceptors = (
  setIsLoggedIn: (value: boolean) => void,
  navigate: (path: string) => void
) => {
  axiosService.interceptors.request.use((req) => {
    const email = AuthService.getUserEmail();
    if (email) {
      req.headers['X-User-Email'] = email;
    }
    return req;
  }, (error) => Promise.reject(error));
  
  
  axiosService.interceptors?.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        AuthService.clearUser();
        setIsLoggedIn(false);
        navigate('/login');
      } else {
        console.error('HTTP error:', error.response?.status);
        return Promise.reject(error);
      }
    }
  );
};

export { axiosService };
