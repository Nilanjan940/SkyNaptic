'use client';

import { Map } from "@/components/map";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { Drone } from "@/lib/types";
import { collection, query, where } from "firebase/firestore";

export function DroneMap() {
    const firestore = useFirestore();
    const dronesQuery = useMemoFirebase(() => firestore && query(collection(firestore, 'drones'), where('status', '==', 'In-Flight')), [firestore]);
    const { data: drones } = useCollection<Drone>(dronesQuery);

    return (
        <Map
            title="Low-Altitude Airspace"
            description="View approved flight zones, real-time drone traffic, and weather conditions."
            drones={drones ?? []}
        />
    )
}
