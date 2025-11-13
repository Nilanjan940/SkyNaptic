
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DroneMap } from "./drone/drone-map";
import { DroneStatusList } from "./drone/drone-status-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Map, Pin, CloudSun, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { FlightPlanForm } from "./drone/flight-plan-form";

export function DroneDashboard() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        const userEmail = localStorage.getItem("userEmail");
        if (role !== 'drone-operator') {
            router.push('/');
        } else {
            setEmail(userEmail)
        }
    }, [router]);


    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline mb-1">Drone Operator Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage your fleet and monitor approved flight zones. Welcome, <span className="font-semibold text-primary">{email}</span>.
                </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <DroneMap />
                </div>
                <div className="flex flex-col gap-6">
                    <DroneStatusList />
                     <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>Flight Zone & Weather</CardTitle>
                            <CardDescription>Operational areas and conditions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <h4 className="font-semibold text-sm">Approved Flight Zones</h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-3"><Pin className="h-4 w-4 text-green-500" /> <span>Downtown Core - Sector A</span></li>
                                <li className="flex items-center gap-3"><Pin className="h-4 w-4 text-green-500" /> <span>Industrial Park - Zone 3</span></li>
                                <li className="flex items-center gap-3"><Pin className="h-4 w-4 text-yellow-500" /> <span>Suburban Residential - West (Restricted)</span></li>
                            </ul>
                            <div className="border-t pt-4">
                                <h4 className="font-semibold text-sm mb-2">Current Weather</h4>
                                <div className="flex items-center gap-3 text-sm">
                                    <CloudSun className="h-5 w-5 text-muted-foreground" />
                                    <span>Partly Cloudy, 12 mph Wind</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                             <Button size="lg" className="font-semibold">Request New Flight Plan</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Request New Flight Plan</DialogTitle>
                                <DialogDescription>
                                    Fill out the details below to submit a new flight plan for approval.
                                </DialogDescription>
                            </DialogHeader>
                           <FlightPlanForm onFormSubmit={() => setIsFormOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
