"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlightStatus } from "./passenger/flight-status";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Bell, Gift, Wifi, BaggageClaim } from "lucide-react";
import { Button } from "./ui/button";

export function PassengerDashboard() {
    const router = useRouter();
    const [email, setEmail] = useState<string|null>(null);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        const userEmail = localStorage.getItem("userEmail");
        if (role !== 'passenger') {
            router.push('/');
        } else {
            setEmail(userEmail);
        }
    }, [router]);


    return (
        <div className="container mx-auto p-4 md:p-8">
             <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline mb-1">Passenger Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome, <span className="font-semibold text-primary">{email}</span>. Here is your live flight information.
                </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <FlightStatus />
                </div>
                <div className="flex flex-col gap-6">
                     <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Flight Alerts</CardTitle>
                            <CardDescription>Real-time notifications about your flight.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground h-full p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                                <Bell className="w-8 h-8 mb-2 text-green-600" />
                                <p className="font-semibold text-green-700">Your flight is on time.</p>
                             </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Baggage Claim</CardTitle>
                            <CardDescription>Find your luggage upon arrival.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center text-center">
                            <BaggageClaim className="w-10 h-10 mb-2 text-primary" />
                            <p className="text-muted-foreground">Carousel</p>
                            <p className="text-4xl font-bold">5</p>
                        </CardContent>
                    </Card>
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>In-Flight Services</CardTitle>
                            <CardDescription>Upgrade your experience.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start"><Wifi className="mr-2 h-4 w-4"/> Purchase In-Flight Wi-Fi</Button>
                            <Button variant="outline" className="w-full justify-start"><Gift className="mr-2 h-4 w-4" /> View Duty-Free Catalogue</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
