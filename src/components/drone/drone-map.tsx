import { Map } from "@/components/map";
import { mockDrones } from "@/lib/data";

export function DroneMap() {
    return (
        <Map
            title="Low-Altitude Airspace"
            description="View approved flight zones, real-time drone traffic, and weather conditions."
            drones={mockDrones.filter(d => d.status === 'In-Flight')}
        />
    )
}
