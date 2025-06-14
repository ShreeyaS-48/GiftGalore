import { createContext, useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const [auth, setAuth] = useState({});
    const axiosPrivate = useAxiosPrivate();
    useEffect(()=>{
        const logout= async() =>{
        try {
            await axiosPrivate.get("/logout", { withCredentials: true }); 
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            
            setAuth({});
        }}
        logout();
    },[])
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;