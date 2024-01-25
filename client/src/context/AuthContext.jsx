import { createContext, useCallback, useState, useEffect } from "react";
import { postRequest, baseURL, getRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) =>{
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null)
    const [isRegisterLoading, setIsRegisterLoading] = useState(false)
    const [registrationInfo, setRegistrationInfo] = useState({
        name: "",
        email: "",
        password: ""
    })
    
    const [loginError, setLoginError] = useState(null)
    const [isLoginLoading, setisLoginLoading] = useState(false)
    const [loginInfo, setloginInfo] = useState({
        email: "",
        password: ""
    })

    console.log("logininfo", loginInfo)

    useEffect(()=>{
        const user = localStorage.getItem("User")
        setUser(JSON.parse(user))
    }, [])

    const updateRegisterInfo = useCallback((info) => {
        setRegistrationInfo(info)
    }, [])

    const updateLoginInfo = useCallback((info) => {
        setloginInfo(info)
    }, [])

    const registerUser = useCallback(async (event)=>{
        event.preventDefault();

        setIsRegisterLoading(true)
        setRegisterError(null)

        const response = await postRequest(`${baseURL}/users/register`, JSON.stringify(registrationInfo))
        setIsRegisterLoading(false)

        if (response.error){
            return setRegisterError(response)
        }

        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)

    }, [registrationInfo])

    const loginUser = useCallback(async (event)=>{
        event.preventDefault();
        setisLoginLoading(true)
        setLoginError(null)
        // console.log("in login user")
        
        const response = await postRequest(`${baseURL}/users/login`, JSON.stringify(loginInfo))

        setisLoginLoading(false)
        if (response.error){
            return setLoginError(response)
        }

        localStorage.setItem("User", JSON.stringify(response))
        setUser(response)

    }, [loginInfo])

    const logoutUser = useEffect(()=>{
        localStorage.removeItem("User")
        setUser(null)
    },[])

    return (
        <AuthContext.Provider value={{
                user, 
                registrationInfo, 
                updateRegisterInfo, 
                updateLoginInfo,
                registerUser, 
                registerError,
                loginError,
                loginInfo,
                isLoginLoading,
                loginUser,
                isRegisterLoading,
                logoutUser
            }}>
            {children}
        </AuthContext.Provider>
    );
};