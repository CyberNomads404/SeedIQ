import React, { useRef } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type AvatarUploadProps = {
  value?: File | string;
  onChange: (file: File | null) => void;
  shape?: "circle" | "rounded";
};

const AvatarUpload: React.FC<AvatarUploadProps> = ({ value, onChange, shape = "circle" }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      onChange(acceptedFiles[0]);
    },
  });

  const handleClick = () => inputRef.current?.click();

  const previewClasses = cn(
    "w-32 h-32 bg-muted flex items-center justify-center overflow-hidden border border-gray-300 relative",
    shape === "circle" ? "rounded-full" : "rounded-xl",
    isDragActive && "border-primary"
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <div {...getRootProps({ className: previewClasses })}>
        <input {...getInputProps()} />
        {value ? (
          <>
            <img
              src={typeof value === "string" ? value : value ? URL.createObjectURL(value) : undefined}
              alt="Avatar Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center px-2">
            Arraste ou clique para enviar
          </p>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        hidden
        ref={inputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) onChange(e.target.files[0]);
        }}
      />

      <button
        type="button"
        onClick={handleClick}
        className="text-sm text-primary underline hover:opacity-80"
      >
        Selecionar imagem
      </button>
    </div>
  );
};

export default AvatarUpload;
