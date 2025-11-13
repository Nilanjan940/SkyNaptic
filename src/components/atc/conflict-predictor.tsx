'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ConflictAlert, Flight } from '@/lib/types';
import { AlertTriangle, Bot, Loader2, Zap } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { predictConflicts } from '@/lib/conflict-detection';

export function ConflictPredictor() {
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<ConflictAlert[]>([]);
  const { toast } = useToast();
  const firestore = useFirestore();

  const inFlightQuery = useMemoFirebase(() => firestore && query(collection(firestore, 'flights'), where('status', '==', 'In-Flight')), [firestore]);
  const { data: flights } = useCollection<Flight>(inFlightQuery);


  const handlePredict = async () => {
    setLoading(true);
    setAlerts([]);

    if (!flights || flights.length < 2) {
      toast({
        title: "Not Enough Data",
        description: "Need at least two in-flight aircraft to predict conflicts.",
      });
      setLoading(false);
      return;
    }

    try {
      // Simulate processing time for a more realistic feel
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = predictConflicts(flights);

      if (result.conflictAlerts && result.conflictAlerts.length > 0) {
        setAlerts(result.conflictAlerts);
        toast({
          title: "Potential Conflicts Detected!",
          description: `${result.conflictAlerts.length} potential conflicts identified.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "No Conflicts Found",
          description: "The airspace is clear of potential conflicts based on current data.",
        });
      }
    } catch (error: any) {
      console.error("Conflict prediction failed:", error);
      toast({
        title: "Prediction Error",
        description: "Could not run the conflict prediction model.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <span>Conflict Prediction Engine</span>
        </CardTitle>
        <CardDescription>
          Use rule-based analysis of in-flight aircraft to predict potential conflicts.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[120px]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <div className="flex flex-col items-center justify-center text-center text-sm text-muted-foreground h-full p-4 bg-muted/50 rounded-lg">
            <p>No conflicts detected. Run prediction to check for potential issues.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handlePredict} disabled={loading || !flights || flights.length < 2} className="w-full font-semibold">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Airspace...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Run Conflict Prediction
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
