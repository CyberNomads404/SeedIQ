import {
    APIProvider,
    Map,
    AdvancedMarker,
    MapControl,
    useAdvancedMarkerRef,
    useMap,
    useMapsLibrary,
    ControlPosition,
} from "@vis.gl/react-google-maps";
import React, { useEffect, useRef, useState } from "react";

export type LatLng = { lat: number; lng: number };

const PlaceAutocomplete: React.FC<{
    onPlaceSelect(place: google.maps.places.PlaceResult | null): void;
}> = ({ onPlaceSelect }) => {
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary("places");
    const map = useMap();

    useEffect(() => {
        if (places && inputRef.current) {
            const ac = new places.Autocomplete(inputRef.current, {
                fields: ["geometry", "name"],
            });
            setAutocomplete(ac);
        }
    }, [places]);

    useEffect(() => {
        if (!autocomplete) return;
        const listener = autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            onPlaceSelect(place);

            if (place.geometry?.location && map) {
                const loc = place.geometry.location;
                const latLng = { lat: loc.lat(), lng: loc.lng() };

                map.setCenter(latLng);
                map.setZoom(15);
            }
        });
        return () => listener.remove();
    }, [autocomplete, onPlaceSelect, map]);

    return (
        <input
            ref={inputRef}
            className="w-full p-2 border rounded"
            placeholder="Digite cidade ou endereço"
        />
    );
};

const MapClickListener: React.FC<{ onChange(value: LatLng | null): void }> = ({ onChange }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const listener = map.addListener("mousedown", (event: google.maps.MapMouseEvent) => {
            if ((event.domEvent as MouseEvent).button === 1 && event.latLng) {
                onChange({ lat: event.latLng.lat(), lng: event.latLng.lng() });
            }
        });

        return () => listener.remove();
    }, [map, onChange]);

    return null;
};

export default function MapSelector({
    value,
    onChange,
}: {
    value: LatLng | null;
    onChange: (value: LatLng) => void;
}) {
    const [markerRef, markerElement] = useAdvancedMarkerRef();
    const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);

    useEffect(() => {
        if (selectedPlace?.geometry?.location) {
            const loc = selectedPlace.geometry.location;
            onChange({ lat: loc.lat(), lng: loc.lng() });
        }
    }, [selectedPlace, onChange]);

    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
                style={{ width: "100%", height: "400px" }}
                defaultCenter={{ lat: -7.5335065, lng: -46.0406425 }}
                defaultZoom={6}
                gestureHandling="greedy"
                disableDefaultUI={false}
                mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
            >
                {value && <AdvancedMarker ref={markerRef} position={value} />}
                <MapClickListener onChange={onChange} />
                <MapControl position={ControlPosition.TOP_CENTER}>
                    <div className="bg-white p-2 mt-2 rounded shadow max-w-md mx-auto">
                        <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
                    </div>
                </MapControl>
            </Map>
        </APIProvider>
    );
}
