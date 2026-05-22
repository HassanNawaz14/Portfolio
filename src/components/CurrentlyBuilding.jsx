import { motion } from 'framer-motion';

const CONTENT = {
  sectionLabel: "Current Focus",
  heading: ["Currently ", "Building"],   // second item goes in cyan span
  subtitle: "The project consuming my nights, weekends, and most of my Kaggle GPU quota",
  badge: "Active Development — Phase 4 of 5",

  projectName: "NLP2Shell",
  tagline: ["Speak naturally.", "Execute instantly."],
  description: "A local desktop tool that converts natural language — voice or text — into shell commands using a fine-tuned LLM. No cloud. No subscription. No Stack Overflow.",

  terminal1: [
    { type: "prompt", text: "$ nlp2shell --text" },
    { type: "dim",    text: "─────────────────────────────" },
    { type: "input",  text: "▸ move all PDFs to Documents" },
    { type: "dim",    text: "Predicted command" },
    { type: "output", text: "mv ~/Downloads/*.pdf ~/Documents/" },
    { type: "dim",    text: "Run this? [y/n]: y" },
    { type: "output", text: "✓ Done." },
  ],

  terminal2: [
    { type: "input",  text: "▸ delete everything" },
    { type: "warn",   text: "⚠ BLOCKED — matches: rm -rf" },
    { type: "dim",    text: "Hard-blocked. Never executed." },
  ],

  flowTitle: "Voice → Model → Terminal",
  flowSteps: [
    { label: "Voice or text input",       desc: "Whisper tiny model transcribes speech on-device, no cloud STT" },
    { label: "Fine-tuned Qwen2.5-0.5B",  desc: "LoRA adapter trained on 26k NL→Bash pairs predicts the command" },
    { label: "Safety layer",              desc: "Hard blocklist checks rm -rf, fork bombs, system paths before anything else" },
    { label: "Confirm & execute",         desc: "Mandatory y/n confirmation, logged to ~/.nlp2shell_history.log" },
    { label: "--safe flag",               desc: "Dry-run mode simulates commands without touching your filesystem" },
  ],

  techTags: {
    cyan: ["Qwen2.5-0.5B", "LoRA / PEFT", "Whisper", "TRL", "BitsAndBytes", "Rich"],
    gray: ["Python 3.10+", "Kaggle T4"],
  },

  phases: [
    { label: "Data preparation",    status: "done"   },
    { label: "Model fine-tuning",   status: "done"   },
    { label: "Inference pipeline",  status: "done"   },
    { label: "CLI interface",       status: "active", suffix: " ← now" },
    { label: "Evaluation + Many More", status: "todo"   },
  ],

  modelStats: [
    { label: "Base model",       value: "0.5B params" },
    { label: "Training pairs",   value: "26,000"      },
    { label: "Params trained",   value: "~0.66%"      },
    { label: "Quantization",     value: "4-bit NF4"   },
    { label: "Inference",        value: "CPU only"    },
  ],

  buttons: [
    { label: "View on GitHub",    href: "https://github.com/hassannawaz1423/nlp2shell", primary: true  },
    { label: "Read the Write-up", href: "#",                                            primary: false },
  ],
};

const CurrentlyBuilding = () => {
  return (
    <section id="currently-building" className="currently-building-section">
      <motion.div 
        className="cb-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="cb-header">
          <span className="cb-label">{CONTENT.sectionLabel}</span>
          <h2 className="cb-title">{CONTENT.heading[0]}<span>{CONTENT.heading[1]}</span></h2>
          <p className="cb-subtitle">{CONTENT.subtitle}</p>
          <div className="cb-status-badge">
            <div className="cb-status-dot"></div>
            {CONTENT.badge}
          </div>
        </div>

        <div className="cb-main-grid">
          {/* Left Card */}
          <div className="cb-card">
            <div className="cb-card-label">
              <div className="cb-card-dot"></div>
              {CONTENT.projectName}
            </div>
            <h3 className="cb-card-title">
              {CONTENT.tagline[0]}<br />{CONTENT.tagline[1]}
            </h3>
            <p className="cb-card-desc">{CONTENT.description}</p>
            
            <div className="cb-terminal">
              <div className="cb-terminal-header">
                <div className="cb-dot red"></div>
                <div className="cb-dot yellow"></div>
                <div className="cb-dot green"></div>
              </div>
              {CONTENT.terminal1.map((line, i) => (
                <div key={i} className="cb-terminal-line">
                  {line.type === 'prompt' && <span className="cb-terminal-prompt">{line.text}</span>}
                  {line.type === 'dim' && <span className="cb-terminal-dim">{line.text}</span>}
                  {line.type === 'input' && <span className="cb-terminal-input">{line.text}</span>}
                  {line.type === 'output' && <span className="cb-terminal-output">{line.text}</span>}
                </div>
              ))}
            </div>

            <div className="cb-terminal">
              {CONTENT.terminal2.map((line, i) => (
                <div key={i} className="cb-terminal-line">
                  {line.type === 'input' && <span className="cb-terminal-input">{line.text}</span>}
                  {line.type === 'warn' && <span className="cb-terminal-warn">{line.text}</span>}
                  {line.type === 'dim' && <span className="cb-terminal-dim">{line.text}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Right Card */}
          <div className="cb-card">
            <h3 className="cb-flow-title">{CONTENT.flowTitle}</h3>
            <div className="cb-flow-steps">
              {CONTENT.flowSteps.map((step, i) => (
                <div key={i} className="cb-flow-step">
                  <div className="cb-step-num">{i + 1}</div>
                  <div className="cb-step-content">
                    <b>{step.label}</b>
                    <span>{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cb-bottom-grid">
          {/* Tech Stack */}
          <div className="cb-small-card">
            <h4 className="cb-small-card-title">Tech Stack</h4>
            <div className="cb-tags">
              {CONTENT.techTags.cyan.map((tag, i) => (
                <span key={i} className="cb-tag cyan">{tag}</span>
              ))}
              {CONTENT.techTags.gray.map((tag, i) => (
                <span key={i} className="cb-tag gray">{tag}</span>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="cb-small-card">
            <h4 className="cb-small-card-title">Progress</h4>
            <div className="cb-phase-list">
              {CONTENT.phases.map((phase, i) => (
                <div key={i} className={`cb-phase-item ${phase.status === 'active' ? 'active' : ''}`}>
                  <div className={`cb-phase-dot ${phase.status}`}></div>
                  {phase.label}{phase.suffix}
                </div>
              ))}
            </div>
          </div>

          {/* Model Stats */}
          <div className="cb-small-card">
            <h4 className="cb-small-card-title">Model Stats</h4>
            {CONTENT.modelStats.map((stat, i) => (
              <div key={i} className="cb-stat-row">
                <span className="cb-stat-label">{stat.label}</span>
                <span className="cb-stat-value">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cb-footer">
          {CONTENT.buttons.map((btn, i) => (
            <a 
              key={i} 
              href={btn.href} 
              target={btn.href.startsWith('http') ? "_blank" : "_self"}
              rel="noreferrer"
              className={`cb-btn ${btn.primary ? 'cb-btn-primary' : 'cb-btn-secondary'}`}
            >
              {btn.label}
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default CurrentlyBuilding;