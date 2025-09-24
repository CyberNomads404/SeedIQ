import React, { useImperativeHandle, useRef, forwardRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Image as ImageIcon, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttachmentPreviewProps {
  url: string;
  mime: string | null;
  triggerClassName?: string;
  iconSize?: number;
  buttonProps?: React.ComponentProps<typeof Button>;
  hideTrigger?: boolean;

}

export interface AttachmentPreviewHandle {
  open: () => void;
}

export const AttachmentPreview = forwardRef<AttachmentPreviewHandle, AttachmentPreviewProps>(
  ({ url, mime, triggerClassName = "", iconSize = 32, buttonProps = {}, hideTrigger = false }, ref) => {
    const isImage = mime?.startsWith("image/");
    const dialogRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        if (dialogRef.current) {
          dialogRef.current.click();
        }
      }
    }));

    // Helpers para tipos
    const isVideo = mime?.startsWith("video/");
    const isAudio = mime?.startsWith("audio/");

    return (
      <Dialog>
        {!hideTrigger && (
          <DialogTrigger asChild>
            <Button ref={dialogRef} variant="ghost" size="icon" className={triggerClassName} {...buttonProps}>
              {isImage ? (
                <ImageIcon className={`text-blue-500`} width={iconSize} height={iconSize} />
              ) : (
                <FileIcon className="text-gray-500" width={iconSize} height={iconSize} />
              )}
            </Button>
          </DialogTrigger>
        )}
        {hideTrigger && (
          <DialogTrigger asChild>
            <span ref={dialogRef} style={{ display: "none" }} />
          </DialogTrigger>
        )}
        <DialogContent className="w-[90vw] max-w-[90vw] flex items-center justify-center">
          {isImage ? (
            <img src={url} alt="Preview" className="max-w-full max-h-[90vh] rounded-lg shadow-lg" />
          ) : isVideo ? (
            <video src={url} controls className="max-w-full max-h-[90vh] rounded-lg shadow-lg bg-black" />
          ) : isAudio ? (
            <audio src={url} controls className="w-full max-w-[600px] my-8" />
          ) : mime === "application/pdf" ? (
            <iframe src={url} className="w-full h-[90vh] rounded-lg" />
          ) : mime && [
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/msword",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              "application/vnd.ms-excel"
            ].includes(mime) ? (
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`}
                className="w-full h-[90vh] rounded-lg bg-white"
                title="Office Preview"
              />
          ) : (
            <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Baixar arquivo</a>
          )}
        </DialogContent>
      </Dialog>
    );
  }
);
