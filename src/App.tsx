import React, {useEffect, useMemo, useState} from 'react';
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import AppRoutes from './routes/routes';
import Header from './components/Header';
import {urls} from './constants/urls';
import useAuth from './hooks/useAuth';
import {setupInterceptors} from './services/AxiosService';
import {AuthContext} from './store/AuthContext';
import {LanguageContext} from "./components/LanguageContext";

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, isLoading } = useAuth(navigate);
  const [selectedLanguage, setSelectedLanguage] = useState('uk');
  
  const authContextValue = useMemo(
      () => ({
        isLoggedIn,
        setIsLoggedIn,
      }),
      [isLoggedIn, setIsLoggedIn]
  );
  
  const languageContextValue = useMemo(
      () => ({
        selectedLanguage,
        setSelectedLanguage,
      }),
      [selectedLanguage, setSelectedLanguage]
  );
  
  useEffect(() => {
    setupInterceptors(setIsLoggedIn, navigate);
  }, [navigate, setIsLoggedIn]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isLoggedIn && location.pathname !== urls.login) {
    return <Navigate to={urls.login} />;
  }
  
  return (
      <AuthContext.Provider value={authContextValue}>
        <LanguageContext.Provider value={languageContextValue}>
          <div className="flex flex-col h-screen">
            <Header />
            <div className="flex-1 overflow-y-auto p-4">
              <AppRoutes />
            </div>
          </div>
        </LanguageContext.Provider>
      </AuthContext.Provider>
  );
};

export default App;
