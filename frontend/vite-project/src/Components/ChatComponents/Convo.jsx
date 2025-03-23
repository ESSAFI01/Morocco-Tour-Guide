import { useState, useEffect, useRef } from "react";
import { Send, Loader2, RefreshCw, Sun, Moon } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useAuth } from "../Auth/AuthProvider";

export default function Convo() {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDark, setIsDark] = useState(() =>{
        return localStorage.getItem('Dark-Mode') === 'dark'
    })
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { token } = useAuth();


    // Auto scroll to bottom when new messages/loading appear 
    useEffect(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        if (isDark) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove(('dark'))
        }
    }, [messages, isLoading, isDark]);

    const fetchResponse = async (userQuery) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/tourist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    query: userQuery
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(`HTTP Error! Status: ${response.status}${errorData.detail ? `. ${errorData.detail}` : ''}`);
            }
            const data = await response.json();
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'Assistant', text: data.Answer }
            ]);
            //saving the conversation 
            try {
                const savingResponse = await fetch('/api/saveConversation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        query: userQuery,
                        response: data.Answer
                    })
                });
                if (savingResponse.ok) {
                    console.log('Conversation saved succesfully')
                } else {
                    console.error('Failed to save the conversation', await savingResponse.text())
                }

            } catch (saveError) {
                console.error('Error saving conversation', saveError)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setMessages(prevMessages => [
                ...prevMessages,
                { sender: 'Assistant', text: "Sorry, I encountered an error. Please try again later." }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedValue = inputValue.trim();
        if (!trimmedValue || isLoading) return;

        setMessages(prevMessages => [...prevMessages, { sender: 'User', text: trimmedValue }]);
        setInputValue("");
        fetchResponse(trimmedValue);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    // Auto-resize textarea
    const handleTextareaChange = (e) => {
        setInputValue(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
    };

    //to apply the dark mode 
    const toggleDarkMode = (e) => {
        e.preventDefault()
        setIsDark(prevMode => !prevMode)
        localStorage.setItem('Dark-Mode', !isDark ? 'dark' : 'light')
    }

    return (
        <div className={`flex w-full h-screen justify-center items-center overflow-hidden pb-24 pt-40 
        ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="overflow-y-auto h-full flex flex-col px-4 sm:px-8 md:px-16 lg:px-20 w-[90%] sm:w-[85%] md:w-[70%] lg:w-[61%]">
                {messages.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-[30%] w-full text-gray-500 text-center">
                        <h2 className={`text-2xl font-semibold mb-4 ${isDark? 'text-gray-200' : ''}`}>Welcome to Morocco Travel Assistant</h2>
                        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600' }`}>
                            Ask me anything about tourist attractions, culture, local customs, or travel tips in Morocco!
                        </p>
                    </div>
                ) : (
                    <div className="w-full flex flex-col space-y-4 pt-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === "User" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`p-4 rounded-lg shadow-sm break-words max-w-[80%] ${msg.sender === "User"
                                        ? "bg-black text-white rounded-tr-none"
                                        : isDark
                                            ? "bg-gray-800 text-white border border-gray-700 rounded-tl-none"
                                            : "bg-white text-black border border-gray-200 rounded-tl-none"
                                        }`}
                                >
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-2">
                                    <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                                    <span className="text-gray-500">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* New conversation button */}

            <button
                onClick={toggleDarkMode}
                className={`fixed top-8 right-8 p-2 rounded-full shadow-sm ${isDark
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-white border border-gray-200 hover:bg-gray-50"
                    }`}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >{isDark ?
                (
                    <Sun className="h-5 w-5 text-gray-500" />
                ) : (
                    <Moon className="h-5 w-5 text-gray-500" />
                )}

            </button>


            {/* Input form */}
            <div className={`border p-4 w-[90%] sm:w-[85%] md:w-[70%] lg:w-[61%] mx-auto rounded-2xl outline-none focus-within:border-black fixed bottom-5 left-1/2 transform -translate-x-1/2 shadow-lg 
            ${isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-gray-50 border-gray-200"
                }`}>
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                    <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about Morocco..."
                        className={`w-full p-3 rounded-lg focus:outline-none resize-none min-h-[50px] max-h-[200px] 
                            ${isDark ? 'text-gray-300 bg-gray-800': 'bg-white text-black' }`}
                        rows={1}
                        disabled={isLoading}
                        aria-label="Type your question here"
                    />
                    <button
                        type="submit"
                        className={`p-3 rounded-lg flex-shrink-0 transition-colors duration-200 ${isLoading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-black"
                            }`}
                        disabled={isLoading || !inputValue.trim()}
                        aria-disabled={isLoading || !inputValue.trim()}
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}