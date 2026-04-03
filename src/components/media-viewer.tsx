"use client";

import { useEffect, useState } from 'react';
import type { MediaRecord } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface MediaViewerProps {
  media: MediaRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

function MediaContent({ media }: { media: MediaRecord }) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (media?.file) {
      const url = URL.createObjectURL(media.file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [media]);

  if (!objectUrl) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  if (media.type.startsWith('image/')) {
    return <img src={objectUrl} alt={media.name} className="max-h-[80vh] w-auto rounded-md" />;
  }

  if (media.type.startsWith('video/')) {
    return <video src={objectUrl} controls autoPlay className="max-h-[80vh] w-full rounded-md" />;
  }

  if (media.type.startsWith('audio/')) {
    return (
      <div className='p-8 w-full'>
        <audio src={objectUrl} controls autoPlay className="w-full" />
      </div>
    );
  }

  return <p>Unsupported file type.</p>;
}

export function MediaViewer({ media, isOpen, onClose }: MediaViewerProps) {

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] p-2 sm:p-4">
        {media && (
          <>
            <DialogHeader className="p-4 pb-0">
                <DialogTitle className="truncate">{media.name}</DialogTitle>
                <DialogDescription>
                    {media.type} &middot; {(media.file.size / (1024 * 1024)).toFixed(2)} MB
                </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-center p-4 pt-0">
                <MediaContent media={media} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
