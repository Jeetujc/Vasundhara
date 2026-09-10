import { apiClient } from './api-client';

export interface LocationItem {
  id: string;
  name: string;
  code: string;
}

export const locationService = {
  // Get all states
  async getStates(): Promise<LocationItem[]> {
    return apiClient.get<LocationItem[]>('/locations/states');
  },

  // Get districts for a state
  async getDistricts(stateId: string): Promise<LocationItem[]> {
    return apiClient.get<LocationItem[]>(
      `/locations/states/${stateId}/districts`,
    );
  },

  // Get tehsils for a district
  async getTehsils(districtId: string): Promise<LocationItem[]> {
    return apiClient.get<LocationItem[]>(
      `/locations/districts/${districtId}/tehsils`,
    );
  },
};