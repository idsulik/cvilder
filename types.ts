export interface ResumeProfile {
  network: string;
  username: string;
  url: string;
}

export interface ResumeLocation {
  address: string;
  city: string;
  region: string;
  postalCode: string;
  countryCode: string;
}

export interface ResumeBasics {
  name: string;
  label: string;
  email: string;
  phone: string;
  url: string;
  summary: string;
  location: ResumeLocation;
  profiles: ResumeProfile[];
}

export interface ResumeWork {
  id: string;
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
}

export interface ResumeEducation {
  id: string;
  institution: string;
  url: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score: string;
  courses: string[];
}

export interface ResumeSkill {
  id: string;
  name: string;
  level: string;
  keywords: string[];
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  url: string;
  startDate: string;
  endDate: string;
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface ResumeAdditionalSection {
  id: string;
  title: string; // e.g., "Languages", "Awards", "Volunteering"
  items: string[]; // List of text items
}

export interface ResumeData {
  basics: ResumeBasics;
  work: ResumeWork[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  additional: ResumeAdditionalSection[];
  sectionOrder: string[];
}

export type TemplateId = 'professional' | 'tech';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string; // URL or placeholder
}

export interface ResumeMeta {
  id: string;
  name: string;
  lastModified: number;
}
