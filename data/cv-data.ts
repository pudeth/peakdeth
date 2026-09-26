export interface ExperienceItem {
  id: string
  company: string
  period: string
  role: string
  location: string
  bullets: string[]
  technologies?: string[]
}

export interface EducationItem {
  institution: string
  degree: string
  location?: string
  year?: string
}

export interface AwardItem {
  title: string
  organization: string
  year: string
}

export interface SkillCategory {
  category: string
  skills: string[]
}

export interface CVData {
  name: string
  roleTitle: string
  phone: string
  email: string
  location: string
  website: {
    label: string
    url: string
  }
  social?: {
    platform: string
    label: string
    url: string
  }
  photoUrl: string
  summary: string
  experiences: ExperienceItem[]
  education: EducationItem[]
  awards: AwardItem[]
  coreCompetencies: string[]
  technicalExpertise: SkillCategory[]
}

export const cvData: CVData = {
  name: 'PEAK DETH',
  roleTitle: 'FULL-STACK SOFTWARE ARCHITECT & CINEMATIC DESIGNER',
  phone: '+855 68656263',
  email: 'peakmao007@gmail.com',
  location: 'Phnom Penh, Cambodia',
  website: {
    label: 'peakdeth.vercel.app',
    url: 'https://peakdeth.vercel.app',
  },
  social: {
    platform: 'Instagram',
    label: '@peakdeth',
    url: 'https://instagram.com/peakdeth',
  },
  photoUrl: 'https://res.cloudinary.com/dpz7vpmf8/image/upload/v1790056011/ux39vvuij9rukzzlf5df.jpg',
  summary:
    'A multidisciplinary Full-Stack Developer and Visual Artist bridging high-performance software engineering with cinematic photography and design. Dedicated to architecting robust enterprise systems, bespoke POS solutions, and modern mobile & web apps, while capturing evocative visual narratives and crafting refined aesthetic designs.',
  experiences: [
    {
      id: 'peak-deth-solutions',
      company: 'Peak Deth Solutions',
      period: '2022 — Present',
      role: 'Senior Systems Architect & Full-Stack Engineer',
      location: 'Phnom Penh, Cambodia',
      bullets: [
        'Design, architect, and deploy bespoke POS systems, ERP/CRM management software, and enterprise web applications.',
        'Engineer cross-platform mobile applications for iOS and Android tailored to retail and business workflows.',
        'Lead architectural decisions, real-time database synchronizations, and secure cloud infrastructure pipelines.',
      ],
      technologies: [
        'Next.js',
        'React Native',
        'TypeScript',
        'PostgreSQL',
        'Supabase',
        'Docker',
        'Tailwind CSS',
      ],
    },
    {
      id: 'enterprise-tech-group',
      company: 'Enterprise Technology Group',
      period: '2020 — 2022',
      role: 'Digital Systems Developer',
      location: 'Phnom Penh, Cambodia',
      bullets: [
        'Engineered automated business workflows, real-time inventory management databases, and customer-facing apps.',
        'Built secure REST APIs, payment integrations, and authentication protocols for corporate clients.',
        'Collaborated across cross-functional teams to ensure high uptime, reliability, and modern UI/UX design.',
      ],
      technologies: [
        'JavaScript',
        'Node.js',
        'REST APIs',
        'SQL Databases',
        'Cloud Infrastructure',
        'CI/CD Pipelines',
      ],
    },
  ],
  education: [
    {
      institution: 'Computer Science & Software Architecture',
      degree: "Bachelor's Degree in Computer Science",
      location: 'Phnom Penh, Cambodia',
    },
    {
      institution: 'Advanced Enterprise & Mobile Engineering',
      degree: 'Specialized Full-Stack & Cloud Architecture Certifications',
      location: 'Cambodia',
    },
  ],
  awards: [
    {
      title: 'Excellence in Enterprise System Architecture',
      organization: 'Tech Innovations Summit',
      year: '2025',
    },
    {
      title: 'Outstanding Digital Solution Deployment',
      organization: 'Cambodia Business Software Awards',
      year: '2024',
    },
  ],
  coreCompetencies: [
    'Full-Stack System Architecture',
    'POS & Billing Systems',
    'Enterprise Management (ERP/CRM)',
    'Mobile App Development (iOS & Android)',
    'Real-Time Databases & Cloud APIs',
    'UI/UX Interaction & Visual Design',
    'Automated CI/CD & Cloud Orchestration',
  ],
  technicalExpertise: [
    {
      category: 'Web & Mobile Engineering',
      skills: [
        'Next.js',
        'React',
        'React Native',
        'TypeScript',
        'Node.js',
        'Tailwind CSS',
        'RESTful APIs',
      ],
    },
    {
      category: 'Enterprise & Databases',
      skills: [
        'POS Solutions',
        'ERP/CRM Platforms',
        'PostgreSQL',
        'Supabase',
        'Real-Time Sync',
        'SQL',
      ],
    },
    {
      category: 'Cloud & Infrastructure',
      skills: [
        'Docker',
        'Vercel Cloud',
        'CI/CD Pipelines',
        'Git & GitHub',
        'Microservices',
      ],
    },
    {
      category: 'Design & Visual Production',
      skills: [
        'UI/UX Design',
        'Cinematic Photography',
        'Video Production',
        '4K HDR Color Calibration',
      ],
    },
  ],
}
