'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, CheckCheck, Clock, User, Flower2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from './chat-widget';

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.sender === 'user';

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const getStatusIcon = () => {
        switch (message.status) {
            case 'sent':
                return <Check className="h-3 w-3" />;
            case 'delivered':
                return <CheckCheck className="h-3 w-3" />;
            case 'read':
                return <CheckCheck className="h-3 w-3 text-blue-500" />;
            default:
                return <Clock className="h-3 w-3" />;
        }
    };

    return (
        <div className={cn(
            "flex gap-2 animate-in slide-in-from-bottom-1",
            isUser ? "justify-end" : "justify-start"
        )}>
            {!isUser && (
                <Avatar className="h-6 w-6 mt-auto">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                        <Flower2 className="h-3 w-3" />
                    </AvatarFallback>
                </Avatar>
            )}

            <div className={cn(
                "flex flex-col max-w-xs lg:max-w-sm",
                isUser ? "items-end" : "items-start"
            )}>
                <div className={cn(
                    "px-3 py-2 rounded-lg text-sm relative group",
                    isUser
                        ? "bg-blue-500 text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                )}>
                    <p className="break-words">{message.text}</p>

                    {/* Message tail */}
                    <div className={cn(
                        "absolute w-0 h-0 border-4 border-solid",
                        isUser
                            ? "bottom-0 right-0 translate-x-1 border-l-blue-500 border-t-blue-500 border-r-transparent border-b-transparent"
                            : "bottom-0 left-0 -translate-x-1 border-r-white border-t-white border-l-transparent border-b-transparent"
                    )}></div>
                </div>

                <div className={cn(
                    "flex items-center gap-1 mt-1 px-1",
                    isUser ? "flex-row-reverse" : "flex-row"
                )}>
                    <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                    </span>

                    {isUser && message.status && (
                        <div className="text-gray-400">
                            {getStatusIcon()}
                        </div>
                    )}
                </div>
            </div>

            {isUser && (
                <Avatar className="h-6 w-6 mt-auto">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                        <User className="h-3 w-3" />
                    </AvatarFallback>
                </Avatar>
            )}
        </div>
    );
}