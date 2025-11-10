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
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl font-headline">Flight {flightNumber}</CardTitle>
                <CardDescription>{airline}</CardDescription>
            </div>
            <Badge variant={getStatusVariant(status)} className="text-base px-4 py-1">{status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6 text-center">
            <div>
                <p className="text-3xl font-bold font-headline">{origin.code}</p>
                <p className="text-muted-foreground text-sm">{origin.city}</p>
            </div>
            <div className="flex items-center text-muted-foreground px-4">
                <div className="h-px flex-grow bg-border"></div>
                <Plane className="mx-4 h-6 w-6 text-primary" />
                <div className="h-px flex-grow bg-border"></div>
            </div>
             <div>
                <p className="text-3xl font-bold font-headline">{destination.code}</p>
                <p className="text-muted-foreground text-sm">{destination.city}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div>
                <h4 className="font-semibold mb-3 text-lg">Departure</h4>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-muted-foreground" /> Scheduled: <span className="font-medium ml-auto">{departure.scheduled}</span></div>
                    <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary" /> Estimated: <span className="font-medium ml-auto">{departure.estimated}</span></div>
                    <div className="flex items-center gap-3"><DoorOpen className="h-5 w-5 text-muted-foreground" /> Terminal / Gate: <span className="font-medium ml-auto">{departure.terminal} / {gate}</span></div>
                </div>
            </div>
            <div>
                <h4 className="font-semibold mb-3 text-lg">Arrival</h4>
                <div className="space-y-3 text-sm">
                     <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-muted-foreground" /> Scheduled: <span className="font-medium ml-auto">{arrival.scheduled}</span></div>
                    <div className="flex items-center gap-3"><Clock className="h-5 w-5 text-primary" /> Estimated: <span className="font-medium ml-auto">{arrival.estimated}</span></div>
                    <div className="flex items-center gap-3"><DoorOpen className="h-5 w-5 text-muted-foreground" /> Terminal: <span className="font-medium ml-auto">{arrival.terminal}</span></div>
                </div>
            </div>
        </div>

         <div className="border-t pt-4 mt-6">
            <div className="flex items-center gap-3">
                <Armchair className="h-5 w-5 text-muted-foreground" />
                <p>Your Seat:</p>
                <p className="font-bold text-lg ml-auto">{seat}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
