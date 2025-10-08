"use client";

import React, { useState, useRef, useEffect } from "react";
import * as motion from "motion/react-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Bot,
  Send,
  Lightbulb,
  Sparkles,
  MessageCircle,
  Copy,
  ThumbsUp,
  RefreshCw,
  X,
} from "lucide-react";
import { getAIAssistanceAction } from "@/app/actions/ai-assistant";
import toast from "react-hot-toast";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  suggestions?: string[];
  tips?: string[];
  timestamp: Date;
}

interface AIAssistantProps {
  toolType?:
    | "image-generation"
    | "face-restoration"
    | "background-remover"
    | "image-overlay";
  currentPrompt?: string;
  imageUrl?: string;
  onPromptSuggestion?: (prompt: string) => void;
  className?: string;
}

export default function AIAssistant({
  toolType,
  currentPrompt,
  imageUrl,
  onPromptSuggestion,
  className = "",
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for open AI assistant event
  useEffect(() => {
    const handleOpenAIAssistant = () => {
      setIsMinimized(false);
    };

    window.addEventListener("openAIAssistant", handleOpenAIAssistant);
    return () => {
      window.removeEventListener("openAIAssistant", handleOpenAIAssistant);
    };
  }, []);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: `Hello! I'm your Retouchly AI assistant. I can help you with ${getToolName(
          toolType
        )}. What would you like to do?`,
        suggestions: [
          "Give me creative prompt suggestions",
          "How do I use this tool?",
          "Tips for better results",
          "What are trending visual styles?",
        ],
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [toolType]);

  const getToolName = (tool?: string) => {
    switch (tool) {
      case "image-generation":
        return "Image Generation";
      case "face-restoration":
        return "Face Restoration";
      case "background-remover":
        return "Background Removal";
      case "image-overlay":
        return "Image Editing";
      default:
        return "AI Tools";
    }
  };

  const sendMessage = async (
    message: string,
    type:
      | "prompt_suggestion"
      | "image_analysis"
      | "creative_guidance"
      | "general_help" = "general_help"
  ) => {
    if (!message.trim() && type === "general_help") return;

    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message || "Yardım istiyorum",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    try {
      const response = await getAIAssistanceAction({
        type,
        context: {
          imageUrl,
          currentPrompt,
          toolType,
          userGoal: message,
        },
        message,
      });

      if (response.success && response.data) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: response.data.explanation,
          suggestions: response.data.suggestions,
          tips: response.data.tips,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || "Bilinmeyen hata");
      }
    } catch (error) {
      toast.error("AI assistant couldn't respond. Please try again.");
      console.error("AI Assistant Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "Give me creative prompt suggestions":
        sendMessage(
          currentPrompt || "Creative visual ideas",
          "prompt_suggestion"
        );
        break;
      case "How do I use this tool?":
        sendMessage(
          `How do I use the ${getToolName(toolType)} tool?`,
          "general_help"
        );
        break;
      case "Tips for better results":
        sendMessage(
          "What should I do to get better results?",
          "creative_guidance"
        );
        break;
      case "What are trending visual styles?":
        sendMessage("Current trending visual styles", "creative_guidance");
        break;
      default:
        sendMessage(action, "general_help");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const applySuggestion = (suggestion: string) => {
    if (onPromptSuggestion) {
      onPromptSuggestion(suggestion);
      toast.success("Prompt applied!");
    } else {
      copyToClipboard(suggestion);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className={`fixed right-2 sm:right-4 bottom-4 z-[9999] ${className}`}
    >
      {/* Floating Button */}
      {isMinimized && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <Button
            onClick={() => setIsMinimized(false)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl backdrop-blur-sm border border-white/20 relative overflow-hidden"
          >
            <Bot className="w-6 h-6 text-white" />
            {/* Pulse animation */}
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
          </Button>
          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">!</span>
          </div>
        </motion.div>
      )}

      {/* Expanded Chat */}
      {!isMinimized && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="w-72 sm:w-80 h-[30rem] shadow-2xl border-2 border-blue-200 backdrop-blur-md bg-white/98 relative z-[10000] ring-1 ring-black/5 rounded-2xl">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <CardTitle className="text-sm font-semibold">
                    AI Assistant
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="text-white hover:bg-white/20 p-1 h-6 w-6 rounded-full"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="p-0 flex flex-col h-[25rem]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[90%] rounded-lg p-2 overflow-hidden ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-xs">{message.content}</p>

                      {/* Suggestions */}
                      {message.suggestions &&
                        message.suggestions.length > 0 && (
                          <div className="mt-2 space-y-1 w-full overflow-hidden">
                            <p className="text-xs font-semibold flex items-center gap-1">
                              <Lightbulb className="w-3 h-3" />
                              Suggestions:
                            </p>
                            {message.suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-1 w-full"
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => applySuggestion(suggestion)}
                                  className="text-xs p-2 h-auto bg-white/20 hover:bg-white/30 text-left justify-start flex-1 min-w-0 whitespace-normal break-words"
                                >
                                  <span className="block w-full text-left">
                                    {suggestion}
                                  </span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(suggestion)}
                                  className="p-1 h-auto flex-shrink-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Tips */}
                      {message.tips && message.tips.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Tips:
                          </p>
                          <ul className="text-xs space-y-1 mt-1">
                            {message.tips.map((tip, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-1"
                              >
                                <span>•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-100 rounded-lg p-2 flex items-center gap-2">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span className="text-xs">Thinking...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {messages.length <= 1 && (
                <div className="p-2 border-t bg-gray-50">
                  <div className="grid grid-cols-1 gap-1">
                    {[
                      "Give me creative prompt suggestions",
                      "How do I use this tool?",
                      "Tips for better results",
                    ].map((action) => (
                      <Button
                        key={action}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuickAction(action)}
                        className="text-xs justify-start h-6 px-2"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-2 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && sendMessage(inputMessage)
                    }
                    className="text-xs h-8"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={isLoading || !inputMessage.trim()}
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Send className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
