"use client";

import { useEffect, useState } from 'react';
import { getAllMedia } from '@/lib/db';
import type { MediaRecord } from '@/lib/types';
import { MediaCard } from './media-card';
import { MediaViewer } from './media-viewer';

export function MediaLibrary() {
  const [media, setMedia] = useState<MediaRecord[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      const allMedia = await getAllMedia();
      setMedia(allMedia);
    } catch (error) {
      console.error("Failed to load media:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();

    const handleMediaUpdate = () => {
      fetchMedia();
    };

    window.addEventListener('media-updated', handleMediaUpdate);

    return () => {
      window.removeEventListener('media-updated', handleMediaUpdate);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="aspect-square bg-card rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-[60vh] border-2 border-dashed border-border rounded-lg">
        <h2 className="text-2xl font-semibold text-foreground">Your vault is empty</h2>
        <p className="mt-2 text-muted-foreground">Click the "Upload" button to add your first file.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {media.map((item) => (
          <MediaCard key={item.id} media={item} onSelect={() => setSelectedMedia(item)} />
        ))}
      </div>

      <MediaViewer
        media={selectedMedia}
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </>
  );
}
