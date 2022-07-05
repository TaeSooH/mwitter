import React from "react";
import { storageService, dbService } from "myBase";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { v4 } from "uuid";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";


const MweetFactory = (userObj) => {
    const [attachment, setAttachment] = useState(null);
    const [mweet, setMweet] = useState("");
    const onSubmit = async (event) => {
        if (mweet === "") {
            return;
        }
        event.preventDefault();
        let attachmentUrl = "";
        
        if(attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            await uploadString(attachmentRef, attachment, "data_url");
            //const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await getDownloadURL(ref(storageService, attachmentRef));
        }
        const mweetObj = {
            text: mweet,
            createdAt: serverTimestamp(),
            createId: userObj.userObj.uid,
            attachmentUrl,
        }
        await addDoc(collection(dbService, "mweets"), mweetObj);
        setMweet("");
        setAttachment("");
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
    const onClearAttachment = () => setAttachment("");
    return (
        <div>
            <form onSubmit={onSubmit}  className="factoryForm">
                <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={mweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
                </div>
                <label htmlFor="attach-file" className="factoryInput__label">
                    <span>Add photos</span>
                    <FontAwesomeIcon icon={faPlus} />
                </label>
                <input 
                    id="attach-file"
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    style={{
                    opacity: 0,
                }}/>
                
                {attachment && (
                    <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{
                        backgroundImage: attachment,
                        }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                    </div>
                )}
                </form>
        </div>
    )
}
export default MweetFactory