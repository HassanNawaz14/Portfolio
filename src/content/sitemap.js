/** @import { SitemapEntry } from './types' */

/** @type {SitemapEntry[]} */
export const sitemap = [
  {
    route: '/',
    title: 'Home',
    icon: 'fa-house',
    sections: [
      { id: 'home', anchor: '#home', title: 'Hero', description: 'Introduction and role overview', keywords: ['hassan nawaz', 'data scientist', 'developer', 'portfolio'] },
      { id: 'about', anchor: '#about', title: 'About', description: 'Background, passion for AI, and professional philosophy', keywords: ['about', 'background', 'ai engineering', 'data science'] },
      { id: 'skills', anchor: '#skills', title: 'Skills', description: 'Technical skills across programming, web dev, data science, and tools', keywords: ['skills', 'programming', 'python', 'react', 'machine learning'] },
      { id: 'experience', anchor: '#experience', title: 'Experience', description: 'Academic journey and educational milestones', keywords: ['education', 'fast nuces', 'data science', 'experience'] },
      { id: 'contact', anchor: '#contact', title: 'Contact', description: 'Get in touch with Hassan', keywords: ['contact', 'email', 'linkedin', 'github'] },
    ],
  },
  {
    route: '/quicksite',
    title: 'QuickSite',
    icon: 'fa-rocket',
    sections: [
      { id: 'startup', anchor: '#startup', title: 'QuickSite Startup', description: 'Rapid site deployment startup concept', keywords: ['quicksite', 'startup', 'rapid deployment', 'web'] },
    ],
  },
  {
    route: '/building',
    title: 'Lab Access',
    icon: 'fa-hammer',
    sections: [
      { id: 'building', anchor: '#building', title: 'Currently Building', description: 'Experiments and projects in development', keywords: ['building', 'lab', 'research', 'experiments'] },
    ],
  },
  {
    route: '/projects',
    title: 'Archives',
    icon: 'fa-layer-group',
    sections: [
      { id: 'featured-projects', anchor: '#featured-projects', title: 'Featured Work', description: 'Most impactful and innovative projects', keywords: ['featured', 'projects', 'stellar dna', 'cads-bridge', 'travel buddy'] },
      { id: 'projects', anchor: '#projects', title: 'All Projects', description: 'Complete collection of projects and creations', keywords: ['projects', 'portfolio', 'development', 'case studies'] },
    ],
  },
  {
    route: '/profiles',
    title: 'Network',
    icon: 'fa-globe',
    sections: [
      { id: 'profiles', anchor: '#profiles', title: 'Digital Profiles', description: 'Connect with Hassan across platforms', keywords: ['profiles', 'linkedin', 'github', 'social', 'connect'] },
    ],
  },
]
