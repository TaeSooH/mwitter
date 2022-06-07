import { async } from "@firebase/util";
import { auth, firebaseInstance } from "myBase";
import React, {useState} from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);  
    const [error, setError] = useState("");
    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email"){
            setEmail(value);
        }
        else if(name === "password"){
            setPassword(value);
        }
    };
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
    const toggleAccount = () => setNewAccount(prev => !prev);
    const onSocialClick = async (event)  => {
        let provider;
        const {target: {name} } = event;
        if(name === "google"){
            provider = new GoogleAuthProvider();
        }else if(name === "github"){
            provider = new GithubAuthProvider();
        }
        const data = await signInWithPopup(auth, provider);
        console.log(data);
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} name="email" type="email" placeholder="Email" required value={email}/>
                <input onChange={onChange} name="password" type="password" placeholder="password" required value={password}/>
                <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
        </form>
        <span onClick={toggleAccount}>{newAccount ? "Sign In" : "Create Account"}</span>
        {error}
        <div>
            <button onClick={onSocialClick} name="google">Countinue with Google</button>
            <button onClick={onSocialClick} name="github">Countinue with Github</button>
        </div>
    </div>
    );
};
export default Auth;
