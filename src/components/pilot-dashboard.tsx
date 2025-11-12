"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlightPlan } from "./pilot/flight-plan";
import { WeatherMap } from "./pilot/weather-map";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { AlertTriangle, MessageSquare, Wind } from "lucide-react";
import { Button } from "./ui/button";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";

const checklistItems = [
    { id: "walkaround", label: "Pre-flight Inspection (Walkaround)" },
    { id: "instruments", label: "Instruments & Radios Checked" },
    { id: "fuel", label: "Fuel Quantity & Quality Confirmed" },
    { id: "briefing", label: "Passenger & Crew Briefing Complete" },
    { id: "clearance", label: "Takeoff Clearance Received" }
]

export function PilotDashboard() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const handleCheckChange = (id: string, checked: boolean) => {
        setCheckedItems(prev => ({ ...prev, [id]: checked }));
    }

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
                <div className="lg:col-span-2 grid gap-6">
                    <FlightPlan />
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Pre-Flight Checklist</CardTitle>
                            <CardDescription>Ensure all procedures are completed before takeoff.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {checklistItems.map(item => (
                                <div key={item.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
                                    <Checkbox 
                                        id={item.id} 
                                        checked={checkedItems[item.id] || false}
                                        onCheckedChange={(checked) => handleCheckChange(item.id, !!checked)}
                                    />
                                    <label
                                        htmlFor={item.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        {item.label}
                                    </label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col gap-6">
                    <WeatherMap />
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>ATC Alerts & Messages</CardTitle>
                            <CardDescription>Real-time updates from Air Traffic Control.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Priority Alert</AlertTitle>
                                <AlertDescription>
                                    Reroute immediately to heading 1-3-0. Weather cell forming over planned route. Acknowledge.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                    <Button size="lg" className="font-semibold"><MessageSquare className="mr-2 h-5 w-5" /> Contact ATC</Button>
                </div>
            </div>
        </div>
    );
}
