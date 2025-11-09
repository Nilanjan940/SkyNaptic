"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FlightStatus } from "./passenger/flight-status";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Bell } from "lucide-react";

export function PassengerDashboard() {
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== 'passenger') {
            router.push('/');
        }
    }, [router]);


    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Passenger Dashboard</h1>
            <p className="text-muted-foreground mb-8">
                Welcome. Here is your live flight information.
            </p>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <FlightStatus />
                </div>
                <div>
                     <Card>
                        <CardHeader>
                            <CardTitle>Delay Alerts</CardTitle>
                            <CardDescription>Notifications about your flight.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground h-full p-4 bg-muted/50 rounded-lg">
                                <Bell className="w-8 h-8 mb-2 text-primary/50" />
                                <p>Your flight is on time.</p>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
