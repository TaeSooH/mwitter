import React, { useState } from "react";
import { doc, deleteDoc, updateDoc }from"firebase/firestore";
import { dbService } from "myBase";

const Mweet = ({mweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newMweet, setNewMweet] = useState(mweetObj.text);
    const MweetTextRef = doc(dbService, "mweets", `${mweetObj.id}`)
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this mweet?");
        if(ok){
            await deleteDoc(MweetTextRef); 
        }
    }
    const toggleEditing = () => setEditing(prev => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(MweetTextRef, {text:newMweet});
        setEditing(false);
    }
    const onChange = (event) => {
        const{
            target: {value},
        } = event;
        setNewMweet(value);
    }
    return(
        <div>
            {editing ?(
                <>
                    <form onSubmit={onSubmit}>
                        <input onChange={onChange} type="text" placeholder="Edit your mweet" value={newMweet} required />
                        <input type="submit" value="Update Mweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <h4>{mweetObj.text}</h4>
            )
            }
            {isOwner && <>
                <button onClick={onDeleteClick}>Delete Mweet</button>
                <button onClick={toggleEditing}>Edit Mweet</button>
                </>
            }
        </div>
    )
};

export default Mweet;