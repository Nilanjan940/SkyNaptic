
'use client';

import { Map } from "@/components/map";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { ConflictAlert, Drone, Flight } from "@/lib/types";

type AirspaceMapProps = {
    alerts: ConflictAlert[];
}

export function AirspaceMap({ alerts }: AirspaceMapProps) {
    const firestore = useFirestore();
    
    const flightsQuery = useMemoFirebase(() => firestore && query(collection(firestore, 'flights'), where('status', '==', 'In-Flight')), [firestore]);
    const { data: flights } = useCollection<Flight>(flightsQuery);

    const dronesQuery = useMemoFirebase(() => firestore && query(collection(firestore, 'drones'), where('status', '==', 'In-Flight')), [firestore]);
    const { data: drones } = useCollection<Drone>(dronesQuery);

    return (
        <Map 
            title="Live Airspace"
            description="Real-time visualization of all aircraft, drones, and potential conflicts."
            flights={flights ?? []}
            drones={drones ?? []}
            alerts={alerts}
        />
    )
}
