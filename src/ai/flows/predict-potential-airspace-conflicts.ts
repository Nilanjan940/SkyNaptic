'use server';
/**
 * @fileOverview An AI agent that analyzes flight data to predict potential airspace conflicts and trigger alerts.
 *
 * - predictPotentialAirspaceConflicts - A function that handles the conflict prediction process.
 * - PredictPotentialAirspaceConflictsInput - The input type for the predictPotentialAirspaceConflicts function.
 * - PredictPotentialAirspaceConflictsOutput - The return type for the predictPotentialAirspaceConflicts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlightDataSchema = z.object({
  flightId: z.string().describe('The unique identifier for the flight.'),
  latitude: z.number().describe('The latitude of the flight.'),
  longitude: z.number().describe('The longitude of the flight.'),
  altitude: z.number().describe('The altitude of the flight in feet.'),
  speed: z.number().describe('The speed of the flight in knots.'),
  heading: z.number().describe('The heading of the flight in degrees.'),
  timestamp: z.string().describe('The timestamp of the flight data in ISO format.'),
});

const PredictPotentialAirspaceConflictsInputSchema = z.object({
  flightData: z.array(FlightDataSchema).describe('An array of flight data for multiple aircraft.'),
});
export type PredictPotentialAirspaceConflictsInput = z.infer<typeof PredictPotentialAirspaceConflictsInputSchema>;

const ConflictAlertSchema = z.object({
  flightIds: z.array(z.string()).describe('The flight IDs of the aircraft involved in the potential conflict.'),
  timeToImpact: z.number().describe('The estimated time to impact in seconds. 0 if it is a location-based issue.'),
  latitude: z.number().describe('The latitude of the potential conflict.'),
  longitude: z.number().describe('The longitude of the potential conflict.'),
  altitude: z-number().describe('The altitude of the potential conflict.'),
  severity: z.enum(['low', 'medium', 'high']).describe('The severity of the potential conflict.'),
  probability: z.number().describe('The probability of the conflict occurring (0-1).'),
  reason: z.string().describe('A brief explanation of the issue, e.g., "Proximity to restricted airspace", "Terrain conflict", "Loss of separation".'),
});

const PredictPotentialAirspaceConflictsOutputSchema = z.object({
  conflictAlerts: z.array(ConflictAlertSchema).describe('An array of potential conflict alerts.'),
});
export type PredictPotentialAirspaceConflictsOutput = z.infer<typeof PredictPotentialAirspaceConflictsOutputSchema>;

export async function predictPotentialAirspaceConflicts(input: PredictPotentialAirspaceConflictsInput): Promise<PredictPotentialAirspaceConflictsOutput> {
  return predictPotentialAirspaceConflictsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictPotentialAirspaceConflictsPrompt',
  input: {schema: z.object({ flightData: z.string() })},
  output: {schema: PredictPotentialAirspaceConflictsOutputSchema},
  prompt: `You are an expert air traffic controller specializing in conflict prediction using advanced analytics.

You will receive flight data for multiple aircraft and must identify potential conflicts.

Analyze the flight data to predict two types of conflicts:
1.  **Loss of Separation:** Aircraft getting too close to each other. Consider their proximity, altitude, speed, and heading to estimate time to impact.
2.  **Location-Based Issues:** Aircraft flying into hazardous situations based on their geographical location (latitude/longitude/altitude). This includes proximity to known restricted airspace (e.g., military zones), challenging terrain (e.g., mountains), or severe weather cells.

Return a list of conflict alerts. For each alert, include:
- The flight IDs involved.
- Estimated time to impact (for separation conflicts).
- The geographical location (lat/lon/alt) of the potential conflict.
- The severity (low, medium, high) and probability (0-1) of the event.
- A concise 'reason' for the alert (e.g., "Loss of separation," "Proximity to restricted airspace," "Mountain terrain conflict").

Flight Data: {{{flightData}}}

Respond with a JSON object containing a 'conflictAlerts' array. If there are no conflicts, return an empty array.
`,
});

const predictPotentialAirspaceConflictsFlow = ai.defineFlow(
  {
    name: 'predictPotentialAirspaceConflictsFlow',
    inputSchema: PredictPotentialAirspaceConflictsInputSchema,
    outputSchema: PredictPotentialAirspaceConflictsOutputSchema,
  },
  async input => {
    const {output} = await prompt({ flightData: JSON.stringify(input.flightData) });
    return output!;
  }
);
