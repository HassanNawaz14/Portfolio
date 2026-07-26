import { useMemo, useState } from 'react'
import { courses } from '../content/courses'

const ISSUER_STYLES = {
  harvard: { glyph: 'H', color: '#B3453A' },
  mit: { glyph: 'M', color: '#A31F34' },
  oxford: { glyph: 'O', color: '#002147' },
  stanford: { glyph: 'S', color: '#8C1515' },
  google: { glyph: 'G', color: '#5B8FD9' },
  kaggle: { glyph: 'K', color: '#4FA6A0' },
  anthropic: { glyph: 'A', color: '#D97757' },
  'uc-berkeley': { glyph: 'U', color: '#003262' },
  freecodecamp: { glyph: 'F', color: '#0A0A23' },
  default: { glyph: '•', color: '#8A8171' },
}

function IssuerGlyph({ tag }) {
  const s = ISSUER_STYLES[tag] || ISSUER_STYLES.default
  return (
    <span className="cl-glyph" style={{ '--glyph-color': s.color }} aria-hidden="true">
      {s.glyph}
    </span>
  )
}

const totalCourses = courses.reduce((sum, g) => sum + g.courses.length, 0)

const Courses = () => {
  const [filter, setFilter] = useState('all')

  const issuers = useMemo(() => {
    const seen = new Map()
    courses.forEach((g) => {
      if (!seen.has(g.tag)) seen.set(g.tag, g.issuer)
    })
    return Array.from(seen.entries())
  }, [])

  const rows = useMemo(() => {
    if (filter === 'all') {
      return courses.map((g) => ({ type: 'group', ...g }))
    }
    const group = courses.find((g) => g.tag === filter)
    if (!group) return []
    return group.courses.map((c, ci) => ({
      type: 'individual',
      id: `${group.id}-${ci}`,
      tag: group.tag,
      issuer: group.issuer,
      date: group.date,
      color: group.color,
      courseTitle: c.title,
      category: c.category,
    }))
  }, [filter])

  return (
    <section id="courses" className="cl-section" aria-label="Courses">
      <div className="cl-window">
        <div className="cl-titlebar">
          <div className="cl-dots">
            <span className="cl-dot" style={{ '--d': '#B3453A' }} />
            <span className="cl-dot" style={{ '--d': '#E0983D' }} />
            <span className="cl-dot" style={{ '--d': '#7C9473' }} />
          </div>
          <span className="cl-filename">courses.log</span>
          <span className="cl-count">{totalCourses} total</span>
        </div>

        <div className="cl-header">
          <h2 className="cl-heading">
            Course Log
            <span className="cl-cursor" aria-hidden="true" />
          </h2>
          <p className="cl-sub">$ extracurricular courses — organised by source</p>

          <div className="cl-filters" role="tablist" aria-label="Filter by source">
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              className={`cl-chip ${filter === 'all' ? 'is-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              all
            </button>
            {issuers.map(([tag, issuer]) => (
              <button
                key={tag}
                type="button"
                role="tab"
                aria-selected={filter === tag}
                className={`cl-chip ${filter === tag ? 'is-active' : ''}`}
                onClick={() => setFilter(tag)}
              >
                {issuer.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <ul className="cl-log" role="list">
          {rows.map((entry, i) =>
            entry.type === 'group' ? (
              <li key={entry.id} className="cl-row-wrap">
                <div className="cl-row" style={{ '--delay': `${i * 40}ms` }}>
                  <span className="cl-idx">{String(i + 1).padStart(2, '0')}</span>
                  <IssuerGlyph tag={entry.tag} />
                  <span className="cl-titlecol">
                    <span className="cl-title">
                      {entry.issuer}
                      <span className="cl-row-cursor" aria-hidden="true" />
                    </span>
                    {entry.courses.length === 1 ? (
                      <span className="cl-issuer">{entry.courses[0].title}</span>
                    ) : (
                      <span className="cl-courselist">
                        {entry.courses.map((c, ci) => (
                          <span key={ci} className="cl-course-item">{c.title}</span>
                        ))}
                      </span>
                    )}
                  </span>
                  <span className="cl-category">{entry.category}</span>
                  <span className="cl-date">{entry.date}</span>
                  <span className="cl-verify" aria-hidden="true">verified</span>
                </div>
              </li>
            ) : (
              <li key={entry.id} className="cl-row-wrap">
                <div className="cl-row" style={{ '--delay': `${i * 40}ms` }}>
                  <span className="cl-idx">{String(i + 1).padStart(2, '0')}</span>
                  <IssuerGlyph tag={entry.tag} />
                  <span className="cl-titlecol">
                    <span className="cl-title">
                      {entry.courseTitle}
                      <span className="cl-row-cursor" aria-hidden="true" />
                    </span>
                    <span className="cl-issuer">{entry.issuer}</span>
                  </span>
                  <span className="cl-category">{entry.category}</span>
                  <span className="cl-date">{entry.date}</span>
                  <span className="cl-verify" aria-hidden="true">verified</span>
                </div>
              </li>
            )
          )}
        </ul>

        {rows.length === 0 && (
          <p className="cl-empty">no entries match this filter yet.</p>
        )}
      </div>

      <style>{`
        .cl-section {
          --bg: #14110d;
          --surface: #1a1611;
          --paper: #f2ebda;
          --text: #e8e2d3;
          --muted: #8a8171;
          --amber: #e0983d;
          --line: rgba(232, 226, 211, 0.1);
          --mono: "JetBrains Mono", "Roboto Mono", ui-monospace, Menlo, Consolas, monospace;
          --sans: "Inter", "Public Sans", -apple-system, BlinkMacSystemFont, sans-serif;

          width: 100%;
          padding: 4rem 0;
          display: flex;
          justify-content: center;
        }

        .cl-window {
          width: 100%;
          max-width: 880px;
          background: var(--surface);
          border: 1px solid var(--line);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 30px 60px -30px rgba(0, 0, 0, 0.6);
        }

        .cl-titlebar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 1rem;
          border-bottom: 1px solid var(--line);
          background: rgba(0, 0, 0, 0.15);
        }

        .cl-dots {
          display: flex;
          gap: 6px;
        }

        .cl-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: var(--d);
          opacity: 0.55;
        }

        .cl-filename {
          font-family: var(--mono);
          font-size: 0.72rem;
          color: var(--muted);
          letter-spacing: 0.02em;
        }

        .cl-count {
          margin-left: auto;
          font-family: var(--mono);
          font-size: 0.68rem;
          color: var(--muted);
        }

        .cl-header {
          padding: 2rem 1.5rem 1.25rem;
        }

        .cl-heading {
          font-family: var(--sans);
          font-weight: 600;
          font-size: clamp(1.6rem, 3vw, 2.1rem);
          color: var(--paper);
          margin: 0;
          letter-spacing: -0.01em;
        }

        .cl-cursor {
          display: inline-block;
          width: 0.55ch;
          height: 1em;
          background: var(--amber);
          margin-left: 0.4rem;
          vertical-align: -0.15em;
          animation: cl-blink 1.1s step-end infinite;
        }

        .cl-sub {
          font-family: var(--mono);
          font-size: 0.78rem;
          color: var(--muted);
          margin: 0.5rem 0 1.25rem;
        }

        .cl-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .cl-chip {
          font-family: var(--mono);
          font-size: 0.72rem;
          color: var(--muted);
          background: transparent;
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 0.35rem 0.85rem;
          cursor: pointer;
          transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
        }

        .cl-chip:hover {
          color: var(--text);
          border-color: rgba(232, 226, 211, 0.25);
        }

        .cl-chip.is-active {
          color: var(--bg);
          background: var(--amber);
          border-color: var(--amber);
        }

        .cl-log {
          list-style: none;
          margin: 0;
          padding: 0 0.5rem 0.5rem;
        }

        .cl-row-wrap {
          border-top: 1px solid var(--line);
        }

        .cl-row {
          display: grid;
          grid-template-columns: 2rem 1.75rem 1fr auto auto auto;
          align-items: start;
          gap: 1rem;
          padding: 0.9rem 0.75rem;
          text-decoration: none;
          color: inherit;
          border-radius: 6px;
          animation: cl-fade-in 0.35s ease both;
          animation-delay: var(--delay);
        }

        .cl-row:hover {
          background: rgba(232, 226, 211, 0.04);
        }

        .cl-idx {
          font-family: var(--mono);
          font-size: 0.72rem;
          color: var(--muted);
          padding-top: 0.15rem;
        }

        .cl-glyph {
          --glyph-color: #8a8171;
          width: 1.6rem;
          height: 1.6rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--mono);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--glyph-color);
          background: color-mix(in srgb, var(--glyph-color) 16%, transparent);
          border: 1px solid color-mix(in srgb, var(--glyph-color) 40%, transparent);
          border-radius: 5px;
          flex-shrink: 0;
        }

        .cl-titlecol {
          display: flex;
          flex-direction: column;
          min-width: 0;
          gap: 0.2rem;
        }

        .cl-title {
          font-family: var(--sans);
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cl-row-cursor {
          display: inline-block;
          width: 0.5ch;
          height: 0.9em;
          background: var(--amber);
          margin-left: 0.3rem;
          vertical-align: -0.1em;
          opacity: 0;
        }

        .cl-row:hover .cl-row-cursor {
          opacity: 1;
          animation: cl-blink 1s step-end infinite;
        }

        .cl-issuer {
          font-family: var(--mono);
          font-size: 0.7rem;
          color: var(--muted);
        }

        .cl-courselist {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .cl-course-item {
          font-family: var(--mono);
          font-size: 0.7rem;
          color: var(--muted);
          line-height: 1.4;
        }

        .cl-course-item::before {
          content: "└ ";
          opacity: 0.4;
        }

        .cl-category {
          font-family: var(--mono);
          font-size: 0.68rem;
          color: var(--muted);
          background: rgba(232, 226, 211, 0.06);
          padding: 0.2rem 0.55rem;
          border-radius: 4px;
          white-space: nowrap;
          display: none;
          margin-top: 0.15rem;
        }

        .cl-date {
          font-family: var(--mono);
          font-size: 0.72rem;
          color: var(--muted);
          white-space: nowrap;
          padding-top: 0.15rem;
        }

        .cl-verify {
          font-family: var(--mono);
          font-size: 0.68rem;
          color: var(--muted);
          opacity: 0;
          transition: opacity 0.15s ease;
          white-space: nowrap;
          padding-top: 0.15rem;
        }

        .cl-row:hover .cl-verify {
          opacity: 1;
        }

        .cl-empty {
          font-family: var(--mono);
          font-size: 0.8rem;
          color: var(--muted);
          padding: 1.5rem;
        }

        @keyframes cl-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        @keyframes cl-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (min-width: 640px) {
          .cl-category {
            display: inline-block;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .cl-row, .cl-cursor, .cl-row-cursor {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}

export default Courses
