'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { Drone } from "@/lib/types";
import { BatteryFull, BatteryLow, Loader2 } from "lucide-react";
import { Progress } from "../ui/progress";

function DroneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 18a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-1 0v4a.5.5 0 0 0 .5.5z" />
      <path d="M12 8a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 1 .5.5z" />
      <path d="M12 8a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5z" />
      <path d="m7 14-2-2 2-2" />
      <path d="m17 14 2-2-2-2" />
      <path d="M12 12a4.5 4.5 0 0 0-4.5 4.5h9a4.5 4.5 0 0 0-4.5-4.5z" />
    </svg>
  );
}

export function DroneStatusList() {
    const firestore = useFirestore();
    const dronesQuery = useMemoFirebase(() => firestore && query(collection(firestore, 'drones')), [firestore]);
    const { data: drones, isLoading } = useCollection<Drone>(dronesQuery);
    
    const getStatusVariant = (status: string) => {
        return status === 'In-Flight' ? 'default' : 'secondary';
    }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>My Fleet</CardTitle>
        <CardDescription>Status of all drones under your operation.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-96">
            <div className="p-6 space-y-4">
            {isLoading && <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />}
            {!isLoading && drones && drones.map((drone) => (
            <div key={drone.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-4">
                    <DroneIcon className="h-8 w-8 text-primary" />
                    <div>
                        <p className="font-semibold">{drone.id}</p>
                        <p className="text-sm text-muted-foreground">{drone.model}</p>
                    </div>
                </div>
                <div className="text-right w-28">
                     <div className="flex items-center justify-end gap-2">
                        <p className="text-xs font-bold">{drone.battery}%</p>
                        <Progress value={drone.battery} className="h-2 w-12" />
                    </div>
                    <Badge variant={getStatusVariant(drone.status) as any} className="mt-1">{drone.status}</Badge>
                </div>
            </div>
            ))}
            {!isLoading && !drones?.length && (
                <div className="text-center text-sm text-muted-foreground py-4">
                    No drones in your fleet.
                </div>
            )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
