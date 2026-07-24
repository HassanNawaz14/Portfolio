/** @import { SkillCategory } from './types' */

/** @type {SkillCategory[]} */
export const skillCategories = [
  {
    id: 'programming',
    label: 'Programming',
    icon: 'fa-code',
    description: 'Foundational languages and algorithm-driven problem solving.',
    skills: [
      { title: 'Python', percent: 90 },
      { title: 'C++', percent: 95 },
      { title: 'JavaScript', percent: 80 },
      { title: 'C#', percent: 75 },
    ],
  },
  {
    id: 'web-dev',
    label: 'Web Development',
    icon: 'fa-laptop-code',
    description: 'Modern front-end and full-stack experience with React, Node, and responsive UI.',
    skills: [
      { title: 'React', percent: 85 },
      { title: 'Node.js', percent: 80 },
      { title: 'HTML/CSS', percent: 95 },
      { title: 'MERN Stack', percent: 80 },
    ],
  },
  {
    id: 'data-science',
    label: 'Data Science',
    icon: 'fa-chart-bar',
    description: 'Analytics, machine learning, and data visualization for real-world insights.',
    skills: [
      { title: 'Machine Learning', percent: 85 },
      { title: 'Pandas & NumPy', percent: 90 },
      { title: 'TensorFlow', percent: 75 },
      { title: 'Data Visualization', percent: 80 },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Others',
    icon: 'fa-tools',
    description: 'Build, deploy, and collaborate with professional tooling and game development.',
    skills: [
      { title: 'Git & GitHub', percent: 90 },
      { title: 'Unity', percent: 70 },
      { title: 'MS Office', percent: 95 },
      { title: 'Game Development', percent: 85 },
    ],
  },
]
