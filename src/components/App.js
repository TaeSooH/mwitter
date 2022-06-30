import React, {useEffect, useState} from "react";
import AppRouter from "components/Router";
import {auth} from "myBase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
  const [userObj, setUserObj] = useState(null);
  useEffect( () => {
    auth.onAuthStateChanged((user) =>{
      if(user){
        setIsLoggedIn(true);
        setUserObj(user);
      }else{
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
    {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} /> : "initializing..."}
    </>
  )
}

export default App;
