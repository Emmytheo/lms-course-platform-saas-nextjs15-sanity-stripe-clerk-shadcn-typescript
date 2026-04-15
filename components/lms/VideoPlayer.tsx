'use client';

import React from 'react';
import ReactPlayer from 'react-player';
import { PlayCircle, Loader2 } from 'lucide-react';

interface VideoPlayerProps {
    url: string;
    onComplete?: () => void;
}

export function VideoPlayer({ url, onComplete }: VideoPlayerProps) {
    // Basic wrapper using react-player
    // In a real LMS, we might track progress percentages here
    return (
        <div className="relative w-full h-full bg-black">
            <ReactPlayer
                url={url}
                width="100%"
                height="100%"
                controls
                onEnded={onComplete}
                light={false} // Set to true if we want thumbnail preview first
                playIcon={<PlayCircle className="w-20 h-20 text-foreground" />}
                config={{
                    youtube: {
                        playerVars: { showinfo: 1 }
                    }
                }}
            />
        </div>
    );
}
