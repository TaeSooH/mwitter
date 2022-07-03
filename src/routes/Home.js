import { dbService } from "myBase";
import React, { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp, getDocs, query, getDocsFromCache, orderBy, onSnapshot } from "firebase/firestore";
import Mweet from "components/Mweet";
const Home = ({ userObj }) => {
    const [mweet, setMweet] = useState("");
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
    const onSubmit = async (event) => {
        event.preventDefault();
        await addDoc(collection(dbService, "mweets"), {
            text: mweet,
            createdAt: serverTimestamp(),
            createId: userObj.uid,
        })
        console.log(mweets);
        setMweet("");
    }
    const onChange = (event) => {
        const {target: {value}} = event;
        setMweet(value)
    };
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input value={mweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="submit" value="Mweet" />
            </form>
            <div>
                {mweets.map( (mweet) => (
                   <Mweet key={mweet.id} mweetObj={mweet} isOwner={mweet.createId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
};
export default Home;