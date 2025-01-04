"use client";
import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef } from "react";
import L, { LeafletMouseEvent } from "leaflet";
import Event from "@/model/Event";
import { m } from "framer-motion";

export type MarkerType = {
    id: string;
    lat: number;
    lng: number;
    label: string;
    event?: Event;
};

type MapProps = {
    markers: MarkerType[];
    handleMarkerClick?: (id: string) => void;
    handlerClick?: (event: LeafletMouseEvent) => void;
};



const Map: React.FC<MapProps> = ({ markers, handleMarkerClick, handlerClick }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    var mapInstance = useRef<L.Map | null>(null);
    let allMarkers: L.Marker[] = [];



    useEffect(() => {
        if (!mapRef.current) return;

        if (mapInstance.current) {
            mapInstance.current.remove();
        }

        mapInstance.current = L.map(mapRef.current).setView(
            [markers[0].lat, markers[0].lng],
            6
        );

        const handlerClickRefresh = (event: LeafletMouseEvent) => {
            if (handlerClick)
                handlerClick(event);
            allMarkers.forEach((marker) => {
                marker.remove();
            });
            allMarkers = [];
            const icon = L.icon({
                iconUrl: "/marker-icon-2x.png",
                shadowUrl: "/marker-shadow.png",
            });
            let m = L.marker([event.latlng.lat, event.latlng.lng])
                .addTo(mapInstance.current!)
                .setIcon(icon);
            allMarkers.push(m);

        };

        if (handlerClick)
            mapInstance.current.on('click', handlerClickRefresh);

        mapInstance.current.options.scrollWheelZoom = false;
        mapInstance.current.options.center = [markers[0].lat, markers[0].lng];

        const icon = L.icon({
            iconUrl: "/marker-icon-2x.png",
            shadowUrl: "/marker-shadow.png",
        });


        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(mapInstance.current);

        if (handleMarkerClick)
            markers.forEach((marker) => {
                let m = L.marker([marker.lat, marker.lng])
                    .addTo(mapInstance.current!)
                    .on("click", () => handleMarkerClick(marker.id))
                    .setIcon(icon)
                    .bindPopup(marker.label);
                allMarkers.push(m);
            });
        else
            markers.forEach((marker) => {
                let m = L.marker([marker.lat, marker.lng])
                    .addTo(mapInstance.current!)
                    .setIcon(icon)
                    .bindPopup(marker.label);
                allMarkers.push(m);
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
