"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlightPlan } from "./pilot/flight-plan";
import { WeatherMap } from "./pilot/weather-map";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Bell, MessageSquare, Wind } from "lucide-react";
import { Button } from "./ui/button";

export function PilotDashboard() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        const userEmail = localStorage.getItem("userEmail");
        if (role !== 'pilot') {
            router.push('/');
        } else {
            setEmail(userEmail);
        }
    }, [router]);


    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline mb-1">Pilot Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome, Captain <span className="font-semibold text-primary">{email}</span>. Your flight plan and conditions are ready.
                </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <FlightPlan />
                </div>
                <div className="flex flex-col gap-6">
                    <WeatherMap />
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>ATC Alerts & Messages</CardTitle>
                            <CardDescription>Real-time updates from Air Traffic Control.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground h-full p-4 bg-muted/50 rounded-lg">
                                <Bell className="w-8 h-8 mb-2 text-primary/50" />
                                <p>No new alerts from ATC.</p>
                             </div>
                        </CardContent>
                    </Card>
                    <Button size="lg" className="font-semibold"><MessageSquare className="mr-2 h-5 w-5" /> Contact ATC</Button>
                </div>
            </div>
        </div>
    );
}
