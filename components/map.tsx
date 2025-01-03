"use client";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef } from "react";
import L from "leaflet";

// Types pour les marqueurs
type MarkerType = {
    id: string;
    lat: number;
    lng: number;
    label: string;
};

type MapProps = {
    markers: MarkerType[];
    handleMarkerClick: (id: string) => void;
};

const Map: React.FC<MapProps> = ({ markers, handleMarkerClick }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        if (mapInstance.current) {
            mapInstance.current.remove();
        }

        mapInstance.current = L.map(mapRef.current).setView(
            [markers[0].lat, markers[0].lng],
            6
        );

        // remove scroll bar zoom css
        mapInstance.current.options.scrollWheelZoom = false;
        mapInstance.current.options.center = [markers[0].lat, markers[0].lng];

        // set marker icon
        const icon = L.icon({
            iconUrl: "/marker-icon-2x.png",
            shadowUrl: "/marker-shadow.png",
        });


        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapInstance.current);

        markers.forEach((marker) => {
            L.marker([marker.lat, marker.lng])
                .addTo(mapInstance.current!)
                .on("click", () => handleMarkerClick(marker.id))
                .setIcon(icon)
                .bindPopup(marker.label);
        });

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [markers]);

    return (
        <div
            ref={mapRef}
            style={{ height: "500px", width: "100%" }}
        />
    );
};

export default Map;
