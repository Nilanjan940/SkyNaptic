import { Header } from "@/components/header";
import { PassengerDashboard } from "@/components/passenger-dashboard";

export default function PassengerPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <PassengerDashboard />
            </main>
        </div>
    );
}
