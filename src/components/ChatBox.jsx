import { useState, useRef, useEffect } from "react";
import { OpenAI } from "openai";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { useErrorBoundary } from "react-error-boundary";
import { Helmet } from "react-helmet-async";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

function ChatBox() {
  const { showBoundary } = useErrorBoundary();
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState(() => {
    const storedMessages = localStorage.getItem("sortedMessages");
    return storedMessages
      ? JSON.parse(storedMessages)
      : [{ id: Date.now(), text: "May I assist you today?", sender: "bot" }];
  });
  const [inputValue, setInputValue] = useState("");
  const chatInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const chatGenerator = async (userRecentMessage) => {
    try {
      setTyping(true);

      const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userRecentMessage }],
      });

      const botResponse = chatCompletion.choices[0].message.content;

      const newBotMessage = {
        id: Date.now(),
        text: botResponse,
        sender: "bot",
        messageTime: handleMessageTime(),
      };

      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      setTyping(false);
    } catch (error) {
      showBoundary(error.message);
    }
  };

  const handleMessageTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";

    return `${hours}:${minutes} ${ampm}`;
  };

  const handleChatInput = (e) => {
    e.preventDefault();

    const chatInputValue = chatInputRef.current.value.trim();

    if (chatInputValue) {
      const userNewMessage = {
        id: Date.now(),
        text: chatInputValue,
        sender: "user",
        messageTime: handleMessageTime(),
      };
      setMessages([...messages, userNewMessage]);
      setInputValue("");
      chatGenerator(userNewMessage.text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatInput(e);
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const sortedMessages = messages.sort((a, b) => a.id - b.id);
    localStorage.setItem("sortedMessages", JSON.stringify(sortedMessages));
  }, [messages]);

  const handleClearChats = () => {
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    handleScrollToEnd();
  }, [messages]);

  const handleScrollToEnd = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col w-3/4 max-md:w-full items-center py-10 px-6 min-h-full">
      <Helmet>
        <title>{`iChatAI: an AI-human chat app.`}</title>
        <meta
          name="description"
          content={`iChatAI app is an AI chat app that generates response to your question.`}
        />
      </Helmet>
      <header className="flex w-full items-center justify-between gap-4 border-b-2">
        <div className="flex items-center gap-4">
          <img
            loading="lazy"
            src="../bot.svg"
            alt="bot"
            className="w-16 h-16"
          />
          <h1 className="text-2xl font-bold">iChatAI</h1>
        </div>
        <button
          type="button"
          onClick={handleClearChats}
          className="w-10 h-10 p-2 rounded-full bg-secondary focus:outline-red-600 hover:outline-red-600 focus:border-white  border-none outline-none transition-all"
          aria-labelledby="delete all chats"
        >
          <RiDeleteBin2Fill className="w-full h-full text-white" />
        </button>
      </header>
      <main className="chat-body w-full min-h-[95%] justify-between pt-10 flex flex-col gap-4">
        <div className="chat-body w-full h-full overflow-y-scroll scrollbar-hide flex flex-col gap-6">
          {messages.map((message) => {
            return (
              <div
                key={message.id}
                className={
                  message.sender === "user"
                    ? "chat user h-max w-full flex justify-end relative"
                    : "chat chat-bot h-max flex relative"
                }
              >
                <img
                  src="../bot.svg"
                  alt="bot"
                  className={
                    message.sender === "bot"
                      ? "block w-4 h-4 absolute bottom-0"
                      : "hidden"
                  }
                />
                <p
                  className={
                    message.sender === "user"
                      ? "user-msg bg-human text-white w-max ml-6 lg:ml-[35%] text-base rounded-tr-chat-box rounded-l-chat-box p-4"
                      : "chat-bot-msg bg-bot text-white ml-4 w-max mr-6 lg:mr-[35%] text-base rounded-tl-chat-box rounded-r-chat-box p-4"
                  }
                >
                  {message.text}
                </p>
                <span
                  className={
                    message.sender === "bot"
                      ? " absolute ml-4 text-bot text-sm italic -bottom-5"
                      : "absolute ml-4 text-human text-sm italic right-0 -bottom-5"
                  }
                >
                  {message.messageTime}
                </span>
              </div>
            );
          })}
          {typing && (
            <div className="chat chat-bot flex relative h-max">
              <img
                src="../bot.svg"
                alt="bot"
                className="block w-4 h-4 absolute bottom-0"
              />
              <p className="chat-bot-msg bg-bot text-white ml-4 w-max mr-6 lg:mr-[35%] text-sm rounded-tl-chat-box rounded-r-chat-box p-4 italic">
                Typing...
              </p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form
          className="w-full h-16 rounded-chat-box bg-human flex gap-4 items-center px-4 py-2 z-10"
          onSubmit={handleChatInput}
        >
          <textarea
            ref={chatInputRef}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            value={inputValue}
            id="chat-input"
            name="chat-input"
            rows="1"
            placeholder="Ask me anything..."
            className="w-full flex leading-5 bg-transparent text-white border-none outline-none text-base placeholder:text-gray-300 focus:outline-white focus:border-white rounded-chat-box p-2 resize-none"
          />
          <button
            type="submit"
            id="send-msg"
            className="focus:outline-white focus:border-white  border-none outline-none  rounded-full w-8 h-8 p-2 flex items-center"
          >
            <img src="../send.svg" alt="send icon" />
          </button>
        </form>
      </main>
    </div>
  );
}

export default ChatBox;
