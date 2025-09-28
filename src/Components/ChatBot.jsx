// ChatBot Component
"use client";
import { useState } from "react";
import { useChatWithBotMutation } from "@/redux/slices/products/productsApi";
import { useRouter } from 'next/navigation';

export default function ChatBot({ userId }) {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [chatWithBot, { isLoading: isBotLoading }] = useChatWithBotMutation();
    const router = useRouter();

    const handleViewDetails = (productId) => {
        router.push(`/products/${productId}`);
    };

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMessage = message;
        setMessage(""); // clear immediately

        setChat((prev) => [...prev, { role: "user", text: userMessage }]);

        try {
            const res = await chatWithBot({ userId, message: userMessage }).unwrap();

            setChat((prev) => [
                ...prev,
                {
                    role: "bot",
                    text: res.messages?.[0] || "No response",
                    products: res.recommendedProducts || [],
                },
            ]);
        } catch (err) {
            setChat((prev) => [
                ...prev,
                { role: "bot", text: "❌ Failed to respond. Try again." },
            ]);
        }
    };


    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Chat Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed cursor-pointer bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">AI Assistant</h3>
                                <p className="text-white/80 text-xs">Always here to help</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 cursor-pointer hover:text-white transition-colors p-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-96 bg-gray-50">
                        {chat.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-sm">Start a conversation!</p>
                            </div>
                        )}


                        {chat.map((c, idx) => (
                            <div key={idx} className="space-y-3">
                                <div className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl ${c.role === "user"
                                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-br-md"
                                        : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
                                        }`}>
                                        <p className="text-sm leading-relaxed">{c.text}</p>
                                    </div>
                                </div>
                                {c.products && c.products.length > 0 && (
                                    <div className="space-y-2 ml-0">
                                        {c.products.map((p) => (
                                            <div key={p.id} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                                <div className="flex flex-col space-y-2">
                                                    <h4 className="font-semibold text-gray-800 text-sm">{p.name}</h4>
                                                    {p.brand && <p className="text-xs text-emerald-600 font-medium">{p.brand}</p>}
                                                    <p className="text-xs text-gray-600 line-clamp-2">{p.description}</p>
                                                    {p.reason && <p className="text-xs text-gray-500 italic">{p.reason}</p>}
                                                    {p.price && (
                                                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                                            <span className="text-sm font-bold text-emerald-600">Rs {p.price}</span>
                                                            <button
                                                                onClick={() => handleViewDetails(p._id)}
                                                                className="text-xs cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-2 py-1 rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all">
                                                                View
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isBotLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-600 border border-gray-200 px-3 py-2 rounded-2xl text-sm shadow-sm">
                                    <div className="flex items-center space-x-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex space-x-2">
                            <input
                                disabled={isBotLoading}
                                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:bg-gray-100"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                            />

                            <button
                                onClick={handleSend}
                                disabled={!message.trim() || isBotLoading}
                                className=" cursor-pointer bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isBotLoading ? (
                                    <svg
                                        className="animate-spin h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                )}
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}