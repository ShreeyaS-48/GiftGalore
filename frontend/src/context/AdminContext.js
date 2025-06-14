import { createContext, useState, useEffect } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth";
const AdminContext = createContext({});

export const AdminProvider = ({ children }) => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [users, setUsers] = useState({});
    const [admins, setAdmins] = useState({});
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchUsers = async () => {
          setIsLoading(true)
            try {
                const response = await axiosPrivate.get("/admin/users");
                setUsers(response.data);
                setFetchError(null);
              } catch (err) {
                setFetchError(err.message);
              } finally {
                setIsLoading(false);
              }
        };
        
        const fetchAdmins = async () => {
            setIsLoading(true)
              try {
                  const response = await axiosPrivate.get("/admin/admins");
                  setAdmins(response.data);
                  setFetchError(null);
                } catch (err) {
                  setFetchError(err.message);
                } finally {
                  setIsLoading(false);
                }
          };
          fetchUsers();
          fetchAdmins();
      }, [auth, axiosPrivate]);
      
    return (
        <AdminContext.Provider value={{ 
           users, admins
             }}>
            {children}
        </AdminContext.Provider>
    )
}

export default AdminContext;