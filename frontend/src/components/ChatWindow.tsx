import React, { useEffect } from "react";
import Chat from "./shared/Chat";
import "./ChatWindow.css";
import { MyContext } from "../MyContext";
import { useContext, useState } from "react";
import { PuffLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setNewChat(false);
    const userMessage = prompt;
    setPrompt(""); // Clear input for UX

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        threadId: currThreadId,
      }),
    };
    try {
      const response = await fetch(
        "http://localhost:3003/api/v1/chat",
        options
      );
      const result = await response.json();
      setReply(result.reply);
      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: userMessage },
        { role: "assistant", content: result.reply },
      ]);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleProfileClick = () =>{
    setIsOpen(!isOpen);
  }

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          ClingGpt <i className="fa-solid fa-chevron-down"></i>
        </span>
        <div className="userIconDiv" onClick={handleProfileClick}>
          <span className="userIcon">
            <i className="fa-regular fa-user"></i>
          </span>
        </div>
      </div>
      {isOpen && (
        <div className="dropDown">
          <div className="dropDownItem">
            <i className="fa-solid fa-gear"></i>Settings
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan
          </div>
          <div className="dropDownItem">
            <i className="fa-solid fa-right-from-bracket"></i>Logout
          </div>
        </div>
      )}
      <Chat />
      <PuffLoader color="#FFF" loading={loading} />
      <div className="chatInput">
        <div className="userInput">
          <input
            type="text"
            placeholder="Ask Anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : undefined)}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-regular fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          ClingGpt can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
