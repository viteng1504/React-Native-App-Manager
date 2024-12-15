import {createContext, useState} from 'react';

export const AuthContext = createContext({
  userId: '',
  token: '',
  username: '',
  email: '',
  isAuthenticated: false,
  authenticate: (userId, token, username, email) => {},
  logout: () => {},
});

function AuthContextProvider({children}) {
  const [userId, setUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function authenticate(userId, token, username, email) {
    setUserId(userId);
    setAuthToken(token);
    setUsername(username);
    setEmail(email);
    setIsAuthenticated(true);
  }

  function logout() {
    setUserId(null);
    setAuthToken(null);
    setUsername(null);
    setEmail(null);
    setIsAuthenticated(false);
  }

  const value = {
    userId: userId,
    token: authToken,
    username: username,
    email: email,
    isAuthenticated: isAuthenticated,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
