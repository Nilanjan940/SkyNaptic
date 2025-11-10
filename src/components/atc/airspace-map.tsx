import { Map } from "@/components/map";
import { mockFlights, mockDrones } from "@/lib/data";

export function AirspaceMap() {
    return (
        <Map 
            title="Live Airspace"
            description="Real-time visualization of all aircraft, drones, and potential conflicts."
            flights={mockFlights.filter(f => f.status === 'In-Flight')}
            drones={mockDrones.filter(d => d.status === 'In-Flight')}
        />
    )
}
