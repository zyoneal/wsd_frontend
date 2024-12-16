import {baseURL, urls} from '../constants/urls';
import {UserDto} from '../interfaces/response/UserDto';
import {IRes} from '../types/IRes';
import {AuthService} from './AuthService';
import {axiosService} from './AxiosService';
import {UpdateUserDto} from "../interfaces/request/UpdateUserDto";

const userService = {
  
  getUserById: (userId: string): IRes<UserDto> => {
    return axiosService.get(`${baseURL}${urls.users}/${userId}`);
  },

  getCabinetInfo: (): IRes<UserDto> => {
    const userId = AuthService.getUserId();
    return axiosService.get(`${baseURL}${urls.users}/${userId}`);
  },
  
  updateUserInfo: (user: UpdateUserDto, userId: string): IRes<void> => {
    return axiosService.put(`${baseURL}${urls.users}/${userId}`, user);
  },
  
};

export { userService };
