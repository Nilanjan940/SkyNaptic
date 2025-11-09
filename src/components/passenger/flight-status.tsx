import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPassengerFlight } from "@/lib/data";
import { Plane, ArrowRight, Clock, DoorOpen, Armchair } from "lucide-react";

export function FlightStatus() {
  const { flightNumber, airline, origin, destination, status, gate, seat, departure, arrival } = mockPassengerFlight;
  
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "On Time":
        return "default";
      case "Delayed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl font-headline">Flight {flightNumber}</CardTitle>
                <CardDescription>{airline}</CardDescription>
            </div>
            <Badge variant={getStatusVariant(status)} className="text-lg px-4 py-1">{status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
            <div className="text-center">
                <p className="text-2xl font-bold font-headline">{origin.match(/\(([^)]+)\)/)?.[1]}</p>
                <p className="text-muted-foreground">{origin.split('(')[0].trim()}</p>
            </div>
            <div className="flex items-center text-muted-foreground">
                <div className="h-px w-16 bg-border"></div>
                <Plane className="mx-2 h-5 w-5" />
                <div className="h-px w-16 bg-border"></div>
            </div>
             <div className="text-center">
                <p className="text-2xl font-bold font-headline">{destination.match(/\(([^)]+)\)/)?.[1]}</p>
                <p className="text-muted-foreground">{destination.split('(')[0].trim()}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div>
                <h4 className="font-semibold mb-2">Departure</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /> Scheduled: <span className="font-medium ml-auto">{departure.scheduled}</span></div>
                    <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-primary" /> Estimated: <span className="font-medium ml-auto">{departure.estimated}</span></div>
                    <div className="flex items-center gap-3"><DoorOpen className="h-4 w-4 text-muted-foreground" /> Terminal / Gate: <span className="font-medium ml-auto">{departure.terminal} / {gate}</span></div>
                </div>
            </div>
            <div>
                <h4 className="font-semibold mb-2">Arrival</h4>
                <div className="space-y-2 text-sm">
                     <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /> Scheduled: <span className="font-medium ml-auto">{arrival.scheduled}</span></div>
                    <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-primary" /> Estimated: <span className="font-medium ml-auto">{arrival.estimated}</span></div>
                    <div className="flex items-center gap-3"><DoorOpen className="h-4 w-4 text-muted-foreground" /> Terminal: <span className="font-medium ml-auto">{arrival.terminal}</span></div>
                </div>
            </div>
        </div>

         <div className="border-t pt-4 mt-6">
            <div className="flex items-center gap-3 text-sm">
                <Armchair className="h-4 w-4 text-muted-foreground" />
                <p>Your Seat:</p>
                <p className="font-bold text-base ml-auto">{seat}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
