import { auth, dbService } from "myBase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { collection, addDoc, serverTimestamp, getDocs, query, getDocsFromCache, orderBy, where, onSnapshot } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export default ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        auth.signOut();
        history.push("/");
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await updateProfile(auth.currentUser, { displayName: newDisplayName });
            refreshUser();
        }
    }
    return(
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input type="text" placeholder="Display name" autoFocus onChange={onChange} value={newDisplayName} className="formInput"/>
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    )
};