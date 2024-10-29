"use client";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";

const serverUrl = "http://localhost:8000";
type Message = {
  content: string;
  role: string;
};

export const InventoryAIChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { content: "Hi, what can I help you with today?", role: "assistant" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      const updatedMessages = [...messages, { content: input, role: "user" }];

      setMessages(updatedMessages);
      setInput("");
      //Make request to the server
      fetch(`${serverUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("res_data", data);
          setMessages((prev) => [...prev, data.message]);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Inventory AI</h2>
      </div>
      <ScrollArea className="h-[80vh] p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } mb-4`}
          >
            <div
              className={`flex items-start gap-2.5 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="w-8 h-8">
                {message.role === "user" ? (
                  <User className="w-6 h-6" />
                ) : (
                  <Bot className="w-6 h-6" />
                )}
              </Avatar>
              <div
                className={`p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t flex gap-2">
        <Input
          placeholder="Write your message here"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
