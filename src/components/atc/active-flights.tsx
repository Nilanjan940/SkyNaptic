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
import { ArrowRight, Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCollection, useFirestore, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, doc } from "firebase/firestore";
import type { Flight } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useState } from "react";
import { FlightFormDialog } from "./flight-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export function ActiveFlights() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const flightsQuery = useMemoFirebase(() => firestore && query(collection(firestore, 'flights')), [firestore]);
  const { data: flights, isLoading } = useCollection<Flight>(flightsQuery);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
  
  const handleEdit = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsFormOpen(true);
  };
  
  const handleDelete = (flight: Flight) => {
    if (!firestore) return;
    const flightRef = doc(firestore, 'flights', flight.id);
    deleteDocumentNonBlocking(flightRef);
    toast({ title: "Flight Deleted", description: `Flight ${flight.flightNumber} has been removed.` });
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setSelectedFlight(null);
    }
    setIsFormOpen(open);
  }

  return (
    <>
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && flights && flights.map((flight) => (
                <TableRow key={flight.id}>
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
                  <TableCell>
                    <Badge variant={getStatusVariant(flight.status) as any}>
                      {flight.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEdit(flight)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-500/10">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the flight record for {flight.flightNumber}.
                              </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(flight)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
               {!isLoading && !flights?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No active flights.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
    <FlightFormDialog
        isOpen={isFormOpen}
        onOpenChange={handleDialogClose}
        flight={selectedFlight}
      />
    </>
  );
}
