"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ActiveFlights } from "./atc/active-flights";
import { AirspaceMap } from "./atc/airspace-map";
import { ConflictPredictor } from "./atc/conflict-predictor";
import { DroneActivity } from "./atc/drone-activity";

export function AtcDashboard() {
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== 'atc') {
            router.push('/');
        }
    }, [router]);


    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold font-headline mb-2">ATC Dashboard</h1>
            <p className="text-muted-foreground mb-8">
                Welcome, Controller. Monitoring airspace and ensuring safety.
            </p>
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="lg:col-span-2">
                    <AirspaceMap />
                </div>
                <div>
                    <ActiveFlights />
                </div>
                <div className="flex flex-col gap-6">
                    <ConflictPredictor />
                    <DroneActivity />
                </div>
            </div>
        </div>
    );
}
