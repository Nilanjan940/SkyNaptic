"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FlightPlan } from "./pilot/flight-plan";
import { WeatherMap } from "./pilot/weather-map";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Bell } from "lucide-react";

export function PilotDashboard() {
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== 'pilot') {
            router.push('/');
        }
    }, [router]);


    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Pilot Dashboard</h1>
            <p className="text-muted-foreground mb-8">
                Welcome, Captain. Your flight plan and conditions are ready.
            </p>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <FlightPlan />
                </div>
                <div className="flex flex-col gap-6">
                    <WeatherMap />
                    <Card>
                        <CardHeader>
                            <CardTitle>Alerts & Messages</CardTitle>
                            <CardDescription>Real-time updates from ATC.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground h-full p-4 bg-muted/50 rounded-lg">
                                <Bell className="w-8 h-8 mb-2 text-primary/50" />
                                <p>No new alerts from ATC.</p>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
