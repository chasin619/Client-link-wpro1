'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    X,
    Minimize2,
    Phone,
    Video,
    MoreVertical,
    Flower2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatHeaderProps {
    vendorName: string;
    vendorAvatar?: string;
    isOnline: boolean;
    primaryColor: string;
    onClose: () => void;
    onMinimize: () => void;
    isMinimized: boolean;
}

export function ChatHeader({
    vendorName,
    vendorAvatar,
    isOnline,
    primaryColor,
    onClose,
    onMinimize,
    isMinimized
}: ChatHeaderProps) {
    return (
        <div
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: primaryColor }}
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative">
                    <Avatar className="h-8 w-8 border-2 border-white/20">
                        <AvatarImage src={vendorAvatar} alt={vendorName} />
                        <AvatarFallback className="bg-white/20 text-white text-sm">
                            <Flower2 className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    {isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{vendorName}</h3>
                    <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                        <p className="text-xs opacity-90">
                            {isOnline ? 'Online now' : 'Offline'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1">
                {!isMinimized && (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 h-8 w-8 p-0"
                        >
                            <Phone className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 h-8 w-8 p-0"
                        >
                            <Video className="h-4 w-4" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                                <DropdownMenuItem>Block User</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )}

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMinimize}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                    <Minimize2 className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white hover:bg-white/20 h-8 w-8 p-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}