export interface Project {
  id: string;
  title: string;
  role?: string;
  description: string;
  longDescription?: string;
  image: string;
  tags: string[];
  category: string;
  link?: string;
  github?: string;
  featured?: boolean;
  span?: "normal" | "wide" | "tall" | "large";
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: string;
  icon?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number; // 1-5
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
}
