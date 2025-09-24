import React from "react";

type ThumbProps = {
  selected: boolean;
  imageUrl: string;
  onClick: () => void;
};

export const Thumb: React.FC<ThumbProps> = ({ selected, imageUrl, onClick }) => {
  return (
    <div
      className={`embla-thumbs__slide border rounded-md overflow-hidden cursor-pointer ${
        selected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <img src={imageUrl} alt="Thumbnail" className="h-20 w-28 object-cover" />
    </div>
  );
};
