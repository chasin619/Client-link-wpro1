'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface MessageInputProps {
    message: string;
    setMessage: (message: string) => void;
    onSendMessage: () => void;
    primaryColor: string;
}

export function MessageInput({
    message,
    setMessage,
    onSendMessage,
    primaryColor
}: MessageInputProps) {
    const [isComposing, setIsComposing] = useState(false);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };

    const handleAttachment = () => {
        // Handle file attachment
        console.log('Handle attachment');
    };

    const handleEmoji = () => {
        // Handle emoji picker
        console.log('Handle emoji');
    };

    return (
        <div className="p-3 border-t bg-white">
            <div className="flex items-end gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleAttachment}
                                className="h-9 w-9 p-0 text-gray-500 hover:text-gray-700"
                            >
                                <Paperclip className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Attach file</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="flex-1 relative">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={() => setIsComposing(false)}
                        placeholder="Type your message..."
                        className="pr-10 resize-none border-gray-200 focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-50"
                    />

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleEmoji}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                                >
                                    <Smile className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Add emoji</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <Button
                    onClick={onSendMessage}
                    disabled={!message.trim() || isComposing}
                    className="h-9 w-9 p-0 rounded-full transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: primaryColor }}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>

            {/* Character count or typing indicator could go here */}
        </div>
    );
}