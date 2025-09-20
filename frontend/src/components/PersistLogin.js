import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
  const [loading, setLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh(); // ask backend for new token
      } catch (err) {
        console.error("Refresh failed", err);
      } finally {
        setLoading(false);
      }
    };

    if (!auth?.accessToken) {
      verifyRefreshToken();
    } else {
      setLoading(false);
    }
  }, []); 

  return loading ? <p>Loading...</p> : <Outlet />;
};

export default PersistLogin;
