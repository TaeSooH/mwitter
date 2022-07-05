import React, { useState } from "react";
import { doc, deleteDoc, updateDoc }from"firebase/firestore";
import { dbService, storageService } from "myBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Mweet = ({mweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newMweet, setNewMweet] = useState(mweetObj.text);
    const MweetTextRef = doc(dbService, "mweets", `${mweetObj.id}`)
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this mweet?");
        if(ok){
            await deleteDoc(MweetTextRef);
            await storageService.refFromUrl(mweetObj.attachmentUrl).delete();
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
        <div className="nweet">
            {editing ?(
                <>
                    <form onSubmit={onSubmit} className="container nweetEdit">
                        <input onChange={onChange} type="text" placeholder="Edit your mweet" value={newMweet} required autoFocus className="formInput" />
                        <input type="submit" value="Update Mweet" className="formBtn"  />
                    </form>
                    <span onClick={toggleEditing} className="formBtn cancelBtn">
                        Cancel
                    </span>
                </>
            ) : (
                <>
                    <h4>{mweetObj.text}</h4>
                    {mweetObj.attachmentUrl && <img src={mweetObj.attachmentUrl} />}
                    {isOwner && (
                        <div className="nweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
                
            )}
            
        </div>
    )
};

export default Mweet;