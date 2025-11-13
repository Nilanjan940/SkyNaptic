'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFirestore, setDocumentNonBlocking } from "@/firebase";
import { Flight } from "@/lib/types";
import { collection, doc } from "firebase/firestore";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "@/hooks/use-toast";

const flightFormSchema = z.object({
  flightNumber: z.string().min(3, { message: "Flight number must be at least 3 characters." }),
  airline: z.string().min(2, { message: "Airline must be at least 2 characters." }),
  origin: z.string().length(3, { message: "Origin must be a 3-letter airport code." }).toUpperCase(),
  destination: z.string().length(3, { message: "Destination must be a 3-letter airport code." }).toUpperCase(),
  departureTime: z.string(),
  arrivalTime: z.string(),
  status: z.enum(["On Time", "Delayed", "In-Flight", "Landed", "Cancelled"]),
});

type FlightFormValues = z.infer<typeof flightFormSchema>;

type FlightFormProps = {
    flight: Flight | null;
    onFormSubmit: () => void;
}

export function FlightForm({ flight, onFormSubmit }: FlightFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<FlightFormValues>({
    resolver: zodResolver(flightFormSchema),
    defaultValues: {
      flightNumber: '',
      airline: '',
      origin: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      status: 'On Time',
    },
  });

  useEffect(() => {
    if (flight) {
      form.reset({
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        origin: flight.origin,
        destination: flight.destination,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        status: flight.status,
      });
    } else {
        form.reset({
            flightNumber: '',
            airline: '',
            origin: '',
            destination: '',
            departureTime: '',
            arrivalTime: '',
            status: 'On Time',
        });
    }
  }, [flight, form]);

  async function onSubmit(data: FlightFormValues) {
    if (!firestore) return;

    if (flight) {
      // Update existing flight
      const flightRef = doc(firestore, "flights", flight.id);
      const flightData = { ...flight, ...data };
      setDocumentNonBlocking(flightRef, flightData, { merge: true });
      toast({ title: "Flight Updated", description: `Flight ${data.flightNumber} has been successfully updated.` });
    } else {
      // Create new flight
      const newFlightData: Flight = {
          ...data,
          id: data.flightNumber.replace(/\s+/g, '-').toUpperCase(),
          altitude: 0,
          speed: 0,
          heading: 0,
          latitude: 0, // Should be set based on origin airport
          longitude: 0, // Should be set based on origin airport
      }
      const flightRef = doc(firestore, 'flights', newFlightData.id);
      setDocumentNonBlocking(flightRef, newFlightData, { merge: false });
      toast({ title: "Flight Scheduled", description: `Flight ${data.flightNumber} has been added to the schedule.` });
    }
    onFormSubmit();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="flightNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Flight Number</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., UA2481" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="airline"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Airline</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., United Airlines" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
             <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Origin Airport</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., SFO" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Destination Airport</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., JFK" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
         <div className="grid grid-cols-2 gap-4">
             <FormField
            control={form.control}
            name="departureTime"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Departure Time</FormLabel>
                <FormControl>
                    <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="arrivalTime"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Arrival Time</FormLabel>
                <FormControl>
                    <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select flight status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="On Time">On Time</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                  <SelectItem value="In-Flight">In-Flight</SelectItem>
                  <SelectItem value="Landed">Landed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">{flight ? 'Update Flight' : 'Schedule Flight'}</Button>
      </form>
    </Form>
  );
}


type FlightFormDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    flight: Flight | null;
}

export function FlightFormDialog({ isOpen, onOpenChange, flight }: FlightFormDialogProps) {
    const handleFormSubmit = () => {
        onOpenChange(false);
    }
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{flight ? 'Edit Flight' : 'Schedule New Flight'}</DialogTitle>
                    <DialogDescription>
                        {flight ? 'Update the details for this flight.' : 'Enter the details for the new flight to add it to the schedule.'}
                    </DialogDescription>
                </DialogHeader>
                <FlightForm flight={flight} onFormSubmit={handleFormSubmit} />
            </DialogContent>
        </Dialog>
    )
}
