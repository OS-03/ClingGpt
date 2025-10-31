import "./App.css";
import SideBar from "./components/SideBar";
import ChatWindow from "./components/ChatWindow";
import { MyContext } from "./MyContext";
import { useState } from "react";
import {v1 as uuidv1} from "uuid";

function App() {
  const [prompt,setPrompt] = useState("");
  const[reply,setReply] = useState(null);
  const[currThreadId,setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChat, setNewChat,
    allThreads, setAllThreads,
  };
  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <SideBar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  );
}

export default App;
