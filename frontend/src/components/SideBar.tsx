import React, { useContext, useEffect } from "react";
import "./SideBar.css";
import { MyContext } from "../MyContext.tsx";
import {v1 as uuidv1} from "uuid";

function SideBar() {
  const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

  const getAllThreads = async () =>{
      try{
        const response = await fetch("http://localhost:3003/api/v1/thread");
        const res = await response.json();
        // console.log(res);
        const filteredData = res.map((thread:any) => ({threadId: thread.threadId, title: thread.title})); 
        //console.log(filteredData);
        setAllThreads(filteredData);
      } catch(err){
        console.log(err);
      }
  };
  useEffect(()=>{
     getAllThreads();
  },[currThreadId]);

  const createNewChat = ()=>{
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  } 

  const changeThread = async (newThreadId:number)=>{
      setCurrThreadId(newThreadId);
      try{
        const response = await fetch(`http://localhost:3003/api/v1/thread/${newThreadId}`);
        const res = await response.json();
        //console.log(res);
        setPrevChats(res);
        setNewChat(false);
        setReply(null);
      }catch(err){
        console.log(err);
      }
  }

  const deleteThread = async (threadId)=>{
          try{
        const response = await fetch(`http://localhost:3003/api/v1/thread/${threadId}`,{method:"DELETE"});
        const res = await response.json();
        
        //update threads re-render
        setAllThreads(prev => prev.filter((thread)=> thread.threadId !== threadId));

        if(threadId === currThreadId){
          createNewChat();
        }

      }catch(err){
        console.log(err);
      }
  }

  return (
    <section className="sidebar">
      {/* new chat button */}
      <button onClick={createNewChat}>
        <img src="/src/assets/blacklogo.png" alt="gpt logo" className="logo" />
        <span>
          <i className="fa-regular fa-pen-to-square"></i>
        </span>
      </button>
      {/* history */}
      <ul className="history">
        {
          allThreads?.map((thread:any, indx:any)=>(
            <li key={indx}
                onClick={(e)=>changeThread(thread.threadId)}
                className={thread.threadId === currThreadId ? "highlighted":""}
            >{thread.title}
              <i className="fa-solid fa-trash-can"
              onClick={(e)=>{
                e.stopPropagation(); // stop event bubbling
                 deleteThread(thread.threadId);
              }}
              ></i>
            </li>   
          ))
        }
      </ul>
      {/* sign */}
      <div className="sign">
        <p>By Owais &hearts;</p>
      </div>
    </section>
  );
}

export default SideBar;
