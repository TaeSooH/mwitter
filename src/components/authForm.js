import React, { useState } from "react";
import { auth } from "myBase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const inputStyles = {};

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);  
    const [error, setError] = useState("");
    const toggleAccount = () => setNewAccount(prev => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        let data;
        try{
            if(newAccount){
                data = await createUserWithEmailAndPassword(auth, email, password)
            }else{
                data = await signInWithEmailAndPassword(auth, email, password)
            }
            console.log(data);
        }catch(error){
            setError(error.message.replace("Firebase: ", "").replace("(auth/weak-password).", ""));
        }
    };
    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email"){
            setEmail(value);
        }
        else if(name === "password"){
            setPassword(value);
        }
    };
    return (
        <div>
            <form onSubmit={onSubmit} className="container" >
                <input onChange={onChange} name="email" type="email" placeholder="Email" required value={email} className="authInput"/>
                <input onChange={onChange} name="password" type="password" placeholder="password" required value={password} className="authInput" />
                <input type="submit" value={newAccount ? "Create Account" : "Log In"} className="authInput authSubmit" />
            </form>
                {error && <span className="authError">{error}</span>}
            <span onClick={toggleAccount} className="authSwitch">{newAccount ? "Sign In" : "Create Account"}</span>
        </div>
    )
}
export default AuthForm