export interface SitemapSection {
  id: string
  anchor: string
  title: string
  description: string
  keywords: string[]
}

export interface SitemapEntry {
  route: string
  title: string
  icon: string
  sections: SitemapSection[]
}

export interface Project {
  id: string | number
  title: string
  category: string
  icon: string
  desc: string
  tags: string[]
  link: string
  featured: boolean
}

export interface Achievement {
  label: string
  icon: string
  color: string
}

export interface Experience {
  date: string
  degree: string
  institution: string
  icon: string
  desc: string
  achievements: Achievement[]
  progress: number
  yearRange: string
  color: string
}

export interface SkillItem {
  title: string
  percent: number
}

export interface SkillCategory {
  id: string
  label: string
  icon: string
  description: string
  skills: SkillItem[]
}

export interface Announcement {
  id: string
  date: string
  text: string
  link?: string
}
