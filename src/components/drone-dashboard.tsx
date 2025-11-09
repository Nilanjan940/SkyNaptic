"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DroneMap } from "./drone/drone-map";
import { DroneStatusList } from "./drone/drone-status-list";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Map, Pin } from "lucide-react";

export function DroneDashboard() {
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== 'drone-operator') {
            router.push('/');
        }
    }, [router]);


    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold font-headline mb-2">Drone Operator Dashboard</h1>
            <p className="text-muted-foreground mb-8">
                Manage your fleet and monitor approved flight zones.
            </p>
            <div className="grid gap-6 lg:grid-cols-2">
                <div>
                    <DroneMap />
                </div>
                <div className="flex flex-col gap-6">
                    <DroneStatusList />
                     <Card>
                        <CardHeader>
                            <CardTitle>Approved Flight Zones</CardTitle>
                            <CardDescription>Geofenced areas for operation.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-3"><Pin className="h-4 w-4 text-primary" /> <span>Downtown Core - Sector A</span></li>
                                <li className="flex items-center gap-3"><Pin className="h-4 w-4 text-primary" /> <span>Industrial Park - Zone 3</span></li>
                                <li className="flex items-center gap-3"><Pin className="h-4 w-4 text-muted-foreground" /> <span>Suburban Residential - West</span></li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
