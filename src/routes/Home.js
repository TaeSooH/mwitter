import { dbService, storageService } from "myBase";
import React, { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp, getDocs, query, getDocsFromCache, orderBy, onSnapshot } from "firebase/firestore";
import Mweet from "components/Mweet";
import MweetFactory from "components/mweetFactory";

const Home = ({ userObj }) => {
    const [mweets, setMweets] = useState([]);
    useEffect( () => {
        const q = query(collection(dbService, "mweets"),orderBy("createdAt", "desc"));
        onSnapshot(q, (snapshot) => {
            const mweetArr = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setMweets(mweetArr);
        });
    }, []);
    return(
        <div className="container">
            <MweetFactory userObj={userObj} /> 
            <div style={{ marginTop: 30 }}>
                {mweets.map( (mweet) => (
                   <Mweet key={mweet.id} mweetObj={mweet} isOwner={mweet.createId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
};
export default Home;