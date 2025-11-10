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
import { mockFlights } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ActiveFlights() {
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
              {mockFlights.map((flight) => (
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
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
