import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockPilotFlightPlan } from "@/lib/data";
import { PlaneTakeoff, PlaneLanding, Route, Fuel, Wind } from "lucide-react";

export function FlightPlan() {
  const { flightNumber, aircraft, origin, destination, departureTime, arrivalTime, route, altitude, alternateAirport } = mockPilotFlightPlan;
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Current Flight Plan: {flightNumber}</CardTitle>
        <CardDescription>{aircraft}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlaneTakeoff className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Origin</p>
              <p className="font-semibold">{origin}</p>
            </div>
          </div>
          <p className="font-mono text-lg">{departureTime}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlaneLanding className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Destination</p>
              <p className="font-semibold">{destination}</p>
            </div>
          </div>
          <p className="font-mono text-lg">{arrivalTime}</p>
        </div>
        
        <div className="border-t pt-4 grid gap-4">
            <div className="flex items-start gap-3">
                <Route className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-muted-foreground">Route</p>
                    <p className="font-mono text-xs leading-relaxed">{route}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Wind className="h-5 w-5 text-muted-foreground" />
                <p className="text-muted-foreground">Cruising Altitude:</p>
                <p className="font-semibold">{altitude}</p>
            </div>
             <div className="flex items-center gap-3">
                <PlaneLanding className="h-5 w-5 text-muted-foreground" />
                <p className="text-muted-foreground">Alternate:</p>
                <p className="font-semibold">{alternateAirport}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
