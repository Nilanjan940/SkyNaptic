'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { Flight } from "@/lib/types";

export function ActiveFlights() {
  const firestore = useFirestore();
  const flightsQuery = useMemoFirebase(() => firestore && query(collection(firestore, 'flights')), [firestore]);
  const { data: flights, isLoading } = useCollection<Flight>(flightsQuery);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "In-Flight":
        return "default";
      case "On Time":
        return "secondary";
      case "Delayed":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-md">
      <CardHeader>
        <CardTitle>Active Flights</CardTitle>
        <CardDescription>
          A list of all flights currently in the system.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-96">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Flight</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Altitude</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && flights && flights.map((flight) => (
                <TableRow key={flight.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium">{flight.flightNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {flight.airline}
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <span className="font-semibold">{flight.origin}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{flight.destination}</span>
                  </TableCell>
                  <TableCell>{flight.altitude > 0 ? `${flight.altitude} ft` : 'Grounded'}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getStatusVariant(flight.status) as any}>
                      {flight.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && !flights?.length && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No active flights.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
