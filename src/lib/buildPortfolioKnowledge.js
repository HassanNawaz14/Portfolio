import { sitemap } from '../content/sitemap.js'
import { projects } from '../content/projects.js'
import { education } from '../content/education.js'
import { experience } from '../content/experience.js'
import { skillCategories } from '../content/skills.js'
import { announcements } from '../content/announcements.js'

export function buildPortfolioKnowledge() {
  const lines = []

  lines.push('# Portfolio Knowledge Base')
  lines.push('')

  for (const page of sitemap) {
    lines.push(`## ${page.title} (${page.route})`)
    for (const section of page.sections) {
      const anchors = section.anchor ? ` (anchor: ${section.anchor})` : ''
      lines.push(`- **${section.title}**${anchors} — ${section.description}`)
      if (section.keywords?.length) {
        lines.push(`  Keywords: ${section.keywords.join(', ')}`)
      }
    }
    lines.push('')
  }

  lines.push('## Projects')
  const featured = projects.filter((p) => p.featured)
  const regular = projects.filter((p) => !p.featured)
  if (featured.length) {
    lines.push('### Featured')
    for (const p of featured) {
      lines.push(`- **${p.title}** (${p.category}) — ${p.desc}`)
      lines.push(`  Tags: ${p.tags.join(', ')} | Link: ${p.link}`)
    }
  }
  if (regular.length) {
    lines.push('### Other Projects')
    for (const p of regular) {
      lines.push(`- **${p.title}** (${p.category}) — ${p.desc}`)
    }
  }
  lines.push('')

  lines.push('## Experience')
  for (const e of experience) {
    lines.push(`- **${e.role}** @ ${e.company} (${e.duration})`)
    lines.push(`  ${e.description}`)
    if (e.technologies?.length) {
      lines.push(`  Tech: ${e.technologies.join(', ')}`)
    }
    if (e.achievements?.length) {
      lines.push(`  Achievements: ${e.achievements.map((a) => a.label).join(', ')}`)
    }
  }
  lines.push('')

  lines.push('## Education')
  for (const e of education) {
    lines.push(`- **${e.degree}** @ ${e.institution} (${e.date})`)
    lines.push(`  ${e.desc}`)
    if (e.achievements?.length) {
      lines.push(`  Achievements: ${e.achievements.map((a) => a.label).join(', ')}`)
    }
  }
  lines.push('')

  lines.push('## Skills')
  for (const cat of skillCategories) {
    const skillList = cat.skills.map((s) => `${s.title} (${s.percent}%)`).join(', ')
    lines.push(`- **${cat.label}**: ${skillList}`)
  }
  lines.push('')

  lines.push('## Announcements')
  for (const a of announcements) {
    lines.push(`- [${a.date}] ${a.text}${a.link ? ` — ${a.link}` : ''}`)
  }

  return lines.join('\n')
}
