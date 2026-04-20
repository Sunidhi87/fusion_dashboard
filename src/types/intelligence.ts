export type IntelligenceType = 'OSINT' | 'HUMINT' | 'IMINT';

export interface IntelligenceNode {
  id: string;
  type: IntelligenceType;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  source: string;
  reliability?: string;
  imageUrl?: string;
  tags: string[];
}
