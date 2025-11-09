import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type MapPlaceholderProps = {
    title: string;
    description: string;
};

export function MapPlaceholder({ title, description }: MapPlaceholderProps) {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center bg-muted/50 rounded-b-lg">
                <div className="flex flex-col items-center text-center text-muted-foreground p-8">
                    <MapPin className="w-16 h-16 mb-4 text-primary/50" />
                    <h3 className="font-semibold text-lg">Map View Unavailable</h3>
                    <p className="text-sm">
                        Please provide a Google Maps API key to enable this feature.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
