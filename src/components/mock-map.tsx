
'use client';

import Image from 'next/image';

export function MockMap() {
  return (
    <div className="relative w-full h-full min-h-[400px] bg-muted/20 overflow-hidden border-t">
      <Image
        src="https://images.unsplash.com/photo-1569929237648-4b7264624ade?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Stylized world map"
        fill
        className="object-cover opacity-30"
        data-ai-hint="world map"
      />
       <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/50 to-transparent">
        <div className="text-center p-4 rounded-lg bg-background/80 backdrop-blur-sm border">
          <h3 className="font-semibold text-foreground">Live Map Unavailable</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Using mock data visualization.
          </p>
        </div>
      </div>
    </div>
  );
}
