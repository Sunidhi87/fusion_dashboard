import type { IntelligenceNode } from '../types/intelligence';

export const mockNodes: IntelligenceNode[] = [
  {
    id: 'node-1',
    type: 'OSINT',
    title: 'Social Media Chatter - Sector 7G',
    description: 'Increased volume of posts regarding troop movements near the northern border.',
    latitude: 34.0522,
    longitude: -118.2437,
    timestamp: new Date().toISOString(),
    source: 'Twitter/X API',
    reliability: 'Medium',
    tags: ['movement', 'social-media'],
  },
  {
    id: 'node-2',
    type: 'IMINT',
    title: 'Satellite Imagery - Facility Alpha',
    description: 'High-resolution capture showing newly constructed storage units.',
    latitude: 34.1522,
    longitude: -118.1437,
    timestamp: new Date().toISOString(),
    source: 'AWS S3 / Sentinel-2',
    reliability: 'High',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop',
    tags: ['satellite', 'infrastructure'],
  },
  {
    id: 'node-3',
    type: 'HUMINT',
    title: 'Field Report 04-B',
    description: 'Local informant reports unusual vehicle traffic at night.',
    latitude: 33.9522,
    longitude: -118.3437,
    timestamp: new Date().toISOString(),
    source: 'Secure Comm Link',
    reliability: 'Low',
    tags: ['informant', 'vehicles'],
  }
];

export const fetchIntelligenceData = async (): Promise<IntelligenceNode[]> => {
  try {
    const response = await fetch('/api/intelligence/db');
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    const data = await response.json();
    
    // If the database is empty or not connected, return mocks for demonstration
    if (data.length === 0) {
      console.warn('Database is empty, falling back to mock data.');
      return mockNodes;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch from backend, using mock data:', error);
    return mockNodes;
  }
};
