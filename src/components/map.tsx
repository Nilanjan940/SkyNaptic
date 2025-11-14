
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Flight, Drone, ConflictAlert } from '@/lib/types';
import { useTheme } from 'next-themes';
import { MockMap } from './mock-map';


type MapProps = {
    title: string;
    description: string;
    flights?: Flight[];
    drones?: Drone[];
    alerts?: ConflictAlert[];
};

const mapStyles = {
    dark: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
        },
        {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
        },
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
        },
        {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
        },
        {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
        },
        {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
        },
        {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
        },
        {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
        },
        {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
        },
        {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
        },
        {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
        },
    ],
    light: []
};

// Convert knots to degrees per second (a rough approximation)
// 1 knot = 1 nm/hr. 1 nm = 1/60 deg. 1 hr = 3600s.
const KNOTS_TO_DPS = (1 / 60) / 3600;

export function Map({ title, description, flights = [], drones = [], alerts = [] }: MapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [apiKeyMissing, setApiKeyMissing] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!key || key === 'YOUR_API_KEY_HERE' || key === 'AIzaSyA-7KLkogeraZM98cYtpE_gsntZ6br_-DY') {
            setApiKeyMissing(true);
            return;
        }

        const initMap = async () => {
            if (!mapRef.current) return;

            const { Map } = await google.maps.importLibrary("maps") as typeof google.maps;
            const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as typeof google.maps;


            const map = new Map(mapRef.current as HTMLDivElement, {
                center: { lat: 39.8283, lng: -98.5795 },
                zoom: 4,
                mapId: 'SKYNAPTIC_MAP',
                styles: theme === 'dark' ? mapStyles.dark : mapStyles.light,
            });
            
            const mapThemeColors = {
                primary: 'hsl(var(--primary))',
                accent: 'hsl(var(--accent))',
                destructive: 'hsl(var(--destructive))',
            }

            flights.forEach(flight => {
                const flightMarker = document.createElement('div');
                flightMarker.className = 'w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg';
                flightMarker.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plane" style="transform: rotate(${flight.heading - 90}deg);">
                        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-1-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .2 1.3l3.1 3.1-1.2 1.2-2.1-1.1c-.5-.3-1.1 0-1.3.5L2 13.3c-.2.5 0 1.1.5 1.3l3.8 2.3 1.2-1.2L4.7 13l1.1-1.1 2.2 1.1c.5.3 1.1 0 1.3-.5l.5-.8c.2-.5.1-1.1-.2-1.5l-1.9-1.9L13 11l1.8 8.2c.1.5.6.9 1.1.9h.8c.5 0 .9-.3 1.1-.7l.3-.5c.2-.5.1-1-.2-1.3zm-5.4-3.2 1.2-1.2-1-3.8-3.8-1-1.2 1.2 1.5 2.6-1.5 1.5L3.4 9.5l-1.9 1.9 1.2 1.2 2.6-1.5 1.5 1.5-2.6 4.4 1.9 1.9 1.1-1.1 1.2 1.2-2.3 3.8.5 1.3.5.3c.2.4.7.6 1.1.5l8.2-1.8-1.9-1.9-1.5 1.5z"/>
                    </svg>
                `;
                new AdvancedMarkerElement({
                    map,
                    position: { lat: flight.latitude, lng: flight.longitude },
                    content: flightMarker,
                    title: flight.flightNumber,
                });

                // Add flight path trail
                const trailCoords = getTrailCoordinates(flight);
                new google.maps.Polyline({
                    path: trailCoords,
                    geodesic: true,
                    strokeColor: mapThemeColors.primary,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    map: map,
                });
            });

            drones.forEach(drone => {
                 const droneMarker = document.createElement('div');
                droneMarker.className = 'w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground border-2 border-background shadow';
                 droneMarker.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-drone">
                        <path d="M12 18a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v4a.5.5 0 0 0 .5.5z"/>
                        <path d="M12 8a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5z"/>
                        <path d="M12 8a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5z"/>
                        <path d="m7 14-2-2 2-2"/>
                        <path d="m17 14 2-2-2-2"/>
                        <path d="M12 12a4.5 4.5 0 0 0-4.5 4.5h9a4.5 4.5 0 0 0-4.5-4.5z"/>
                    </svg>
                 `;
                new AdvancedMarkerElement({
                    map,
                    position: { lat: drone.latitude, lng: drone.longitude },
                    content: droneMarker,
                    title: drone.id,
                });

                 // Add drone path trail
                const trailCoords = getTrailCoordinates(drone);
                new google.maps.Polyline({
                    path: trailCoords,
                    geodesic: true,
                    strokeColor: mapThemeColors.accent,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    map: map,
                });
            });

             alerts.forEach(alert => {
                const alertMarker = document.createElement('div');
                alertMarker.className = 'relative w-6 h-6';
                alertMarker.innerHTML = `
                    <div class="absolute inset-0 bg-destructive/50 rounded-full animate-ping"></div>
                    <div class="relative w-full h-full bg-destructive rounded-full border-2 border-white flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle">
                            <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
                        </svg>
                    </div>
                `;
                new AdvancedMarkerElement({
                    map,
                    position: { lat: alert.latitude, lng: alert.longitude },
                    content: alertMarker,
                    title: `Conflict: ${alert.flightIds.join(' & ')}`,
                });
            });
        };

        const getTrailCoordinates = (vehicle: Flight | Drone) => {
            const currentPos = { lat: vehicle.latitude, lng: vehicle.longitude };
            const speedDps = vehicle.speed * KNOTS_TO_DPS;
            const headingRad = ((vehicle.heading || 0) * Math.PI) / 180;

            // Calculate how far the vehicle moved in the last 60 seconds
            const trailDuration = 60; // seconds
            const latOffset = speedDps * Math.cos(headingRad) * trailDuration;
            const lonOffset = speedDps * Math.sin(headingRad) * trailDuration;

            const prevPos = { lat: vehicle.latitude - latOffset, lng: vehicle.longitude - lonOffset };

            return [prevPos, currentPos];
        }

        if (window.google) {
            initMap();
        }

    }, [theme, flights, drones, alerts]);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
             <CardContent className="flex-grow p-0 rounded-b-lg overflow-hidden">
                {apiKeyMissing ? (
                   <MockMap />
                ) : (
                    <div ref={mapRef} className="w-full h-full min-h-[400px]" />
                )}
            </CardContent>
        </Card>
    );
}
