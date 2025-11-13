
export type UserRole = 'atc' | 'pilot' | 'passenger' | 'drone-operator';

export type Flight = {
  id: string;
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: 'On Time' | 'Delayed' | 'In-Flight' | 'Landed' | 'Cancelled';
  altitude: number;
  speed: number;
  heading: number;
  latitude: number;
  longitude: number;
};

export type Drone = {
  id: string;
  operator: string;
  operatorId: string;
  model: string;
  status: 'Grounded' | 'In-Flight' | 'Returning';
  altitude: number;
  speed: number;
  latitude: number;
  longitude: number;
  battery: number;
};

export type ConflictAlert = {
  flightIds: string[];
  timeToImpact: number;
  latitude: number;
  longitude: number;
  altitude: number;
  severity: "low" | "medium" | "high";
  probability: number;
  reason: string;
};

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};
