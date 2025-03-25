"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "@/store/slices/chatSlice";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { ArrowLeft, MoreVertical, Send, Paperclip, Smile } from 'lucide-react';

export default function Chat() {
    const { chatId } = useParams();
    const dispatch = useDispatch();
    const chat = useSelector((state: RootState) =>
        state.chat.chats.find((c) => c.id === chatId)
    );
    const router = useRouter();

    const [message, setMessage] = useState("");

    useEffect(() => {
        const messages = document.querySelector(".messages-container");
        if (messages) {
            messages.scrollTop = messages.scrollHeight;
        }
    }, [chat?.messages]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (message.trim() && chat) {
            dispatch(sendMessage({ chatId: chat.id, sender: "You", text: message }));
            setMessage("");
        }
    };

    if (!chat) {
        return <div className="flex items-center justify-center h-screen text-xl">Chat not found</div>;
    }

    return (
        <div className="flex flex-col h-[89vh]">
            {/* Chat Header */}
            <div className="bg-white dark:bg-black px-4 py-3 border-b flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 dark:hover:text-black rounded-full" onClick={() => router.push("/home/chat")}>
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <h2 className="font-semibold">{chat.name}</h2>
                    <p className="text-xs text-gray-500">Active now</p>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:text-black rounded-full">
                    <MoreVertical className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 messages-container">
                {chat.messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.sender === "You"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-white dark:text-black border rounded-bl-none"
                                }`}
                        >
                            <p className="text-sm">{msg.text}</p>
                            <span className={`text-[10px] ${msg.sender === "You" ? "text-blue-100" : "text-gray-400"
                                } block mt-1`}>
                                {msg.timestamp}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-black border-t">
                <div className="flex items-center gap-2">
                    <button type="button" className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white disabled:opacity-50">
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-100 dark:text-black rounded-full outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Type a message..."
                        />
                        <button type="button" className="absolute right-3 top-2">
                            <Smile className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white disabled:opacity-50"
                        disabled={!message.trim()}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}