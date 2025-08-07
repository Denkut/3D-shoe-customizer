import { ShoePart } from "@/app/constants";

export interface ShoeItem {
  id: string;
  model: string;
  size: string;
  customizable: boolean;
  price: number;
  customization?: Partial<Record<ShoePart, string>>; 
}
