
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
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";
import { Send } from "lucide-react";

const flightPlanSchema = z.object({
  droneId: z.string().min(3, { message: "Drone ID must be at least 3 characters." }),
  flightPath: z.string().min(10, { message: "Please provide a more detailed flight path." }),
  purpose: z.string().min(5, { message: "Purpose must be at least 5 characters long." }),
});

type FlightPlanFormValues = z.infer<typeof flightPlanSchema>;

type FlightPlanFormProps = {
    onFormSubmit: () => void;
}

export function FlightPlanForm({ onFormSubmit }: FlightPlanFormProps) {
  const { toast } = useToast();

  const form = useForm<FlightPlanFormValues>({
    resolver: zodResolver(flightPlanSchema),
    defaultValues: {
      droneId: '',
      flightPath: '',
      purpose: '',
    },
  });

  async function onSubmit(data: FlightPlanFormValues) {
    // In a real application, you would send this data to a backend or AI flow
    console.log("Submitting flight plan:", data);

    toast({ 
      title: "Flight Plan Submitted", 
      description: `Request for ${data.droneId} has been sent for approval.`
    });
    
    onFormSubmit();
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="droneId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Drone ID</FormLabel>
              <FormControl>
                <Input placeholder="e.g., DRN-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="flightPath"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flight Path Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the intended flight path, including waypoints and altitude." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose of Flight</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Package Delivery, Site Inspection" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-2" disabled={form.formState.isSubmitting}>
          <Send className="mr-2 h-4 w-4" /> 
          {form.form-state.isSubmitting ? "Submitting..." : "Submit for Approval"}
        </Button>
      </form>
    </Form>
  );
}
