import { Ride } from '../types';

class RideService {
  async getHistory(): Promise<Ride[]> {
    try {
      const response = await fetch('/api/rides');
      const data = await response.json();
      return data?.data || [];
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
      const data = await response.json();
      return data?.data;
    } catch (error) {
      console.error("Failed to book ride", error);
      throw error;
    }
  }

  async getRideById(id: string): Promise<Ride | null> {
    try {
      const response = await fetch(`/api/rides/${id}`);
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data?.data || null;
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
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  }

  async completeRide(id: string): Promise<void> {
    return this.updateStatus(id, 'completed');
  }
}

export const rideService = new RideService();
