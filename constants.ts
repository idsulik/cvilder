import { ResumeData, TemplateConfig } from './types';

export const EMPTY_RESUME_STATE: ResumeData = {
  basics: {
    name: "",
    label: "",
    email: "",
    phone: "",
    url: "",
    summary: "",
    location: {
      address: "",
      city: "",
      region: "",
      postalCode: "",
      countryCode: "",
    },
    profiles: []
  },
  work: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  additional: [],
  sectionOrder: [
    'work',
    'education',
    'skills',
    'projects',
    'certifications',
    'additional'
  ]
};

export const INITIAL_RESUME_STATE: ResumeData = {
  basics: {
    name: "John Doe",
    label: "Software Engineer",
    email: "john@example.com",
    phone: "(555) 123-4567",
    url: "https://johndoe.com",
    summary: "Experienced software engineer with a focus on scalable web applications and clean code architecture.",
    location: {
      address: "",
      city: "San Francisco",
      region: "CA",
      postalCode: "",
      countryCode: "US",
    },
    profiles: [
      { network: "GitHub", username: "johndoe", url: "https://github.com/johndoe" },
      { network: "LinkedIn", username: "johndoe", url: "https://linkedin.com/in/johndoe" }
    ]
  },
  work: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  additional: [],
  sectionOrder: [
    'work',
    'education',
    'skills',
    'projects',
    'certifications',
    'additional'
  ]
};

export const TEMPLATES: TemplateConfig[] = [
  {
    id: 'professional',
    name: 'Classic Professional',
    description: 'A clean, serif-based layout optimized for ATS and corporate roles.',
    thumbnail: 'https://picsum.photos/200/300?grayscale'
  },
  {
    id: 'tech',
    name: 'Modern Tech',
    description: 'A sleek, sans-serif layout with skill badges, perfect for developers.',
    thumbnail: 'https://picsum.photos/200/300'
  }
];

export const EXAMPLE_RESUMES: Record<string, ResumeData> = {
  "frontend": {
    ...INITIAL_RESUME_STATE,
    basics: {
      ...INITIAL_RESUME_STATE.basics,
      name: "Alex Johnson",
      label: "Senior Frontend Engineer",
      summary: "Creative and detail-oriented Frontend Engineer with 6+ years of experience building responsive, accessible, and performant web applications. Expert in the React ecosystem and modern CSS architecture. Passionate about UI/UX and web performance optimization.",
      profiles: [
        { network: "GitHub", username: "alexj", url: "https://github.com/alexj" },
        { network: "LinkedIn", username: "alexj", url: "https://linkedin.com/in/alexj" },
        { network: "Portfolio", username: "alex.dev", url: "https://alex.dev" }
      ]
    },
    skills: [
      { id: "1", name: "Core", level: "Expert", keywords: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3/SCSS"] },
      { id: "2", name: "Frameworks", level: "Expert", keywords: ["React", "Next.js", "Vue.js", "Tailwind CSS", "Redux"] },
      { id: "3", name: "Tools", level: "Intermediate", keywords: ["Webpack", "Vite", "Jest", "Cypress", "Git", "Figma"] }
    ],
    work: [
      {
        id: "w1",
        name: "TechFlow Solutions",
        position: "Senior Frontend Engineer",
        url: "",
        startDate: "2021-03",
        endDate: "Present",
        summary: "",
        highlights: [
          "Led the migration of a legacy jQuery dashboard to <b>Next.js</b>, improving page load time by 40%.",
          "Architected a reusable component library used across 5 internal products, increasing developer velocity by 25%.",
          "Mentored 3 junior developers and introduced strict code review standards and CI/CD pipelines."
        ]
      },
      {
        id: "w2",
        name: "Creative Agency",
        position: "Frontend Developer",
        url: "",
        startDate: "2018-06",
        endDate: "2021-02",
        summary: "",
        highlights: [
          "Developed pixel-perfect responsive websites for high-profile clients including Nike and Adidas.",
          "Implemented complex animations using <b>Framer Motion</b> and GSAP to enhance user engagement.",
          "Collaborated closely with designers to ensure technical feasibility of UI/UX concepts."
        ]
      }
    ]
  },
  "backend": {
    ...INITIAL_RESUME_STATE,
    basics: {
      ...INITIAL_RESUME_STATE.basics,
      name: "Sarah Smith",
      label: "Backend Engineer",
      summary: "Results-driven Backend Engineer specializing in building scalable microservices and distributed systems. Proficient in Go, Python, and cloud infrastructure (AWS). Strong background in database design and API security.",
      profiles: [
        { network: "GitHub", username: "sarahcodes", url: "https://github.com/sarahcodes" }
      ]
    },
    skills: [
      { id: "1", name: "Languages", level: "Expert", keywords: ["Go (Golang)", "Python", "Java", "SQL"] },
      { id: "2", name: "Infrastructure", level: "Expert", keywords: ["AWS (Lambda, S3, EC2)", "Docker", "Kubernetes", "Terraform"] },
      { id: "3", name: "Databases", level: "Intermediate", keywords: ["PostgreSQL", "Redis", "MongoDB", "Elasticsearch"] }
    ],
    work: [
      {
        id: "w1",
        name: "CloudStream Inc.",
        position: "Backend Developer",
        url: "",
        startDate: "2020-01",
        endDate: "Present",
        summary: "",
        highlights: [
          "Designed and implemented high-throughput RESTful APIs serving 1M+ daily active users.",
          "Optimized database queries in PostgreSQL, reducing average latency from 200ms to 50ms.",
          "Managed Kubernetes clusters and implemented auto-scaling policies to handle traffic spikes."
        ]
      },
      {
        id: "w2",
        name: "DataCorp",
        position: "Software Engineer",
        url: "",
        startDate: "2017-05",
        endDate: "2019-12",
        summary: "",
        highlights: [
          "Built data ingestion pipelines using Python and Apache Kafka processing TBs of data daily.",
          "Implemented OAuth2 authentication flows to secure internal APIs.",
          "Wrote 90%+ unit test coverage for critical payment processing modules."
        ]
      }
    ]
  }
};
