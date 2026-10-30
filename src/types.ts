export type State = {
  q: string;
  color: string;
  size: string;
  maxPrice: number | null;
  sort: string;
  page: number;
};
export type Result = {
  state: State;
  total: number;
  products: {
    id: string;
    name: string;
    brand: string;
    color: string;
    price: number;
    sizes: string[];
    rating: string;
    reviews: number;
  }[];
  facets: {
    colors: { value: string; count: number }[];
    sizes: { value: string; count: number }[];
  };
  pageSize: number;
};
export type Tool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input: Record<string, unknown>) => Promise<unknown>;
  annotations?: { readOnlyHint: boolean };
};
