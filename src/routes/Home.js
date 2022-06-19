import { dbService } from "myBase";
import React, { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp, getDocs, query, getDocsFromCache } from "firebase/firestore";
const Home = () => {
    const [mweet, setMweet] = useState("");
    const [mweets, setMweets] = useState([]);
    const getMweets = async() => {
        const q = query(collection(dbService, "mweets"));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const mweetObj = {
                ...doc.data(),
                id: doc.id,
            };
            console.log(doc.id, " => ", doc.data());
            setMweets(prev => [mweetObj, ...prev]);
        });
    }
    useEffect( () => {
        getMweets();
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault();
        await addDoc(collection(dbService, "mweets"), {
            mweet,
            createdAt: serverTimestamp(),
        })
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
                    <div key={mweet.id}>
                        <h4>{mweet.mweet}</h4>
                    </div>
                ))};
            </div>
        </div>
    )
};
export default Home;