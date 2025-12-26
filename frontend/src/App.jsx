import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messageRef =  useRef(null);

  const scrollToBottom = ()=>{
    messageRef.current?.scrollIntoView({behavior: "smooth"});
  }

  useEffect(()=>{
    scrollToBottom()
  },[messages]);

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(!input.trim()) return;

    setMessages(
      (prevMessages)=>[
        ...prevMessages, {text:input, sender:"user"}
      ]    
    );
    setInput("");

     setMessages(
      (prevMessages)=>[
        ...prevMessages, {text:"ai is thinking", sender:"AI", thinking:true}
      ]    
    );    
    
    try{
      const res = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers : { "Content-Type": "application/json" },
        body: JSON.stringify({question: input}),
      });

      const data = await res.json();
      console.log(data);

      setMessages((prev) => 
        prev.map((msg)=>
          msg.thinking ?{text:data.reply, sender:"ai"}:msg
      ));

    }catch(error){
      setMessages((prev) => 
        prev.map((msg)=>
          msg.thinking ?{text:"sorry, something went wrong I cant think now...", sender:"ai"}:msg
      ));
    }
    console.log(messages);
  };

 
  return (
    <div className='main app min-h-screen flex items-center justify-between flex-col py-5 px-0 w-full mb-2
    '>
      <div className='top-content flex flex-col items-center w-100vw flex-1 text-white max-w-2xl'>
        <header className='mb-5 font-bold text-2xl'>Talk With Me</header>

        <div className={`message-container overflow-y-auto w-[70vw] h-[75vh] no-scrollbar text-amber-50 ${messages.length === 0 ? "" :"border-2 p-5" }  border-[#35094f] rounded-2xl mb-2`} >

          {messages.map((msg, key)=>
          ( msg.sender === "user" ? 
            <div key={key} className='flex justify-end w-full mb-5'>
              <div  className={`flex gap-2 max-w-[60%] bg-[#c27e2c] rounded-xl px-4 py-2 break-words `}>
                <div className="whitespace-pre-wrap break-words">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
 
                <strong>user</strong>             
              </div>
            </div>
          
          :
          <div key={key}  className='flex justify-start w-full mb-5'>
            <div className={`flex gap-2 lg:max-w-[60%] sm:max-w-[100%] bg-[#3d1663] rounded-xl px-3 py-2 break-words ${msg.thinking? "text-gray-500" :""}`}>
              <strong>AI</strong>            
              <div className="whitespace-pre-wrap break-words">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>          
            </div>
          </div>
          
          )

          )}
          <div ref={messageRef}></div>
        </div>
      </div>
      

      <div className='input-box lg:w-[70vw] lg:max-w-2xl sm:w-full'>
        <form className='flex gap-2' onSubmit={handleSubmit}>
          <input 
            className='border-2 border-[#ff9100] flex flex-1 w-full rounded-2xl text-white p-3' 
            type="text" 
            name='chat-input'
            value={input} 
            onChange={(e)=>setInput(e.target.value)} 
          />
          <button  className='bg-[#c27e2c] px-5 py-3  rounded-xl text-white border-3 border-[#58085e]'>send</button>
        </form>
      </div>
      
      
      
    </div>
  )
}

export default App
