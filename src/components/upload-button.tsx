"use client";

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addMedia } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

export function UploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      const promises = Array.from(files).map(file => addMedia({
        name: file.name,
        type: file.type,
        file: file,
      }));
      
      await Promise.all(promises);
      
      window.dispatchEvent(new CustomEvent('media-updated'));
      
      toast({
        title: "Upload complete",
        description: `${files.length} file(s) have been saved to your vault.`,
      });

    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was a problem saving your file.",
      });
    } finally {
      setIsUploading(false);
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept="image/*,video/*,audio/*"
      />
      <Button onClick={handleButtonClick} disabled={isUploading}>
        <Upload className="mr-2 h-4 w-4" />
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>
    </>
  );
}
