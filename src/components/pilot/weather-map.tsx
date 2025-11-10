import { Map } from "@/components/map";
import { mockFlights } from "@/lib/data";

export function WeatherMap() {
    const myFlight = mockFlights.find(f => f.id === 'UA2481');
    const flights = myFlight ? [myFlight] : [];

    return (
        <Map
            title="Weather & Route"
            description="Live weather overlays and flight path visualization."
            flights={flights}
        />
    )
}
