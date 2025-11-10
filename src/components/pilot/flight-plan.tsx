import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockPilotFlightPlan } from "@/lib/data";
import { PlaneTakeoff, PlaneLanding, Route, Fuel, Wind, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

export function FlightPlan() {
  const { flightNumber, aircraft, origin, destination, departureTime, arrivalTime, route, altitude, alternateAirport } = mockPilotFlightPlan;
  return (
    <Card className="h-full shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>Flight Plan: {flightNumber}</CardTitle>
                <CardDescription>{aircraft}</CardDescription>
            </div>
            <Badge variant={"default" as any} className="text-base">Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div className="grid grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <PlaneTakeoff className="h-6 w-6 text-muted-foreground mt-1" />
            <div>
              <p className="text-muted-foreground">Origin</p>
              <p className="font-bold text-lg">{origin}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <PlaneLanding className="h-6 w-6 text-muted-foreground mt-1" />
            <div>
              <p className="text-muted-foreground">Destination</p>
              <p className="font-bold text-lg">{destination}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
             <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p className="text-muted-foreground">Departure:</p>
                <p className="font-mono text-base ml-auto">{departureTime}</p>
            </div>
            <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p className="text-muted-foreground">Arrival:</p>
                <p className="font-mono text-base ml-auto">{arrivalTime}</p>
            </div>
        </div>
        
        <Separator className="my-2" />
        
        <div className="grid gap-4">
            <div className="flex items-start gap-3">
                <Route className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-muted-foreground font-medium">Filed Route</p>
                    <p className="font-mono text-xs leading-relaxed">{route}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                    <Wind className="h-5 w-5 text-muted-foreground" />
                    <p className="text-muted-foreground">Crz. Altitude:</p>
                    <p className="font-semibold ml-auto">{altitude}</p>
                </div>
                 <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                    <PlaneLanding className="h-5 w-5 text-muted-foreground" />
                    <p className="text-muted-foreground">Alternate:</p>
                    <p className="font-semibold ml-auto">{alternateAirport}</p>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
