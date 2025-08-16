
import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "../context/AuthProvider";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useAuth from '../hooks/useAuth';
const LOGIN_URL = '/auth';
const LOGOUT_URL = '/logout';

const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const { setAuth } = useAuth();
    const userRef = useRef();
    const errRef = useRef();
    const {auth} = useContext(AuthContext)
    const [name, setName] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const [user, setUser] = useState('Guest')
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    useEffect(() => {
        if (userRef.current)
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [name, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ name, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            console.log(roles);
            setAuth({ user:name, roles, accessToken });
            setName('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }
    const handleLogout = async()=>{
        try {
            await axiosPrivate.get(LOGOUT_URL, { withCredentials: true }); 
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            
            setAuth({});
            navigate("/"); 
        }
    }

    const getUser = async () =>{
        console.log("fetching user:")
        if(!auth?.user)
            return;
        try{
            setIsLoading(true)
            console.log(auth);
            const response = await axiosPrivate.get(`/admin/${auth.user}`);
            console.log("fetching user:", response.data)
            setUser(response.data);
            setFetchError(null);
          } catch (err) {
            setFetchError(err.message);
          } finally {
            setIsLoading(false);
          }
        }

        useEffect(() => {
            if (auth?.user) {
                getUser();
            }
        }, [auth]);
    return (
                <main className='login-page'>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    {!auth?.user ? 
                    <form onSubmit={handleSubmit} className="form">
                        <h2>Sign In</h2>
                        <label htmlFor="name">Username:</label>
                        <input
                            type="text"
                            id="name"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button
                type="button" onClick={handleSubmit}
                style={{display:"block", backgroundColor:"#82853e", color:"white", border:"none", outline:"none", padding: "7px", borderRadius:"3px", margin:"10px auto", textDecoration:"none"}}>  
                Sign In
            </button>
                        <p>
                        Need an Account?<br />
                        <span className="line">
                            <Link to = "/register"> Sign Up
                            </Link>
                        </span>
                    </p>
                    </form>
                    :
                    <div className='form'>
        <h2>Profile</h2>
        
        <p style={{minHeight:"30px"}}><span style={{fontWeight:"bold"}}>Name:</span> {user.name}</p>
        <p style={{minHeight:"30px"}}><span style={{fontWeight:"bold"}}>Email:</span> {user.email}</p>
        <p style={{minHeight:"30px"}}><span style={{fontWeight:"bold"}}>Number:</span> {user.phone}</p>
        <p style={{minHeight:"30px"}}><span style={{fontWeight:"bold"}}>Address:</span> {user.address}</p>
        <button style={{width:"100px", backgroundColor:"#82853e", color:"white", border:"none", outline:"none", padding: "5px", borderRadius:"3px", margin:"10px auto", textDecoration:"none", cursor:"pointer"}} type="button" onClick={handleLogout}>Logout</button>
        <p>
                        <span className="line">
                            <Link to = "/admin"> Go to admin dashboard
                            </Link>
                        </span>
                        </p>
    </div>
                }
                </main>
            )}
            


export default Login
