# **App Name**: SkyNaptic

## Core Features:

- Role-Based Authentication: Secure user authentication with role-based access control (ATC, Pilot, Passenger, Drone Operator) using Firebase Authentication with custom claims, enabling dashboard and feature access.
- Airspace Visualization (ATC): Display real-time airspace view for ATC, including active flights and potential conflict alerts using the Google Maps JavaScript API and data from AviationStack or OpenSky Network.
- Flight Plan Display (Pilot): Display flight plan details, real-time weather overlays (via OpenWeatherMap API), and route suggestions for pilots within their dashboard.
- Flight Status Tracking (Passenger): Enable passengers to track live flight status, gate details, and delay alerts via a real-time dashboard.
- Drone/eVTOL Tracking (Operator): Display low-altitude airspace information, approved flight zones, and real-time tracking for drone operators.
- Conflict Prediction Simulation: Use an AI-powered Cloud Function tool to analyze positional flight data, predict potential conflicts, and trigger alerts to ATC. The tool reasons about when and if the alert should be triggered, to filter redundant data.
- Real-time Alerts: Send real-time delay, rerouting, and emergency alerts to relevant users (ATC, Pilots, Passengers, Drone Operators) via Firebase Cloud Messaging based on triggers.
- User profile management: Store user profiles and roles in Firestore and use Firestore real-time listeners to dynamically update dashboard.

## Style Guidelines:

- Primary color: Sky blue (#87CEEB) evoking air travel and clear skies.
- Background color: Very light grayish-blue (#F0F8FF). Same hue as the primary, creating a calming, neutral background for data displays.
- Accent color: Soft orange (#FFB347). Analogous to the primary color, this will create visual contrast on interactive elements.
- Headline font: 'Space Grotesk', a sans-serif that is futuristic and suitable for headlines. Body font: 'Inter' a modern sans-serif font suitable for body.
- Use clean, line-based icons from Material UI to represent different functions and data points, consistent across all dashboards.
- Employ a responsive grid layout with clear visual hierarchy, ensuring optimal viewing across devices. Utilize Material UI's card components to group related information on each dashboard.
- Implement subtle transition effects (e.g., fade-in, slide-in) when loading new data or switching between dashboard sections to improve user experience.