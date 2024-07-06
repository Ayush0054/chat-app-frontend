"use client";

import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import cookies from "js-cookie";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

interface ChatMessage {
  id: number;
  content: string;
  timestamp: string;
  from_user: boolean;
  user: {
    id: number;
    username: string;
  };
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUser();
    fetchMessages();
    initializeSocket();
  }, []);

  const getUser = () => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user-data");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  };

  const fetchMessages = async () => {
    const token = cookies.get("access-token");
    try {
      const response = await axios.get(`${API_URL}/chat-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const serverMessages = response?.data?.data;
      const parsedMessages = serverMessages?.map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        timestamp: msg.createdAt,
        from_user: msg.from_user,
      }));
      setMessages(parsedMessages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const initializeSocket = () => {
    //@ts-ignore
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("message", (message: string) => {
      console.log("Message from server:", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now(),
          content: message,
          timestamp: new Date().toISOString(),
          from_user: false,
          user: { id: 0, username: "server" },
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  };

  const handleSendMessage = async () => {
    if (inputMessage && user) {
      const token = cookies.get("access-token");
      try {
        const response = await axios.post(
          `${API_URL}/chat-messages/echo`,
          { data: { content: inputMessage, from_user: true } },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setInputMessage("");
        fetchMessages(); // Refresh messages
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className=" flex justify-center  mx-4 mt-32">
      <Card className="h-[600px] max-w-lg flex flex-col">
        <CardHeader>Chat with Server</CardHeader>
        <CardContent className="flex-grow border-t-2 overflow-auto pt-2">
          {messages?.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 ${
                msg.from_user === true ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-2 rounded ${
                  msg.from_user === true
                    ? "bg-blue-500 rounded-bl-2xl rounded-tl-2xl rounded-tr-2xl text-white"
                    : "bg-gray-200 rounded-br-2xl rounded-tl-2xl rounded-tr-2xl"
                }`}
              >
                {msg.content}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter>
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="mr-2"
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
