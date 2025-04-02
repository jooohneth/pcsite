export interface Specs {
  Cores?: string;
  Threads?: string;
  "Base Clock"?: string;
  "Boost Clock"?: string;
  TDP?: string;
  Socket?: string;
  [key: string]: string | undefined; // For any other spec fields
}

export interface PCPart {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  price: number;
  url: string;
  specs: Specs;
}
