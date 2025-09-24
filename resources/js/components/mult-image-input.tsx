import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageInputProps = {
    defaultImages?: string[];
    onChange?: (files: (string | File)[]) => void;
}

export function MultiImageInput({ defaultImages = [], onChange }: ImageInputProps) {
    const [images, setImages] = useState<(string | File)[]>([...defaultImages]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const updateImages = (newImages: (string | File)[]) => {
        setImages(newImages);
        if (onChange) onChange(newImages);
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        updateImages([...images, ...acceptedFiles]);
    }, [images]);

    const removeImage = (index: number) => {
        const updated = images.filter((_, i) => i !== index);
        updateImages(updated);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
    });

    const getImageUrl = (img: string | File) =>
        typeof img === "string" ? img : URL.createObjectURL(img);

    const moveImage = (index: number, direction: "left" | "right") => {
        const newIndex = direction === "left" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= images.length) return;

        const updated = [...images];
        [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
        updateImages(updated);
    };

    return (
        <>
            <div className="flex gap-2 overflow-x-auto p-2 border rounded-md">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="relative w-32 h-32 shrink-0 cursor-pointer group"
                        onClick={() => setPreviewImage(getImageUrl(img))}
                    >
                        <img
                            src={getImageUrl(img)}
                            className="w-full h-full object-cover rounded"
                        />

                        {/* Botão de remover */}
                        <button
                            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                            }}
                        >
                            <X size={16} />
                        </button>

                        {/* Botões de mover esquerda/direita */}
                        <div
                            className={cn(
                                "absolute bottom-1 left-1 right-1 flex px-1 opacity-0 group-hover:opacity-100 transition",
                                index === 0
                                    ? "justify-end"
                                    : index === images.length - 1
                                        ? "justify-start"
                                        : "justify-between"
                            )}
                        >
                            {index > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        moveImage(index, "left");
                                    }}
                                    className="bg-black/50 text-white px-2 py-1 rounded text-sm"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                            )}
                            {index < images.length - 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        moveImage(index, "right");
                                    }}
                                    className="bg-black/50 text-white px-2 py-1 rounded text-sm"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <div
                    {...getRootProps()}
                    className="w-32 h-32 shrink-0 border border-dashed rounded flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50"
                >
                    <input {...getInputProps()} />
                    {isDragActive ? "Solte aqui..." : "+ Adicionar"}
                </div>
            </div>

            {/* Modal de pré-visualização */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1100]"
                    onClick={() => setPreviewImage(null)}
                >
                    <div
                        className="relative max-w-4xl w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={previewImage}
                            alt="Pré-visualização"
                            className="w-full max-h-[80vh] object-contain rounded"
                        />
                        <button
                            className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full"
                            onClick={() => setPreviewImage(null)}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
