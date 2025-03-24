// Types based on the backend API response
export interface Trainer {
  id: string;
  name: string;
  username: string;
  phone_number?: string;
  gender?: string;
  age?: number;
  height?: number;
  date_joined?: string;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string; // Including slug as it's required in some components
  description: string;
  video_url: string;
  duration: string;
  is_free_preview: boolean;
  order: number;
}

export interface Part {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: string;
  is_published: boolean;
  category: Category;
  trainers: Trainer[];
  parts: Part[];
}
