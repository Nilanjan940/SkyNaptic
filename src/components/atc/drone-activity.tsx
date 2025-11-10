import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockDrones } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

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


export function DroneActivity() {
  const getStatusVariant = (status: string) => {
    return status === 'In-Flight' ? 'default' : 'secondary';
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Drone Activity</CardTitle>
        <CardDescription>
          Low-altitude drone and eVTOL traffic.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {mockDrones.map((drone) => (
          <div key={drone.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-4">
              <DroneIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">{drone.id}</p>
                <p className="text-sm text-muted-foreground">{drone.operator}</p>
              </div>
            </div>
            <div className="text-right">
                <Badge variant={getStatusVariant(drone.status)}>{drone.status}</Badge>
                <p className="text-sm text-muted-foreground mt-1">{drone.altitude} ft</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
