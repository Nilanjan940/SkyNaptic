"use client";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Cloudy, Plane } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center text-center px-4">
            <div className="absolute inset-0 bg-primary/10 -z-10" />
            <Image
                src="https://images.unsplash.com/photo-1570795521198-8045d6a7f34a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjB2aWV3JTIwb2YlMjBhaXJwbGFuZXxlbnwwfHx8fDE3NjI4MDY3MjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Aerial view of an airplane wing over clouds"
                fill
                className="object-cover -z-20 opacity-20"
                data-ai-hint="aerial view airplane"
            />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-foreground">
                    The Future of Air Traffic Management is Here
                </h1>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    SkyNaptic provides a unified platform for air traffic controllers, pilots, and drone operators to ensure safer skies and more efficient operations.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" className="font-semibold">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button size="lg" variant="outline" className="font-semibold">
                        Learn More
                    </Button>
                </div>
            </div>
        </section>

        <section className="py-16 md:py-24 bg-card">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">A New Era of Airspace Coordination</h2>
                    <p className="mt-4 text-muted-foreground md:text-lg">
                        Our AI-powered platform provides predictive insights and seamless communication across all airspace users.
                    </p>
                </div>

                <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-primary/10 rounded-full mb-4">
                            <Bot className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold font-headline">AI-Powered Conflict Prediction</h3>
                        <p className="mt-2 text-muted-foreground">
                            Proactively identify and mitigate potential airspace conflicts before they occur with our advanced AI models.
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-primary/10 rounded-full mb-4">
                            <Plane className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold font-headline">Unified Traffic View</h3>
                        <p className="mt-2 text-muted-foreground">
                            Visualize all air traffic, from commercial airliners to commercial drones, in a single, intuitive interface.
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-primary/10 rounded-full mb-4">
                            <Cloudy className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold font-headline">Real-time Weather & Data</h3>
                        <p className="mt-2 text-muted-foreground">
                            Integrate live weather data and flight plans for enhanced situational awareness and decision making.
                        </p>
                    </div>
                </div>
            </div>
        </section>
      </main>
      <footer className="py-6 bg-muted">
          <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} SkyNaptic. All Rights Reserved.
          </div>
      </footer>
    </div>
  );
}
