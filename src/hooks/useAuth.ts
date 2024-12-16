import {useEffect, useState} from 'react';
import {NavigateFunction} from 'react-router-dom';

import {AuthService} from '../services/AuthService';
import {constants} from '../constants/constants';
import {setupInterceptors} from "../services/AxiosService";

const useAuth = (navigate: NavigateFunction) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        const saved = localStorage.getItem(constants.isLoggedIn);
        return saved ? JSON.parse(saved) : false;
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const accessUser = AuthService.getUserEmail();
            if (accessUser) {
                setIsLoggedIn(true);
            }
            setIsLoading(false);
        };
        checkLoginStatus();
    }, []);

    useEffect(() => {
        localStorage.setItem(constants.isLoggedIn, JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    useEffect(() => {
        setupInterceptors(setIsLoggedIn, navigate);
    }, [navigate, setIsLoggedIn]);

    return {isLoggedIn, setIsLoggedIn, isLoading};
};

export default useAuth;
