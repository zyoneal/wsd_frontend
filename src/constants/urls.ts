const baseURL = "http://localhost:8080/api/";

const users = 'users';
const roles = 'roles';
const authLogin = 'auth/login';
const authVerify = 'auth/verify';
const login = '/login';
const logout = 'auth/logout';
const cabinet = 'cabinet';
const dictionary = 'dictionary';
const dictionaryResources = 'dictionary/resources';
const subtitles = 'subtitles';
const uploadSubtitles = 'subtitles/upload';

const urls = {
  users: users,
  roles: roles,
  auth: {
    login: authLogin,
    logout: logout,
    verify: authVerify,
  },
  login: login,
  cabinet: cabinet,
  dictionary: dictionary,
  dictionaryResources: dictionaryResources,
  subtitles: subtitles,
  uploadSubtitles: uploadSubtitles,
};

export { baseURL, urls };
