export interface Transaction {
  id?: string; // timestamp string
  timestamp?: string;
  date: string;
  product: string;
  qty: number;
  price: number;
  total: number;
  addedBy?: string; // New field for Audit Trail
}

export interface Product {
  id: number;
  name: string;
  price: number;
  costPrice?: number; // Optional because legacy data might not have it
  stock: number;
  image: string;
  sold: number;
}

export interface Profile {
  name: string;
  email: string;
  photourl: string;
  password?: string;
}

export interface FullDashboardData {
  transactions: Transaction[];
  products: Product[];
  profile: Profile;
  profiles?: Profile[]; // New field for multi-user support
}
