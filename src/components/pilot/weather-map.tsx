'use client';

import { Map } from "@/components/map";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { Flight } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";

export function WeatherMap() {
    const firestore = useFirestore();
    // In a real app, this would be the logged-in pilot's flight
    const flightId = 'UA2481'; 
    
    const flightQuery = useMemoFirebase(() => 
        firestore && query(collection(firestore, 'flights'), where('id', '==', flightId)), 
        [firestore, flightId]
    );
    const { data: flights } = useCollection<Flight>(flightQuery);

    return (
        <Map
            title="Weather & Route"
            description="Live weather overlays and flight path visualization."
            flights={flights ?? []}
        />
    )
}
