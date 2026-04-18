export interface Fabric {
  id: string;
  name: string;
  category: string;
  weight: string;
  tags?: string[];
  imageUrl: string;
  type?: string;
  isFeatured?: boolean;
}


export interface Project {
  id: string;
  name: string;
  subtitle: string;
  progress: number;
  daysLeft?: number;
  status: 'active' | 'archived';
  imageUrl: string;
  phase: string;
}

export interface Inspiration {
  id: string;
  title: string;
  type: string;
  imageUrl?: string;
  colors?: string[];
  height: 'tall' | 'short' | 'medium';
  tags: string[];
}
