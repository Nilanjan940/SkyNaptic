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
  timeToImpact: z.number().describe('The estimated time to impact in seconds.'),
  latitude: z.number().describe('The latitude of the potential conflict.'),
  longitude: z.number().describe('The longitude of the potential conflict.'),
  altitude: z.number().describe('The altitude of the potential conflict.'),
  severity: z.enum(['low', 'medium', 'high']).describe('The severity of the potential conflict.'),
  probability: z.number().describe('The probability of the conflict occurring (0-1).'),
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
  prompt: `You are an expert air traffic controller specializing in conflict prediction.

You will receive flight data for multiple aircraft and must identify potential conflicts.

Analyze the flight data to predict potential conflicts, estimating the time to impact, location, and severity.
Consider factors such as proximity, altitude, speed, and heading.

Return a list of conflict alerts, including the flight IDs involved, time to impact, location, severity, and probability.

Flight Data: {{{flightData}}}

Respond with conflict alerts formatted as a JSON array. If there are no conflicts, return an empty array.
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
