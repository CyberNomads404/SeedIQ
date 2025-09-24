import {
    APIProvider,
    Map,
    AdvancedMarker,
} from "@vis.gl/react-google-maps";
import React from "react";

export type LatLng = { lat: number; lng: number };

export default function MapDisplay({ value }: { value: LatLng }) {
    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
                style={{ width: "100%", height: "400px" }}
                defaultCenter={value}
                defaultZoom={16}
                gestureHandling="greedy"
                disableDefaultUI={false}
                mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
            >
                <AdvancedMarker position={value} />
            </Map>
        </APIProvider>
    );
}
