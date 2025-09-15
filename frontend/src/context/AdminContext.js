import { createContext, useState, useEffect } from "react";
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from "../hooks/useAuth";
const AdminContext = createContext({});

export const AdminProvider = ({ children }) => {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [orders, setOrders] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [ordersPage, setOrdersPage] = useState(1);
    const [totalOrdersPages, setTotalOrdersPages] = useState(1);
    const [usersPage, setUsersPage] = useState(1);
    const [totalUsersPages, setTotalUsersPages] = useState(1);
    const fetchOrders = async () => {
      if (!auth?.accessToken) 
        return;
      setIsLoading(true)
        try {
            const response = await axiosPrivate.get(`/orders?page=${ordersPage}&limit=5`);
            setOrders(response.data.orders);
            setTotalOrdersPages(response.data.totalPages);
            setFetchError(null);
          } catch (err) {
            setFetchError(err.message);
          } finally {
            setIsLoading(false);
          }
    };
    const fetchUsers = async () => {
      if (!auth?.accessToken) 
        return;
      setIsLoading(true)
        try {
            const response = await axiosPrivate.get(`/admin/users?page=${usersPage}&limit=5`);
            setUsers(response.data.users);
            setTotalUsersPages(response.data.totalPages);
            setFetchError(null);
          } catch (err) {
            setFetchError(err.message);
          } finally {
            setIsLoading(false);
          }
    };
    useEffect(() => {
      if (!auth?.accessToken) 
        return;

        const fetchAdmins = async () => {
          if (!auth?.accessToken) 
            return;
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
          fetchOrders();
      }, [auth]);
      const handleDeleteUser= async (id)=>{
        if (!auth?.accessToken) 
          return;
        try {
          await axiosPrivate.delete("/admin", {
            data: { id },
          });
          const response1 = await axiosPrivate.get("/admin/users");
          setUsers(response1.data);
          const response2 = await axiosPrivate.get("/admin/admins");
          setAdmins(response2.data);
          console.log("User Deleted");
        } catch (err) {
          setFetchError(err.message);
        }
      }
      const handleDelivery = async (id) =>{
        if (!auth?.accessToken) 
          return;
        try {
          await axiosPrivate.patch(`/orders`, {
             orderId:id 
          });
      
          console.log("Order marked as delivered");
          setOrders(prev =>
            prev.map(order =>
              order._id === id ? { ...order, status: 1 } : order
            )
          );
         
        } catch (err) {
          console.error("Failed to mark as delivered:", err);
        }
      }
    return (
        <AdminContext.Provider value={{ 
           users, admins, handleDeleteUser, orders, fetchOrders, handleDelivery, ordersPage, setOrdersPage, totalOrdersPages,
           usersPage, setUsersPage, totalUsersPages, fetchUsers
             }}>
            {children}
        </AdminContext.Provider>
    )
}

export default AdminContext;