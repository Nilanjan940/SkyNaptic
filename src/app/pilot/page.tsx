import { Header } from "@/components/header";
import { PilotDashboard } from "@/components/pilot-dashboard";

export default function PilotPage() {
    return (
        <div className="min-h-screen flex flex-col bg-muted/40">
            <Header />
            <main className="flex-grow">
                <PilotDashboard />
            </main>
        </div>
    );
}
