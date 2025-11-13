import { Flight, ConflictAlert } from './types';

const HORIZONTAL_SEPARATION_NM = 5; // 5 nautical miles
const VERTICAL_SEPARATION_FT = 1000; // 1000 feet
const NM_TO_DEGREES = 1 / 60; // 1 nautical mile is approx 1/60th of a degree of latitude

// Convert knots to degrees per second (a rough approximation)
// 1 knot = 1 nm/hr. 1 nm = 1/60 deg. 1 hr = 3600s.
const KNOTS_TO_DPS = (1 / 60) / 3600;

type Vector2D = { x: number; y: number };
type Position = { lat: number; lon: number };
type Velocity = Vector2D;

export function predictConflicts(flights: Flight[]): { conflictAlerts: ConflictAlert[] } {
  const conflictAlerts: ConflictAlert[] = [];

  for (let i = 0; i < flights.length; i++) {
    for (let j = i + 1; j < flights.length; j++) {
      const flightA = flights[i];
      const flightB = flights[j];

      // 1. Check vertical separation first
      const verticalDistance = Math.abs(flightA.altitude - flightB.altitude);
      if (verticalDistance >= VERTICAL_SEPARATION_FT) {
        continue; // No conflict if vertically separated
      }

      // 2. Perform 2D vector analysis for horizontal separation
      const posA: Position = { lat: flightA.latitude, lon: flightA.longitude };
      const velA: Velocity = getVelocityVector(flightA.speed, flightA.heading);

      const posB: Position = { lat: flightB.latitude, lon: flightB.longitude };
      const velB: Velocity = getVelocityVector(flightB.speed, flightB.heading);

      const relativePos: Vector2D = {
        x: (posB.lon - posA.lon), // lon is x
        y: (posB.lat - posA.lat), // lat is y
      };

      const relativeVel: Vector2D = {
        x: velB.x - velA.x,
        y: velB.y - velA.y,
      };

      const dotProductVel = relativeVel.x * relativeVel.x + relativeVel.y * relativeVel.y;
      if (dotProductVel < 1e-6) continue; // Almost zero relative speed, no collision

      const dotProductPosVel = relativePos.x * relativeVel.x + relativePos.y * relativeVel.y;

      // Time of closest approach (TCA) in seconds
      const tca = -dotProductPosVel / dotProductVel;

      if (tca <= 0) continue; // Closest point was in the past

      // Calculate distance at TCA
      const closestDistSq = (relativePos.x + relativeVel.x * tca)**2 + (relativePos.y + relativeVel.y * tca)**2;

      // Convert separation distance from NM to degrees squared
      const separationThresholdSq = (HORIZONTAL_SEPARATION_NM * NM_TO_DEGREES)**2;

      if (closestDistSq < separationThresholdSq) {
        // Potential conflict found
        const conflictLat = flightA.latitude + velA.y * tca;
        const conflictLon = flightA.longitude + velA.x * tca;

        conflictAlerts.push({
          flightIds: [flightA.flightNumber, flightB.flightNumber],
          timeToImpact: tca,
          latitude: conflictLat,
          longitude: conflictLon,
          altitude: (flightA.altitude + flightB.altitude) / 2,
          severity: 'high',
          probability: 1.0, // Rule-based is certain
          reason: 'Predicted Loss of Separation',
        });
      }
    }
  }

  return { conflictAlerts };
}

function getVelocityVector(speedKnots: number, headingDegrees: number): Velocity {
  const speedDps = speedKnots * KNOTS_TO_DPS;
  const headingRad = (headingDegrees * Math.PI) / 180;
  return {
    x: speedDps * Math.sin(headingRad), // lon (East)
    y: speedDps * Math.cos(headingRad), // lat (North)
  };
}
