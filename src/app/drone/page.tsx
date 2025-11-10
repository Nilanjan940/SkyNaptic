import { Header } from "@/components/header";
import { DroneDashboard } from "@/components/drone-dashboard";

export default function DronePage() {
    return (
        <div className="min-h-screen flex flex-col bg-muted/40">
            <Header />
            <main className="flex-grow">
                <DroneDashboard />
            </main>
        </div>
    );
}
