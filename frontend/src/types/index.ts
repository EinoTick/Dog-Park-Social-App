/** TypeScript types that mirror the backend Pydantic response schemas. */

// --- User ---
export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface UserPublic {
  id: number;
  username: string;
  full_name: string | null;
}

// --- Dog ---
export type DogSize = "small" | "medium" | "large";

export interface Dog {
  id: number;
  name: string;
  breed: string;
  size: DogSize;
  good_with_others: boolean;
  personality_notes: string | null;
  photo_url: string | null;
  owner_id: number;
  created_at: string;
}

export interface DogCreate {
  name: string;
  breed?: string;
  size?: DogSize;
  good_with_others?: boolean;
  personality_notes?: string;
  photo_url?: string;
}

export interface DogUpdate extends Partial<DogCreate> {}

// --- Park ---
export interface Park {
  id: number;
  name: string;
  address: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  created_by_id: number;
  created_at: string;
}

export interface ParkCreate {
  name: string;
  address: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

// --- Visit ---
export interface Visit {
  id: number;
  start_time: string;
  end_time: string;
  notes: string | null;
  user_id: number;
  park_id: number;
  created_at: string;
  dogs: Dog[];
}

export interface VisitDetail extends Visit {
  user: UserPublic;
  park: Park;
}

export interface VisitCreate {
  park_id: number;
  start_time: string;
  end_time: string;
  dog_ids: number[];
  notes?: string;
}

// --- Dashboard ---
export interface DashboardStats {
  upcoming_visit_count: number;
  most_popular_park: string | null;
  most_popular_park_visit_count: number;
}

// --- Auth ---
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}
