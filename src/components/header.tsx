import { UploadButton } from './upload-button';
import { Logo } from './icons/logo';

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <h1 className="text-xl font-bold text-foreground">KeepCore</h1>
        </div>
        <UploadButton />
      </div>
    </header>
  );
}
