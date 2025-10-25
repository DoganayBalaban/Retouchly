"use client";

import React, { useState, useRef, useEffect } from "react";
import * as motion from "motion/react-client";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot,
  Send,
  Lightbulb,
  Sparkles,
  MessageCircle,
  Copy,
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
  const [isVisible] = useState(true);
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
      content: message || "I need help",
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
        throw new Error(response.error || "Unknown error");
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
          <div className="w-80 sm:w-96 h-[35rem] shadow-2xl border-2 border-blue-200 backdrop-blur-md bg-white/98 relative z-[10000] ring-1 ring-black/5 rounded-2xl">
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
            <div className="p-0 flex flex-col h-[30rem]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      className={`max-w-[85%] rounded-xl p-3 overflow-hidden shadow-sm ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {message.content}
                      </p>

                      {/* Suggestions */}
                      {message.suggestions &&
                        message.suggestions.length > 0 && (
                          <div className="mt-2 space-y-1 w-full overflow-hidden">
                            <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                              <Lightbulb className="w-4 h-4" />
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
                                  className="text-sm p-3 h-auto bg-white/20 hover:bg-white/30 text-left justify-start flex-1 min-w-0 whitespace-normal break-words rounded-lg"
                                >
                                  <span className="block w-full text-left">
                                    {suggestion}
                                  </span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(suggestion)}
                                  className="p-2 h-auto flex-shrink-0 rounded-lg"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Tips */}
                      {message.tips && message.tips.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4" />
                            Tips:
                          </p>
                          <ul className="text-sm space-y-2 mt-2">
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
                    <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600">
                        AI is thinking...
                      </span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {messages.length <= 1 && (
                <div className="p-3 border-t bg-gray-50/50">
                  <div className="grid grid-cols-1 gap-2">
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
                        className="text-sm justify-start h-8 px-3 hover:bg-white/80 rounded-lg"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        {action}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-3 border-t bg-gray-50/50">
                <div className="flex gap-3 items-center">
                  <Input
                    placeholder="Ask me anything about this tool..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      sendMessage(inputMessage)
                    }
                    className="text-sm h-10 flex-1 bg-white border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={() => sendMessage(inputMessage)}
                    disabled={isLoading || !inputMessage.trim()}
                    size="sm"
                    className="h-10 w-10 p-0 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg"
                  >
                    <Send className="w-4 h-4" />
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
