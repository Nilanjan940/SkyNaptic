"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ActiveFlights } from "./atc/active-flights";
import { AirspaceMap } from "./atc/airspace-map";
import { ConflictPredictor } from "./atc/conflict-predictor";
import { DroneActivity } from "./atc/drone-activity";
import { useFirestore } from "@/firebase";
import { seedDatabase } from "@/lib/seed";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { FlightFormDialog } from "./atc/flight-form";

export function AtcDashboard() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const firestore = useFirestore();
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        const userEmail = localStorage.getItem("userEmail");
        if (role !== 'atc') {
            router.push('/');
        } else {
            setEmail(userEmail);
        }
    }, [router]);
    
    useEffect(() => {
        if (firestore) {
            seedDatabase(firestore).catch(console.error);
        }
    }, [firestore]);


    return (
        <>
        <div className="container mx-auto p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline mb-1">ATC Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome, Controller <span className="font-semibold text-primary">{email}</span>.
                    </p>
                </div>
                <Button onClick={() => setIsFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Schedule New Flight
                </Button>
            </div>
            <div className="grid gap-6 xl:grid-cols-3">
                <div className="xl:col-span-3">
                    <AirspaceMap />
                </div>
                <div className="xl:col-span-2">
                    <ActiveFlights />
                </div>
                <div className="flex flex-col gap-6">
                    <ConflictPredictor />
                    <DroneActivity />
                </div>
            </div>
        </div>
        <FlightFormDialog
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            flight={null} // Pass null for new flight
        />
        </>
    );
}
