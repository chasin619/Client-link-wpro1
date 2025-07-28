'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    MessageCircle,
    Send,
    X,
    Minimize2,
    Phone,
    Video,
    MoreVertical,
    Paperclip
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from './chat-message';
import { ChatHeader } from './chat-header';
import { MessageInput } from './message-input';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'vendor';
    timestamp: Date;
    type?: 'text' | 'image' | 'file';
    status?: 'sent' | 'delivered' | 'read';
}

interface ChatWidgetProps {
    vendorName?: string;
    vendorAvatar?: string;
    isOnline?: boolean;
    primaryColor?: string;
    onSendMessage?: (message: string) => void;
    initialMessages?: Message[];
}

export function ChatWidget({
    vendorName = "Wedding Support",
    vendorAvatar,
    isOnline = true,
    primaryColor = "#3b82f6",
    onSendMessage,
    initialMessages = []
}: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Hi! I'm here to help with your wedding planning. How can I assist you today?`,
            sender: 'vendor',
            timestamp: new Date(),
            status: 'read'
        },
        ...initialMessages
    ]);
    const [unreadCount, setUnreadCount] = useState(1); // Set to 1 to show notification initially
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Prevent scroll propagation to parent
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (!chatWindowRef.current) return;

            // Check if the event target is within the chat window
            if (chatWindowRef.current.contains(e.target as Node)) {
                e.stopPropagation();

                // Get the scroll area element
                const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
                if (scrollElement) {
                    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
                    const isAtTop = scrollTop === 0;
                    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

                    // Only prevent default if we're not at the boundaries or we're scrolling in the opposite direction
                    if ((!isAtTop && e.deltaY < 0) || (!isAtBottom && e.deltaY > 0)) {
                        e.preventDefault();
                    }
                }
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!chatWindowRef.current) return;

            if (chatWindowRef.current.contains(e.target as Node)) {
                e.stopPropagation();
            }
        };

        if (isOpen) {
            // Add event listeners with capture to intercept events early
            document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
            document.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });

            // Prevent body scroll when chat is open
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('wheel', handleWheel, { capture: true });
            document.removeEventListener('touchmove', handleTouchMove, { capture: true });
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSendMessage = () => {
        if (!message.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: message,
            sender: 'user',
            timestamp: new Date(),
            status: 'sent'
        };

        setMessages(prev => [...prev, newMessage]);
        setMessage('');

        if (onSendMessage) {
            onSendMessage(message);
        }

        // Simulate vendor typing and response
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const response: Message = {
                id: (Date.now() + 1).toString(),
                text: "Thank you for your message! I'll get back to you shortly with more details about your wedding planning needs.",
                sender: 'vendor',
                timestamp: new Date(),
                status: 'read'
            };
            setMessages(prev => [...prev, response]);

            // Increase unread count if chat is closed
            if (!isOpen) {
                setUnreadCount(prev => prev + 1);
            }
        }, 2000);
    };

    const handleToggleChat = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setUnreadCount(0);
        }
    };

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    // Message action handlers

    const handleReplyMessage = (replyMessage: Message) => {
        setMessage(`Replying to: "${replyMessage.text.slice(0, 30)}${replyMessage.text.length > 30 ? '...' : ""}" - `)
        if (!isOpen) setIsOpen(true);
        if (isMinimized) setIsMinimized(false);
    };
    const handleDeleteMessage = (messageId: string) => {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
    };

    const handleCopyMessage = (text: string) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
        console.log('Message copied:', text);
    };

    const handleForwardMessage = (forwardMessage: Message) => {
        console.log('Forward message:', forwardMessage);
        // Implement forward logic
    };

    const handleStarMessage = (messageId: string) => {
        console.log('Star message:', messageId);
        // Implement star logic
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Floating Action Button */}
            {!isOpen && (
                <div className="relative">
                    <Button
                        onClick={handleToggleChat}
                        className={cn(
                            "relative w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
                            "animate-in slide-in-from-bottom-2 group"
                        )}
                        style={{ backgroundColor: primaryColor }}
                    >
                        <MessageCircle className="h-6 w-6 text-white transition-transform group-hover:scale-110" />

                        {/* Animated ring effect */}
                        <div
                            className="absolute inset-0 rounded-full animate-ping opacity-20"
                            style={{ backgroundColor: primaryColor }}
                        />

                        {/* Notification Badge */}
                        {unreadCount > 0 && (
                            <Badge
                                className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-red-500 text-white text-xs animate-pulse border-2 border-white"
                            >
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </Badge>
                        )}
                    </Button>

                    {/* Floating tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                            {unreadCount > 0 ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}` : 'Chat with us'}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    ref={chatWindowRef}
                    className={cn(
                        "bg-white rounded-lg shadow-2xl border flex flex-col overflow-hidden transition-all duration-300",
                        "animate-in slide-in-from-bottom-4 zoom-in-95",
                        isMinimized ? "w-80 h-16" : "w-80 h-96 sm:w-96 sm:h-[500px]"
                    )}
                    onWheel={(e) => {
                        // Additional wheel event handler for the chat window itself
                        e.stopPropagation();
                    }}
                    onTouchMove={(e) => {
                        // Additional touch event handler for mobile
                        e.stopPropagation();
                    }}
                >
                    {/* Chat Header */}
                    <ChatHeader
                        vendorName={vendorName}
                        vendorAvatar={vendorAvatar}
                        isOnline={isOnline}
                        primaryColor={primaryColor}
                        onClose={() => setIsOpen(false)}
                        onMinimize={handleMinimize}
                        isMinimized={isMinimized}
                    />

                    {/* Chat Content - Hidden when minimized */}
                    {!isMinimized && (
                        <>
                            {/* Messages Area */}
                            <div
                                ref={scrollAreaRef}
                                className="flex-1 overflow-hidden"
                            >
                                <ScrollArea
                                    className="h-full p-4 bg-gray-50/50"
                                    onWheel={(e) => e.stopPropagation()}
                                >
                                    <div className="space-y-4">
                                        {messages.map((msg) => (
                                            <ChatMessage
                                                key={msg.id}
                                                message={msg}
                                                onReply={handleReplyMessage}
                                                onDelete={handleDeleteMessage}
                                                onCopy={handleCopyMessage}
                                                onForward={handleForwardMessage}
                                                onStar={handleStarMessage}
                                            />
                                        ))}

                                        {/* Typing Indicator */}
                                        {isTyping && (
                                            <div className="flex justify-start">
                                                <div className="bg-white border rounded-lg px-4 py-2 max-w-xs">
                                                    <div className="flex space-x-1">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Message Input */}
                            <MessageInput
                                message={message}
                                setMessage={setMessage}
                                onSendMessage={handleSendMessage}
                                primaryColor={primaryColor}
                            />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}