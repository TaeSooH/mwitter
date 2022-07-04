import { dbService, storageService } from "myBase";
import React, { useEffect, useState } from "react";
import { collection, addDoc, serverTimestamp, getDocs, query, getDocsFromCache, orderBy, onSnapshot } from "firebase/firestore";
import Mweet from "components/Mweet";
import{ v4 as uuidv4 } from "uuid";
import { ref, uploadString } from "firebase/storage";

const Home = ({ userObj }) => {
    const [mweet, setMweet] = useState("");
    const [mweets, setMweets] = useState([]);
    const [attachment, setAttachment] = useState();
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
        const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
        const response = await uploadString(fileRef, attachment, "data_url");
        console.log(await response.ref.getDownloadURL());
        // const q = query(collection(dbService, "mweets"),orderBy("createdAt", "desc"));
        // onSnapshot(q, (snapshot) => {
        //     const mweetArr = snapshot.docs.map((document) => ({
        //         id: document.id,
        //         ...document.data(),
        //     }));
        //     setMweets(mweetArr);
        // });
    };
    const onChange = (event) => {
        const {target: {value}} = event;
        setMweet(value)
    };
    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            console.log(finishedEvent);
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const onClearAttachmentClick = () => setAttachment(null);
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input value={mweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange}/>
                <input type="submit" value="Mweet" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px"/>
                        <button onClick={onClearAttachmentClick}>Clear</button>
                    </div>
                )}
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