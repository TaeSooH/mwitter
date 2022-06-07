import { dbService } from "myBase";
import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
const Home = () => {
    const [mweet, setMweet] = useState("");
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
        </div>
    )
};
export default Home;