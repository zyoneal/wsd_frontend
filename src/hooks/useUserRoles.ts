import {useEffect, useState} from 'react';
import {UserRole} from '../constants/roles';
import {AuthService} from '../services/AuthService';

const useUserRoles = () => {
  const [roles, setRoles] = useState({
    isSA_Role: false,
  });

  useEffect(() => {
    const authoritiesList = AuthService.getAuthoritiesList();

    setRoles({
      isSA_Role: authoritiesList?.includes(UserRole.SYSTEM_ADMIN) ?? false,
    });
  }, []);

  return roles;
};

export default useUserRoles;
