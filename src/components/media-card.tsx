"use client";

import { useEffect, useState } from 'react';
import { Image as ImageIcon, Video, Music, Trash2, File } from 'lucide-react';
import type { MediaRecord } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from './ui/button';
import { deleteMedia } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

interface MediaCardProps {
  media: MediaRecord;
  onSelect: () => void;
}

function MediaThumbnail({ media }: { media: MediaRecord }) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (media.file) {
      const url = URL.createObjectURL(media.file);
      setObjectUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [media.file]);

  if (media.type.startsWith('image/')) {
    return objectUrl ? <img src={objectUrl} alt={media.name} className="absolute h-full w-full object-cover" /> : null;
  }
  
  const Icon = media.type.startsWith('video/')
    ? Video
    : media.type.startsWith('audio/')
    ? Music
    : File;
    
  return (
    <div className="flex h-full w-full items-center justify-center bg-card-foreground/5">
      <Icon className="h-16 w-16 text-muted-foreground" />
    </div>
  );
}

export function MediaCard({ media, onSelect }: MediaCardProps) {
    const { toast } = useToast();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteMedia(media.id);
            toast({
                title: "File deleted",
                description: `"${media.name}" has been removed from your vault.`,
            });
            window.dispatchEvent(new CustomEvent('media-updated'));
        } catch (error) {
            console.error("Error deleting file:", error);
            toast({
                variant: "destructive",
                title: "Deletion failed",
                description: "Could not remove the file.",
            });
        }
    };

  return (
    <Card
      onClick={onSelect}
      className="group relative cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1"
    >
      <CardContent className="relative aspect-square p-0">
        <MediaThumbnail media={media} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="truncate text-sm font-medium text-white">{media.name}</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
            >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete "{media.name}" from your vault.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
