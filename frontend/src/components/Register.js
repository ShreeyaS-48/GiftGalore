import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import {Link} from 'react-router-dom'
const REGISTER_URL = '/register';
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PHONE_REGEX = /^(\+91|\+91\-|0)?[789]\d{9}$/;

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();
    const [name, setName] = useState("");
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [number, setNumber] = useState("");
    const [validNuumber, setValidNumber] = useState(false);
    const [numberFocus, setNumberFocus] = useState(false);
    const [address, setAddress] = useState("");
    const [AddressFocus, setAddressFocus] = useState(false);
    
    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(name));
    }, [name])
    
    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email])

    useEffect(() => {
        setValidNumber(PHONE_REGEX.test(number));
    }, [number])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
    }, [pwd])

    useEffect(() => {
        setErrMsg('');
    }, [name, pwd, email, number])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(name);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = EMAIL_REGEX.test(email);
        const v4 = PHONE_REGEX.test(number);
        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ name, email, address, password:pwd, phone: number }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setName('');
            setPwd('');
            setEmail('');
            setAddress('');
            setNumber('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <main className='login-page'>
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <form className="form">
            <h2>Register</h2>
            <label htmlFor='name'>Name:
                <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validName || !name ? "hide" : "invalid"} />
            </label>
            <input
                type="text"
                ref={userRef}
                value={name}
                id="name"
                autoComplete="off"
                onChange={(e)=>setName(e.target.value)}
                required
                aria-invalid={validName ? "false" : "true"}
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
            />
            <label htmlFor="password">
                Password:
                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
            </label>
            <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                aria-invalid={validPwd ? "false" : "true"}
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
            />
            <label htmlFor='email'>Email:
                <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
            </label>
            <input
                type="email"
                value={email}
                id="email"
                aria-invalid={validEmail ? "false" : "true"}
                onChange={(e)=>setEmail(e.target.value)}
                required
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
            />
            <label htmlFor='mobile'>Mobile: 
            <FontAwesomeIcon icon={faCheck} className={validNuumber ? "valid" : "hide"} />
            <FontAwesomeIcon icon={faTimes} className={validNuumber || !number ? "hide" : "invalid"} />
            </label>
            <input
            type="tel"
            value={number}
            id="mobile"
            aria-invalid={validEmail ? "false" : "true"}
            onChange={(e)=>setNumber(e.target.value)}
            onFocus={() => setNumberFocus(true)}
            onBlur={() => setNumberFocus(false)}
            required
            />
            <label htmlFor='address'>Address: </label>
            <textarea
            value={address}
            id="address"
            onChange={(e)=>setAddress(e.target.value)}
            onFocus={() => setAddressFocus(true)}
            onBlur={() => setAddressFocus(false)}
            required
            />
            <button
                type="button" onClick={handleSubmit}
                style={{display:"block", backgroundColor:"#82853e", color:"white", border:"none", outline:"none", padding: "7px", borderRadius:"3px", margin:"10px auto", textDecoration:"none"}}>  
                Submit
            </button>
            <p>
                        Already registered?<br />
                        <span className="line">
                            <Link to = "/auth"> Sign In
                            </Link>
                        </span>
                    </p>
        </form>
        </main>
    )
}

export default Register
