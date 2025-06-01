
export interface Layer {
  id: string;
  name: string;
  description?: string;
  type: 'precipitation' | 'temperature' | 'custom';
  sourceUrl: string;
  sourceLayer?: string;
  visible: boolean;
  opacity: number;
  order: number;
  style?: {
    fillColor?: any;
    strokeColor?: string;
    strokeWidth?: number;
  };
  legend?: Legend;
}

export interface Legend {
  title: string;
  type: 'gradient' | 'categorical';
  colors: string[];
  labels: string[];
  items?: LegendItem[];
}

export interface LegendItem {
  label: string;
  color: string;
  value?: string | number;
}
