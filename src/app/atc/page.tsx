import { Header } from "@/components/header";
import { AtcDashboard } from "@/components/atc-dashboard";

export default function AtcPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <AtcDashboard />
            </main>
        </div>
    );
}
