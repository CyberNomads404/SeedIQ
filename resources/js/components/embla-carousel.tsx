// components/embla-carousel.tsx
import React, { useState, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { Thumb } from "./embla-carousel-thumb";

type Image = {
    id: number;
    full_url: string;
};

type Props = {
    images: Image[];
    options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<Props> = ({ images, options }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: "keepSnaps",
        dragFree: true,
    });

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) return;
            emblaMainApi.scrollTo(index);
        },
        [emblaMainApi, emblaThumbsApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        setSelectedIndex(emblaMainApi.selectedScrollSnap());
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
    }, [emblaMainApi, emblaThumbsApi]);

    useEffect(() => {
        if (!emblaMainApi) return;
        onSelect();
        emblaMainApi.on("select", onSelect).on("reInit", onSelect);
    }, [emblaMainApi, onSelect]);

    if (!images.length) return null;

    return (
        <div className="embla flex flex-col gap-4">
            <div className="embla__viewport overflow-hidden rounded-xl" ref={emblaMainRef}>
                <div className="embla__container flex">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="embla__slide flex-[0_0_100%] px-2"
                        >
                            <div className="relative mx-auto max-w-3xl w-full overflow-hidden rounded-xl aspect-[16/9] shadow-md">
                                <img
                                    src={img.full_url}
                                    alt="Imagem"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            </div>

                        </div>
                    ))}
                </div>
            </div>


            <div className="embla-thumbs">
                <div className="embla-thumbs__viewport overflow-hidden" ref={emblaThumbsRef}>
                    <div className="embla-thumbs__container flex gap-2">
                        {images.map((img, index) => (
                            <Thumb
                                key={img.id}
                                onClick={() => onThumbClick(index)}
                                selected={index === selectedIndex}
                                imageUrl={img.full_url}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmblaCarousel;
