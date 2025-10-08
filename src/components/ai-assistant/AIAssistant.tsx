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
  Minimize2,
  Maximize2,
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: "assistant",
        content: `Merhaba! Ben Retouchly AI asistanınızım. Size ${getToolName(
          toolType
        )} konusunda yardımcı olabilirim. Ne yapmak istiyorsunuz?`,
        suggestions: [
          "Yaratıcı prompt önerileri ver",
          "Bu araç nasıl kullanılır?",
          "Daha iyi sonuçlar için ipuçları",
          "Trend olan görsel stilleri neler?",
        ],
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [toolType]);

  const getToolName = (tool?: string) => {
    switch (tool) {
      case "image-generation":
        return "Görsel Üretimi";
      case "face-restoration":
        return "Yüz İyileştirme";
      case "background-remover":
        return "Arka Plan Kaldırma";
      case "image-overlay":
        return "Görsel Düzenleme";
      default:
        return "AI Araçları";
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
      toast.error("AI asistan yanıt veremedi. Lütfen tekrar deneyin.");
      console.error("AI Assistant Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "Yaratıcı prompt önerileri ver":
        sendMessage(
          currentPrompt || "Yaratıcı görsel fikirleri",
          "prompt_suggestion"
        );
        break;
      case "Bu araç nasıl kullanılır?":
        sendMessage(
          `${getToolName(toolType)} aracını nasıl kullanırım?`,
          "general_help"
        );
        break;
      case "Daha iyi sonuçlar için ipuçları":
        sendMessage(
          "Daha iyi sonuçlar almak için ne yapmalıyım?",
          "creative_guidance"
        );
        break;
      case "Trend olan görsel stilleri neler?":
        sendMessage("Güncel trend görsel stilleri", "creative_guidance");
        break;
      default:
        sendMessage(action, "general_help");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Panoya kopyalandı!");
  };

  const applySuggestion = (suggestion: string) => {
    if (onPromptSuggestion) {
      onPromptSuggestion(suggestion);
      toast.success("Prompt uygulandı!");
    } else {
      copyToClipboard(suggestion);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`fixed right-4 bottom-4 z-50 ${className}`}
    >
      <Card
        className={`w-80 shadow-2xl border-2 border-blue-200 ${
          isMinimized ? "h-16" : "h-96"
        } transition-all duration-300`}
      >
        <CardHeader className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <CardTitle className="text-sm font-semibold">
                AI Asistan
              </CardTitle>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-1 h-6 w-6"
              >
                {isMinimized ? (
                  <Maximize2 className="w-3 h-3" />
                ) : (
                  <Minimize2 className="w-3 h-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="text-white hover:bg-white/20 p-1 h-6 w-6"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
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
                    className={`max-w-[85%] rounded-lg p-2 ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-xs">{message.content}</p>

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs font-semibold flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          Öneriler:
                        </p>
                        {message.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => applySuggestion(suggestion)}
                              className="text-xs p-1 h-auto bg-white/20 hover:bg-white/30 text-left justify-start"
                            >
                              {suggestion}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(suggestion)}
                              className="p-1 h-auto"
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
                          İpuçları:
                        </p>
                        <ul className="text-xs space-y-1 mt-1">
                          {message.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-1">
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
                    <span className="text-xs">Düşünüyor...</span>
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
                    "Yaratıcı prompt önerileri ver",
                    "Bu araç nasıl kullanılır?",
                    "Daha iyi sonuçlar için ipuçları",
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
                  placeholder="Mesajınızı yazın..."
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
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

// Floating AI Assistant Button
export function AIAssistantButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed right-4 bottom-4 z-40"
    >
      <Button
        onClick={onClick}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl"
      >
        <Bot className="w-6 h-6 text-white" />
      </Button>
    </motion.div>
  );
}
