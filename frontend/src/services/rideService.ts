import { Ride } from '../types';

class RideService {
  async getHistory(): Promise<Ride[]> {
    try {
      const response = await fetch('/api/rides');
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch rides", error);
      return [];
    }
  }

  async bookRide(rideData: Partial<Ride>): Promise<Ride> {
    try {
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rideData),
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to book ride", error);
      throw error;
    }
  }

  async getRideById(id: string): Promise<Ride | null> {
    try {
      const response = await fetch(`/api/rides`);
      const rides: Ride[] = await response.json();
      return rides.find(r => r.id === id) || null;
    } catch (error) {
      console.error("Failed to fetch ride details", error);
      return null;
    }
  }

  async acceptRide(id: string, driverData: any): Promise<void> {
    await fetch(`/api/rides/${id}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driverData)
    });
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await fetch(`/api/rides/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  }

  async completeRide(id: string): Promise<void> {
    return this.updateStatus(id, 'completed');
  }
}

export const rideService = new RideService();
