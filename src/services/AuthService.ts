import {axiosService} from "./AxiosService";
import {urls} from "../constants/urls";
import {constants} from "../constants/constants";

interface AuthRequestDto {
    username: string;
    email: string;
}

interface OtpRequestDto {
    email: string;
    otp: string;
}

const AuthService = {
    
    async login(username: string, email: string): Promise<string> {
        const axiosResponse = await axiosService.post(urls.auth.login, {username, email});
        return axiosResponse.data;
    },
    
    async verify(email: string, otp: string): Promise<boolean> {
       const response = await axiosService.post(urls.auth.verify, { email, otp });
       
       const {userId, authoritiesList} = response.data
        
        this.setUserId(userId);
        this.setUserEmail(email);
        this.setAuthoritiesList(authoritiesList);
        return true;
    },

    setUserId(userId: string): void {
        return localStorage.setItem(constants.userId, userId);
    },

    getUserId(): string | null {
        return localStorage.getItem(constants.userId);
    },
    
    setUserEmail(userEmail: string): void {
        return localStorage.setItem(constants.userEmail, userEmail);
    },
    
    getUserEmail(): string | null {
        return localStorage.getItem(constants.userEmail);
    },
    
    
    setAuthoritiesList(authoritiesList: string[]): void {
        localStorage.setItem(constants.authoritiesList, JSON.stringify(authoritiesList));
    },

    getAuthoritiesList(): string[] | null {
        const authoritiesList = localStorage.getItem(constants.authoritiesList);
        return authoritiesList ? JSON.parse(authoritiesList) : null;
    },

    async logout(): Promise<void> {
        try {
            this.clearUser();
        } catch (error) {
            console.error("Error during logout:", error);
        }
    },
    
    clearUser(): void {
        localStorage.removeItem(constants.authoritiesList);
        localStorage.removeItem(constants.userId);
        localStorage.removeItem(constants.userEmail);
        localStorage.setItem(constants.isLoggedIn, "false");
    }
};

export {AuthService};
