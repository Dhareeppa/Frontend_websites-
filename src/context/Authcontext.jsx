import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
  const [user, setUser] = useState( () => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null);
  const navigate = useNavigate();
  let  [loading, setloading] = useState(true)

  const loginUser = async (e) => {
    e.preventDefault();
    const response = await fetch(import.meta.env.VITE_API_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({'username': e.target.username.value, 'password':e.target.password.value }),
    });

    let data = await response.json()
    
    if(response.status === 200){
      setAuthToken(data)
      setUser(jwtDecode(data.access))
      localStorage.setItem('authTokens', JSON.stringify(data))
      navigate('/mainhome');
    } else {
      alert('Something went worng!')
    }
 };

 let logoutUser = () =>{
  setAuthToken(null)
  setUser(null)
  localStorage.removeItem("authTokens")
  navigate('/');
 }


 let updateToken = async () =>  {
  let response = await fetch(import.meta.env.VITE_API_CREATE_ACCOUNT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({'refresh':authToken.refresh}),
    });

    let data = await response.json()

    if (response.status === 200) {
      setAuthToken(data)
      setUser(jwtDecode(data.access))
      localStorage.setItem('authTokens', JSON.stringify(data))
    } else {
      logoutUser()
    }

 }

  const contextData = {
    user:user,
    authToken:authToken,
    loginUser:loginUser,
    logoutUser
    
  };

  useEffect(() =>{
    let fourMinutes = 1000 * 60 * 4
    let interval = setInterval(() => {
      if(authToken){
        updateToken()
      }
    }, fourMinutes);
    return ()=> clearInterval(interval)
  }, [authToken, loading])

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};
