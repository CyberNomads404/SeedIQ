import React, { useRef } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type AvatarUploadProps = {
  value?: File | string;
  onChange: (file: File | null) => void;
  shape?: "circle" | "rounded";
  /** Accept array of mime types or extensions (e.g. ['image/*', '.svg', 'image/svg+xml']) */
  accept?: string[];
  /** Maximum file size in bytes */
  maxSize?: number;
};

const AvatarUpload: React.FC<AvatarUploadProps> = ({ value, onChange, shape = "circle", accept, maxSize }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(
    typeof value === "string" ? value : null
  );

  React.useEffect(() => {
    if (typeof value === "string") {
      setPreviewUrl(value);
    } else if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  const buildAccept = (acceptList?: string[]) => {
    if (!acceptList || acceptList.length === 0) return { "image/*": [] } as any;
    const record: Record<string, string[]> = {};
    acceptList.forEach((a: string) => {
      if (a.startsWith('.')) {
        // map some common extensions to mime types
        if (a === '.svg') record['image/svg+xml'] = record['image/svg+xml'] || [], record['image/svg+xml'].push('.svg');
        else if (a === '.png') record['image/png'] = record['image/png'] || [], record['image/png'].push('.png');
        else if (a === '.jpg' || a === '.jpeg') record['image/jpeg'] = record['image/jpeg'] || [], record['image/jpeg'].push(a);
        else record['application/octet-stream'] = record['application/octet-stream'] || [], record['application/octet-stream'].push(a);
      } else if (a.includes('/')) {
        // mime type
        record[a] = record[a] || [];
      } else if (a.endsWith('/*')) {
        record[a.replace('/*', '/*')] = record[a.replace('/*', '/*')] || [];
      } else {
        // fallback to mime key
        record[a] = record[a] || [];
      }
    });
    return record;
  };

  const validateFile = (file: File) => {
    setError(null);
    if (maxSize && file.size > maxSize) {
      setError(`Arquivo muito grande. Tamanho máximo: ${Math.round((maxSize / 1024) * 100) / 100} KB`);
      return false;
    }

    if (accept && accept.length > 0) {
      const accepts = accept;
      const ext = (file.name.match(/\.[0-9a-z]+$/i) || [''])[0].toLowerCase();
      const mimeAllowed = accepts.some((a: string) => a.includes('/') && (a === file.type || (a.endsWith('/*') && file.type.startsWith(a.split('/')[0]))));
      const extAllowed = accepts.some((a: string) => a.startsWith('.') && a.toLowerCase() === ext);
      if (!mimeAllowed && !extAllowed) {
        setError(`Tipo de arquivo não permitido. Permitido: ${accepts.join(', ')}`);
        return false;
      }
    }

    return true;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
  accept: buildAccept(accept),
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      if (!validateFile(file)) {
        onChange(null);
        return;
      }
      onChange(file);
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
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
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

      {error && <p className="text-destructive text-sm mt-1">{error}</p>}

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
