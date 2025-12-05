"use client";

import { useState, useEffect, useRef } from "react";
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Loader2, 
  ShoppingBag, 
  Heart,
  Share2,
  Mail,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [bubbleText, setBubbleText] = useState(0);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string; products?: any[]; timestamp: Date }[]>([
    {
      role: "bot",
      content: "👋 Hello! I'm your AI shopping assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const bubbleTexts = [
    "🤖 Hi! I'm AI Assistant",
    "💬 Ask me anything!",
    "🛍️ Need shopping help?",
    "⚡ Instant replies!",
    "✨ AI Powered Shopping"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setBubbleText((prev) => (prev + 1) % bubbleTexts.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const suggestedQuestions = [
    "What are your best selling products?",
    "Show me t-shirts under $50",
    "What's your return policy?",
    "Do you have discounts today?"
  ];

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    const newMessages = [...messages, { role: "user" as const, content: userMessage, timestamp: new Date() }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      console.log(data,"data");
      
      setMessages([
        ...newMessages,
        { 
          role: "bot" as const, 
          content: data.answer, 
          products: data.products || [],
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { 
          role: "bot" as const, 
          content: "Sorry, I'm having trouble connecting. Please try again.", 
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Chat with ClothEx AI Assistant',
          text: 'Check out this amazing AI shopping assistant!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };
  const handleEmailSupport = () => {
    window.location.href = "mailto:support@clothex.com?subject=Support%20Request&body=Hello%20ClothEx%20Team,";
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/1234567890?text=Hello%20ClothEx%20Team,%20I%20need%20assistance`, '_blank');
  };

  const handleCall = () => {
    window.location.href = "tel:+1234567890";
  };

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex gap-3">
        <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
          <ShoppingBag className="h-8 w-8 text-gray-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm line-clamp-1">{product.title}</h4>
          <p className="text-xs text-gray-500 line-clamp-2">{product.description?.substring(0, 60)}...</p>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-primary">${product.price}</span>
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
              View <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      {/* Animated AI Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {/* Speech Bubble */}
        <AnimatePresence>
          {!isOpen && showBubble && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="bg-white rounded-2xl shadow-xl p-4 max-w-xs border border-gray-200 relative mr-2"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white transform rotate-45 border-r border-b border-gray-200"></div>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">AI Assistant</span>
                    <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-0.5 rounded-full">
                      ONLINE
                    </span>
                  </div>
                  <motion.p
                    key={bubbleText}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-gray-700 text-sm"
                  >
                    {bubbleTexts[bubbleText]}
                  </motion.p>
                  <button
                    onClick={() => setShowBubble(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main AI Button with Animation */}
        <motion.div
          animate={{
            y: isHovering ? [0, -5, 0] : 0,
            scale: isHovering ? 1.05 : 1
          }}
          transition={{
            y: {
              repeat: isHovering ? Infinity : 0,
              duration: 0.6,
              ease: "easeInOut"
            },
            scale: {
              duration: 0.2
            }
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <motion.button
            onClick={() => {
              setIsOpen(!isOpen);
              setShowBubble(false);
            }}
            className={`relative h-16 w-16 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center ${
              isOpen 
                ? 'bg-gradient-to-br from-red-500 to-orange-500' 
                : 'bg-gradient-to-br from-purple-600 to-pink-600'
            }`}
            whileTap={{ scale: 0.9 }}
            animate={{
              rotate: isHovering ? [0, 5, -5, 0] : 0,
            }}
            transition={{
              rotate: {
                repeat: isHovering ? Infinity : 0,
                duration: 1,
                ease: "easeInOut"
              }
            }}
          >
            {/* Pulsing Rings */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-400/30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-pink-400/20"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0, 0.3]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />

            {/* Icon */}
            <motion.div
              animate={{
                rotate: isOpen ? 180 : 0,
                scale: isHovering ? 1.2 : 1
              }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {isOpen ? (
                <X className="h-7 w-7 text-white" />
              ) : (
                <div className="relative">
                  <Brain className="h-7 w-7 text-white" />
                  <motion.div
                    className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-white"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              )}
            </motion.div>

            {/* AI Badge */}
            {!isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center"
              >
                <span className="text-white text-xs font-bold">AI</span>
              </motion.div>
            )}
          </motion.button>
        </motion.div>

        {/* Small Helper Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 1 : 0 }}
          className="text-xs text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm"
        >
          {isOpen ? "Close chat" : "Chat with AI"}
        </motion.p>
      </div>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[380px] sm:w-[420px] h-[480px]  overflow-y-auto gradient-bg rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">ClothEx AI Assistant</h3>
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                    <span>Online now</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 px-4 pt-4">
              <TabsTrigger value="chat" className="text-xs">💬 Chat</TabsTrigger>
              <TabsTrigger value="support" className="text-xs">📞 Support</TabsTrigger>
              <TabsTrigger value="suggestions" className="text-xs">✨ Suggestions</TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-background"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        {msg.role === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                        <span className="font-medium text-xs">
                          {msg.role === "user" ? "You" : "AI Assistant"}
                        </span>
                        <span className="text-xs opacity-70 ml-auto">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                      
                      {/* Products Grid */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium mb-2">📦 Related Products:</p>
                          <div className="grid gap-2">
                            {msg.products.slice(0, 3).map((product) => (
                              <ProductCard key={product.id} product={product} />
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Feedback Buttons for Bot Messages */}
                      {msg.role === "bot" && index === messages.length - 1 && (
                        <div className="flex gap-2 mt-3 pt-3 border-t">
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                            <ThumbsUp className="h-3 w-3 mr-1" /> Helpful
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                            <ThumbsDown className="h-3 w-3 mr-1" /> Not Helpful
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl p-3 max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions */}
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="text-xs h-8"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about products, prices, shipping..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={loading}
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={loading || !input.trim()}
                    className="gap-2"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  AI-powered assistant • May make mistakes • Secured connection
                </p>
              </div>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support" className="flex-1 p-4">
              <div className="space-y-4">
                <h4 className="font-bold text-lg">📞 Contact Support</h4>
                
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={handleEmailSupport}>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold">Email Support</h5>
                      <p className="text-sm text-gray-500">support@clothex.com</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={handleWhatsApp}>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold">WhatsApp Chat</h5>
                      <p className="text-sm text-gray-500">+1 (234) 567-890</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={handleCall}>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Phone className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold">Call Us</h5>
                      <p className="text-sm text-gray-500">Available 24/7</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </Card>

                <div className="pt-4">
                  <h5 className="font-semibold mb-2">⏰ Working Hours</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Monday - Friday: 9 AM - 6 PM</p>
                    <p>Saturday: 10 AM - 4 PM</p>
                    <p>Sunday: 12 PM - 5 PM</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Suggestions Tab */}
            <TabsContent value="suggestions" className="flex-1 p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <h4 className="font-bold text-lg">✨ AI Suggestions</h4>
                </div>

                <Card className="p-4 border-dashed border-2">
                  <h5 className="font-semibold mb-2">🎯 Popular Searches</h5>
                  <div className="flex flex-wrap gap-2">
                    {["T-Shirts", "Jeans", "Jackets", "Dresses", "Shoes", "Accessories"].map((item) => (
                      <Badge key={item} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="p-4">
                  <h5 className="font-semibold mb-2">💡 Shopping Tips</h5>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5"></div>
                      Ask about size charts for accurate fitting
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5"></div>
                      Check bundle deals for better discounts
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5"></div>
                      Free shipping available on orders above $100
                    </li>
                  </ul>
                </Card>

                <Button variant="outline" className="w-full gap-2">
                  <Heart className="h-4 w-4" />
                  View Wishlist
                </Button>

                <Button variant="outline" className="w-full gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  View Recent Orders
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="border-t p-3 text-center">
            <p className="text-xs text-gray-500">
              Powered by AI • <span className="text-green-500">●</span> Secure • Privacy Protected
            </p>
          </div>
        </div>
      )}
    </>
  );
}