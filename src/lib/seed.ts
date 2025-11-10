'use client';

import { collection, getDocs, writeBatch, Firestore } from 'firebase/firestore';
import { mockFlights, mockDrones } from './data';

export async function seedDatabase(db: Firestore) {
  const flightsRef = collection(db, 'flights');
  const dronesRef = collection(db, 'drones');

  const flightsSnapshot = await getDocs(flightsRef);
  const dronesSnapshot = await getDocs(dronesRef);

  let seeded = false;

  if (flightsSnapshot.empty) {
    const batch = writeBatch(db);
    mockFlights.forEach((flight) => {
      const docRef = collection(db, 'flights').doc(flight.id);
      batch.set(docRef, flight);
    });
    await batch.commit();
    console.log('Mock flights seeded.');
    seeded = true;
  }

  if (dronesSnapshot.empty) {
    const batch = writeBatch(db);
    mockDrones.forEach((drone) => {
      const docRef = collection(db, 'drones').doc(drone.id);
      batch.set(docRef, drone);
    });
    await batch.commit();
    console.log('Mock drones seeded.');
    seeded = true;
  }

  if (seeded) {
    console.log('Database seeding complete.');
  } else {
    console.log('Database already contains data, skipping seed.');
  }
}
