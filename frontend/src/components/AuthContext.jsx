import { LocalStorage, requestHandler } from "../utils/index.js";
import { createContext, useContext, useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin, userRegister, logoutUser } from "../api/api.js";
import Loader from "./Loader.jsx";

const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Create a hook to access the AuthContext
const useAuth = () => useContext(AuthContext);

// Create a component that provides authentication-related data and functions
const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const navigate = useNavigate();

  // Function to handle user login
  const login = async (data) => {
    await requestHandler(
      async () => await userLogin(data),
      setIsLoading,
      (res) => {
        const { data } = res;
        setUser(data.user);
        setToken(data.accessToken);
        LocalStorage.set("user", data.user);
        LocalStorage.set("token", data.accessToken);
        navigate("/landingPage"); 
      },
      alert // Display error alerts on request failure
    );
  };

  // Function to handle user registration
  const register = async (data) => {
    console.log("Registering");
    await requestHandler(
      async () => await userRegister(data),
      setIsLoading,
      () => {
        alert("Account created successfully! Go ahead and login.");
        navigate("/login"); // Redirect to the login page after successful registration
      },
      alert // Display error alerts on request failure
    );
  };

  // Function to handle user logout
  const logout = async () => {
    await requestHandler(
      async () => await logoutUser(),
      setIsLoading,
      () => {
        setUser(null);
        setToken(null);
        LocalStorage.clear(); // Clear local storage on logout
        navigate("/login"); // Redirect to the login page after successful logout
      }, // Display error alerts on request failure
      alert
    );
  };

  // Check for saved user and token in local storage during component initialization
  useEffect(() => {
    setIsLoading(true);
    const _token = LocalStorage.get("token");
    const _user = LocalStorage.get("user");
    if (_token && _user?._id) {
      setUser(_user);
      setToken(_token);
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, token }}>
      {isLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export { AuthContext, useAuth, AuthProvider };
