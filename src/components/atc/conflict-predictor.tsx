
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ConflictAlert, Flight } from '@/lib/types';
import { AlertTriangle, Bot, CheckCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '../ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { predictConflicts } from '@/lib/conflict-detection';

type ConflictPredictorProps = {
    alerts: ConflictAlert[];
    setAlerts: (alerts: ConflictAlert[]) => void;
}

export function ConflictPredictor({ alerts, setAlerts }: ConflictPredictorProps) {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const firestore = useFirestore();

  const inFlightQuery = useMemoFirebase(() => firestore && query(collection(firestore, 'flights'), where('status', '==', 'In-Flight')), [firestore]);
  const { data: flights, isLoading: flightsLoading } = useCollection<Flight>(inFlightQuery);


  useEffect(() => {
    setLoading(flightsLoading);
    if (flightsLoading || !flights) {
        setAlerts([]);
        return;
    };

    if (flights.length < 2) {
      setAlerts([]);
      return;
    }

    try {
      const result = predictConflicts(flights);
      setAlerts(result.conflictAlerts || []);
      
    } catch (error: any) {
      console.error("Conflict prediction failed:", error);
      toast({
        title: "Prediction Error",
        description: "Could not run the conflict prediction model.",
        variant: "destructive",
      });
    }

  }, [flights, flightsLoading, setAlerts, toast]);


  const getSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <span>Live Conflict Analysis</span>
        </CardTitle>
        <CardDescription>
          Automatically analyzing airspace for potential conflicts in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[120px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-sm text-muted-foreground">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
             <p className="mt-2">Analyzing Airspace...</p>
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                <AlertTriangle className="h-5 w-5 mt-1 text-destructive flex-shrink-0" />
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{alert.reason}</h4>
                        <Badge variant={getSeverityBadge(alert.severity)}>{alert.severity}</Badge>
                    </div>
                  <p className="text-sm text-muted-foreground">
                    Flights: <span className="font-medium text-foreground">{alert.flightIds.join(' & ')}</span>
                  </p>
                  {alert.timeToImpact > 0 && <p className="text-sm text-muted-foreground">
                    Time to Impact: <span className="font-medium text-foreground">{Math.round(alert.timeToImpact)}s</span>
                  </p>}
                   <p className="text-sm text-muted-foreground">
                    Predicted Conflict Location: <span className="font-medium text-foreground">{alert.latitude.toFixed(2)}, {alert.longitude.toFixed(2)} at {alert.altitude} ft</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground h-full p-4 bg-green-500/10 rounded-lg border border-green-500/20">
            <CheckCircle className="w-8 h-8 mb-2 text-green-600" />
            <p className="font-semibold text-green-700">Airspace Clear</p>
            <p className="text-xs mt-1">No potential conflicts detected.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
