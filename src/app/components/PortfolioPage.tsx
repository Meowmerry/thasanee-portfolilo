import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PixelCity } from './PixelCity';
import { Rain } from './Rain';

// ─── Resume Data ──────────────────────────────────────────────────────────────
// ─── Role "classes" — visitor picks the lens; hero + spotlight adapt ───────────
export type RoleKey = 'swe' | 'ai' | 'pm';

const ROLES: Record<RoleKey, {
  label: string; jp: string; icon: string; color: string; eyebrow: string;
  summary: string; stats: { v: string; l: string }[]; projectTags: string[];
}> = {
  swe: {
    label: 'SOFTWARE ENGINEER', jp: 'ソフトウェア', icon: '⚔️', color: '#00ffff',
    eyebrow: 'SENIOR SOFTWARE ENGINEER',
    summary: `Senior Software Engineer with 6+ years shipping full-stack React/TypeScript features at scale. Built systems serving 600K+ users at 750 req/s, with 85% test coverage and 90% fewer deploy failures across 6 companies.`,
    stats: [{ v: '6+', l: 'YEARS' }, { v: '6', l: 'COMPANIES' }, { v: '600K+', l: 'USERS' }, { v: '85%', l: 'TEST COV' }],
    projectTags: ['WORKFLOW', 'OSS', 'AI', 'ML', 'AI SAAS'],
  },
  ai: {
    label: 'AI ENGINEER', jp: 'エーアイ', icon: '🤖', color: '#ff66cc',
    eyebrow: 'AI ENGINEER',
    summary: `AI Engineer specializing in production LLM systems — RAG pipelines, agents, and intelligent automation. Shipped Claude & OpenAI features to 1,000+ users and cut inference costs 60% with pgvector RAG, across 6 AI products.`,
    stats: [{ v: '6', l: 'AI PROJECTS' }, { v: '60%', l: 'COST CUT' }, { v: '1K+', l: 'AI USERS' }, { v: '4', l: 'LLM STACKS' }],
    projectTags: ['AI', 'ML', 'AI SAAS'],
  },
  pm: {
    label: 'PRODUCT MANAGER', jp: 'プロダクト', icon: '🎯', color: '#ffaa00',
    eyebrow: 'TECHNICAL PRODUCT MANAGER',
    summary: `Technical Product Manager who ships outcomes, not just code. Owned product for a hedge-fund analytics platform on a $1M budget, drove roadmaps that cut delivery cycles 2 days/sprint and deploy failures 90%, and translate fluently between engineering, stakeholders, and users.`,
    stats: [{ v: '$1M', l: 'BUDGET OWNED' }, { v: '90%', l: 'FEWER FAILS' }, { v: '600K+', l: 'USERS SERVED' }, { v: '5', l: 'TEAMS LED' }],
    projectTags: ['WORKFLOW', 'AI SAAS', 'OSS'],
  },
};

const ROLE_ORDER: RoleKey[] = ['swe', 'ai', 'pm'];
const STAT_COLORS = ['#ff66cc', '#00ffff', '#9966ff', '#ffaa00'];

const PROJECTS = [
  { name: 'StoryFlow English Learning', tech: 'Vite · React · Claude API · Firebase', color: '#ff66cc', icon: '📖', tag: 'AI',
    points: ['Claude API for personalized story-based instruction with adaptive difficulty', 'Firebase real-time progress tracking & auth across devices', 'Dynamic vocabulary building through contextual storytelling'] },
  { name: 'Manufacturing Workflow UI', tech: 'React · TypeScript · Zustand · React Flow', color: '#00ffff', icon: '⚙️', tag: 'WORKFLOW',
    points: ['Drag-and-drop pipeline builder via React Flow', 'Zustand for complex multi-step orchestration', 'Production-ready full-stack take-home project'] },
  { name: 'AI Interview Booking', tech: 'Next.js · Prisma · Claude API', color: '#9966ff', icon: '🤖', tag: 'AI SAAS',
    points: ['Claude API intelligent candidate matching & booking', 'Next.js + Prisma ORM, type-safe DB & SSR'] },
  { name: 'AI Sleep Story Generator', tech: 'Vite · React · OpenAI API', color: '#ffaa00', icon: '🌙', tag: 'AI',
    points: ['OpenAI GPT-4 serving 1,000+ users', 'Sub-200ms response, Vercel CI/CD'] },
  { name: 'SlaveVoyages — Open Source', tech: 'React · D3.js · Leaflet · AG Grid', color: '#44ff88', icon: '🗺️', tag: 'OSS',
    points: ['Rice University — 600,000+ users', 'Interactive maps of transatlantic history'] },
  { name: 'RAG System & Stock Chatbot', tech: 'Python · pgvector · Ollama · OpenAI', color: '#ff4488', icon: '📈', tag: 'ML',
    points: ['pgvector RAG — reduced API costs 60%', 'Real-time stock analysis with LLM APIs'] },
];

// `roles` = which class lenses this role is featured under (reordered + spotlit).
// `lens` = an optional role-specific framing line surfaced as the lead bullet for that class.
const EXPERIENCE: {
  title: string; company: string; location: string; period: string; color: string; lv: string;
  points: string[]; roles: RoleKey[]; lens?: Partial<Record<RoleKey, string>>;
}[] = [
  { title: 'UX / UI Engineer (Manufacturing systems)', company: 'Cyclone Bolt', location: 'Houston, TX', period: 'Mar 2026 – Present', color: '#ff8855', lv: '★★★★★',
    roles: ['swe', 'pm'],
    lens: { pm: 'Translated product vision into specs — Figma wireframes, personas & user flows for 3 operator roles; shipped a design system.' },
    points: ['Frontend & UX lead for ATLAS MES — Operator/Sales/Office UIs in React/TS', 'Built component library + design-system tokens, scaffolded in Storybook', 'Figma wireframes, personas & user flows for 3 operator roles', 'Sales refactor — migrated 10+ components to design-system primitives', 'i18n string extraction + WCAG accessibility baseline'] },
  { title: 'Software Engineer', company: 'Marketron', location: 'Opelika, AL', period: 'Jan–Sep 2025', color: '#ff66cc', lv: '★★★★★',
    roles: ['swe', 'pm'],
    lens: { pm: 'Drove delivery across 50+ tenants — cut integration cycle 2 days/sprint & deploy failures 90%.' },
    points: ['React/Redux/TypeScript SaaS — cut integration cycle 2 days/sprint', 'RabbitMQ pipeline — 50+ tenants monthly', '85% test coverage, 90% fewer deploy failures', 'Reusable AG Grid components'] },
  { title: 'Software Engineer', company: 'Rice University', location: 'Houston, TX', period: 'May 2023–Jul 2024', color: '#00ffff', lv: '★★★★☆',
    roles: ['swe', 'pm'],
    lens: { pm: 'Led the platform migration serving 600K+ users; +20% team productivity.' },
    points: ['SlaveVoyages Mapping — 600,000+ users', 'Vue → React/TypeScript migration +20% productivity', 'D3.js · Leaflet · Plotly · AG Grid visualizations', 'API + map rendering +25% faster'] },
  { title: 'Software Engineer', company: 'Gigamon', location: 'Santa Clara, CA', period: 'Aug–Dec 2022', color: '#9966ff', lv: '★★★☆☆',
    roles: ['swe'],
    points: ['React Hooks modernization of Threat Insights', 'Redux Toolkit: −20% bugs, −30% boilerplate', 'GraphQL/PostgreSQL: 3× throughput'] },
  { title: 'Software Engineer & Product Owner', company: 'Level11 Consulting', location: 'Remote', period: 'Dec 2020–Aug 2022', color: '#ffaa00', lv: '★★★☆☆',
    roles: ['swe', 'pm'],
    lens: { pm: 'Product Owner on a $1M budget — owned scope & delivery for hedge-fund analytics.' },
    points: ['Hedge fund analytics in React/Golang — 3 months', 'Reusable components: −30% processing time', '$1M annual budget managed'] },
  { title: 'Frontend Engineer', company: 'GridWhiz', location: 'Green Tech', period: 'Oct 2019–Nov 2020', color: '#44ff88', lv: '★★☆☆☆',
    roles: ['swe'],
    points: ['750 req/s, +40% responsiveness', '−30% server requests via React Router'] },
];

const SKILLS_DATA = {
  'AI / ML':      { c: '#ff66cc', items: ['Claude API', 'OpenAI API', 'Hugging Face', 'RAG', 'pgvector', 'Ollama', 'Prompt Eng'] },
  'Frontend':     { c: '#00ffff', items: ['React', 'TypeScript', 'Next.js', 'Vue.js', 'Redux', 'TailwindCSS', 'D3.js'] },
  'Backend':      { c: '#9966ff', items: ['Node.js', 'Python', 'Go', 'Rails', 'GraphQL', 'Prisma', 'RabbitMQ'] },
  'Cloud/DevOps': { c: '#ffaa00', items: ['AWS', 'Azure', 'Docker', 'Vercel', 'CI/CD', 'GitHub Actions'] },
  'Databases':    { c: '#44ff88', items: ['PostgreSQL', 'MongoDB', 'MySQL', 'pgvector'] },
};

// ─── Section config ───────────────────────────────────────────────────────────
export type PortfolioSection = 'home' | 'projects' | 'experience' | 'skills';

const SEC = {
  home:       { color: '#ff66cc', glow: '#ff00aa', title: 'HOME',       jp: '家',         sub: 'THASANEE.DEV' },
  projects:   { color: '#00ffff', glow: '#00dddd', title: 'PROJECTS',   jp: 'プロジェクト', sub: '6 FEATURED BUILDS' },
  experience: { color: '#9966ff', glow: '#7744ee', title: 'EXPERIENCE', jp: '経験',        sub: '6 YEARS · 6 COMPANIES' },
  skills:     { color: '#ffaa00', glow: '#ff8800', title: 'SKILLS',     jp: 'スキル',      sub: 'TECH STACK' },
};

// ─── UI primitives ────────────────────────────────────────────────────────────
function PixelPanel({ color, children, className = '' }: { color: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{
      background: 'rgba(8,4,24,0.92)',
      border: `3px solid ${color}`,
      boxShadow: `0 0 0 1px #000, 4px 4px 0 #000, 0 0 20px ${color}44`,
      imageRendering: 'pixelated',
    }}>
      {/* Pixel corner accents */}
      <div style={{ position: 'absolute', top: -1, left: -1, width: 6, height: 6, background: '#000' }} />
      <div style={{ position: 'absolute', top: -1, right: -1, width: 6, height: 6, background: '#000' }} />
      <div style={{ position: 'absolute', bottom: -1, left: -1, width: 6, height: 6, background: '#000' }} />
      <div style={{ position: 'absolute', bottom: -1, right: -1, width: 6, height: 6, background: '#000' }} />
      {children}
    </div>
  );
}

function NeonLabel({ text, color }: { text: string; color: string }) {
  return (
    <motion.span
      animate={{ opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 10,
        color,
        textShadow: `0 0 6px ${color}, 0 0 14px ${color}88`,
        letterSpacing: '0.12em',
      }}
    >{text}</motion.span>
  );
}

// ─── Class switcher (RPG "choose your class") ──────────────────────────────────
function ClassSwitcher({ role, setRole }: { role: RoleKey; setRole: (r: RoleKey) => void }) {
  return (
    <PixelPanel color={ROLES[role].color}>
      <div className="px-2 py-1.5" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: ROLES[role].color, letterSpacing: '0.1em', borderBottom: `2px solid ${ROLES[role].color}44` }}>
        選択 · CHOOSE YOUR CLASS
      </div>
      <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        {ROLE_ORDER.map(rk => {
          const r = ROLES[rk];
          const active = rk === role;
          return (
            <motion.button
              key={rk}
              onClick={() => setRole(rk)}
              whileHover={{ scale: active ? 1 : 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={{
                fontFamily: "'Press Start 2P', monospace", fontSize: 8, letterSpacing: '0.04em',
                color: active ? '#000' : r.color,
                background: active ? r.color : `${r.color}12`,
                border: `2px solid ${r.color}`,
                boxShadow: active ? `3px 3px 0 #000, 0 0 16px ${r.color}` : `3px 3px 0 #000`,
                padding: '10px 8px', cursor: 'pointer', lineHeight: 1.5,
                opacity: active ? 1 : 0.7, textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 14, display: 'block', marginBottom: 6 }}>{r.icon}</span>
              {r.label}
            </motion.button>
          );
        })}
      </div>
    </PixelPanel>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeSection({ role, setRole }: { role: RoleKey; setRole: (r: RoleKey) => void }) {
  const cfg = ROLES[role];
  const color = cfg.color;
  const [typed, setTyped] = useState('');
  const name = 'THASANEE PUTTAMADILOK';
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { setTyped(name.slice(0, i)); i++; if (i > name.length) clearInterval(t); }, 55);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col gap-4 px-4 pb-20 pt-2 max-w-3xl mx-auto w-full">
      {/* Class switcher */}
      <ClassSwitcher role={role} setRole={setRole} />

      {/* Name card */}
      <PixelPanel color={color}>
        <div className="p-5">
          <motion.div key={cfg.eyebrow} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
            style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: `${color}88`, letterSpacing: '0.4em', marginBottom: 6 }}>
            {cfg.eyebrow}
          </motion.div>
          <motion.div
            animate={{ textShadow: [`4px 4px 0px #ff00ff, -4px -4px 0px #00ffff`, `4px 4px 0px #ff00cc, -4px -4px 0px #00ccff`, `4px 4px 0px #ff00ff, -4px -4px 0px #00ffff`] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(11px, 2.2vw, 20px)', color: '#fff', letterSpacing: '0.06em', lineHeight: 1.6, marginBottom: 10 }}
          >
            {typed}<motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
              style={{ display: 'inline-block', width: '0.55em', height: '1em', background: color, marginLeft: 3, verticalAlign: 'middle' }} />
          </motion.div>
          <div className="flex flex-wrap gap-2 mt-2">
            {[{ t: '📍 Houston, TX', c: color }, { t: '✉ thasanee.dev@gmail.com', c: '#00ffff' }, { t: '📱 (972) 664-4779', c: '#9966ff' }].map(i => (
              <span key={i.t} style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: i.c, border: `1px solid ${i.c}66`, padding: '2px 8px', background: `${i.c}0f` }}>{i.t}</span>
            ))}
          </div>
        </div>
      </PixelPanel>

      {/* Summary */}
      <PixelPanel color="#44ff88">
        <div className="px-2 py-1.5" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#44ff88', letterSpacing: '0.1em', borderBottom: '2px solid #44ff8844' }}>
          &gt; cat summary.txt
        </div>
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.p key={cfg.summary} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
              style={{ fontFamily: "'VT323', monospace", fontSize: 18, color: '#cceedd', lineHeight: 1.65 }}>{cfg.summary}</motion.p>
          </AnimatePresence>
        </div>
      </PixelPanel>

      {/* Stats — adapt to selected class */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cfg.stats.map((s, i) => {
          const c = STAT_COLORS[i % STAT_COLORS.length];
          return (
            <PixelPanel key={`${role}-${s.l}`} color={c} className="text-center py-4">
              <motion.div key={s.v} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25 }}
                style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 22, color: c, display: 'block', textShadow: `0 0 12px ${c}` }}>{s.v}</motion.div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: `${c}99`, letterSpacing: '0.1em', marginTop: 4 }}>{s.l}</div>
            </PixelPanel>
          );
        })}
      </div>

      {/* Education */}
      <PixelPanel color="#ffcc44">
        <div className="px-2 py-1.5" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#ffcc44', borderBottom: '2px solid #ffcc4444' }}>
          教育 · EDUCATION
        </div>
        <div className="p-4 space-y-2">
          {[
            { t: 'BBA · Ramkhamhaeng University', s: 'Bangkok, Thailand' },
            { t: 'Software Engineering Bootcamp', s: 'Codesmith' },
            { t: 'Volunteer Mentor', s: 'General Assembly' },
            { t: 'Conference Speaker', s: '"Application Security" – Jeeny & Bractlet' },
          ].map((e, i) => (
            <div key={i} className="flex gap-2" style={{ fontFamily: "'VT323', monospace" }}>
              <span style={{ color: '#ffcc44', flexShrink: 0 }}>▸</span>
              <span style={{ fontSize: 17, color: '#ffcc44' }}>{e.t} <span style={{ color: '#666', fontSize: 14 }}>· {e.s}</span></span>
            </div>
          ))}
        </div>
      </PixelPanel>
    </div>
  );
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
function ProjectsSection({ color, role }: { color: string; role: RoleKey }) {
  const [open, setOpen] = useState<number | null>(null);
  const relevant = ROLES[role].projectTags;
  // Spotlight: matching projects float to the top, others dim
  const ordered = PROJECTS
    .map((p, i) => ({ p, i, hit: relevant.includes(p.tag) }))
    .sort((a, b) => Number(b.hit) - Number(a.hit));
  return (
    <div className="px-4 pb-20 pt-2 max-w-4xl mx-auto w-full">
      <div className="mb-3 flex items-center gap-2" style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: `${ROLES[role].color}cc` }}>
        <span>{ROLES[role].icon}</span>
        <span style={{ letterSpacing: '0.15em' }}>SPOTLIGHT · {ROLES[role].label}</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {ordered.map(({ p, i, hit }) => (
          <motion.div key={p.name} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: hit ? 1 : 0.45, y: 0 }} transition={{ delay: i * 0.04 }}>
            <PixelPanel color={p.color} className="cursor-pointer" >
              <button className="w-full text-left" onClick={() => setOpen(open === i ? null : i)}>
                <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: `2px solid ${p.color}44` }}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{p.icon}</span>
                    <NeonLabel text={p.name.toUpperCase().slice(0, 20)} color={p.color} />
                  </div>
                  <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#000', background: p.color, padding: '2px 5px' }}>{p.tag}</span>
                </div>
                <div className="px-3 py-2">
                  <div style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: '#666', marginBottom: 4 }}>{p.tech}</div>
                  <AnimatePresence>
                    {open === i && (
                      <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden space-y-1 mt-1">
                        {p.points.map((pt, j) => (
                          <li key={j} className="flex gap-2" style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: '#ccc', lineHeight: 1.4 }}>
                            <span style={{ color: p.color, flexShrink: 0 }}>▸</span>{pt}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                  {open !== i && <div style={{ fontFamily: "'VT323', monospace", fontSize: 12, color: '#444' }}>[ PRESS TO EXPAND ]</div>}
                </div>
              </button>
            </PixelPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
function ExperienceSection({ role }: { role: RoleKey }) {
  const rc = ROLES[role];
  // Relevant roles float to the top + stay bright; the rest dim. If nothing matches
  // this lens (e.g. AI work lives in Projects), show everything normally.
  const ordered = EXPERIENCE
    .map((e, i) => ({ e, i, hit: e.roles.includes(role) }))
    .sort((a, b) => Number(b.hit) - Number(a.hit));
  const anyHit = ordered.some(o => o.hit);

  return (
    <div className="px-4 pb-20 pt-2 max-w-3xl mx-auto w-full space-y-3">
      <div className="mb-1 flex items-center gap-2" style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: `${rc.color}cc` }}>
        <span>{rc.icon}</span>
        <span style={{ letterSpacing: '0.15em' }}>
          {anyHit ? `SPOTLIGHT · ${rc.label}` : `${rc.label} — see PROJECTS for AI builds`}
        </span>
      </div>
      {ordered.map(({ e, i, hit }) => {
        const dim = anyHit && !hit;
        const lensLine = e.lens?.[role];
        return (
          <motion.div key={e.company} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: dim ? 0.5 : 1, x: 0 }} transition={{ delay: i * 0.07 }}>
            <PixelPanel color={e.color}>
              <div className="px-3 py-2 flex flex-wrap items-center gap-x-3 gap-y-1" style={{ borderBottom: `2px solid ${e.color}44` }}>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#000', background: e.color, padding: '2px 6px', flexShrink: 0 }}>{e.lv}</span>
                <NeonLabel text={e.title.toUpperCase()} color={e.color} />
                <span style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: '#fff' }}>@ {e.company}</span>
                <span style={{ fontFamily: "'VT323', monospace", fontSize: 14, color: '#555', marginLeft: 'auto' }}>{e.period}</span>
              </div>
              <div className="px-3 py-2.5 space-y-1">
                {lensLine && (
                  <div className="flex gap-2 mb-1.5 pb-1.5" style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: rc.color, lineHeight: 1.4, borderBottom: `1px solid ${rc.color}22` }}>
                    <span style={{ flexShrink: 0 }}>★</span>{lensLine}
                  </div>
                )}
                {e.points.map((pt, j) => (
                  <div key={j} className="flex gap-2" style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: '#bbb', lineHeight: 1.4 }}>
                    <span style={{ color: e.color, flexShrink: 0 }}>▸</span>{pt}
                  </div>
                ))}
              </div>
            </PixelPanel>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── SKILLS ───────────────────────────────────────────────────────────────────
function SkillsSection({ color }: { color: string }) {
  const BARS = [
    { s: 'React / TypeScript', pct: 95, c: '#00ffff' },
    { s: 'AI / LLM Integration', pct: 90, c: '#ff66cc' },
    { s: 'Node.js / Python', pct: 85, c: '#9966ff' },
    { s: 'Data Visualization', pct: 82, c: '#44ff88' },
    { s: 'DevOps / CI-CD', pct: 78, c: '#ffaa00' },
  ];
  return (
    <div className="px-4 pb-20 pt-2 max-w-4xl mx-auto w-full">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-5">
        {Object.entries(SKILLS_DATA).map(([cat, { c, items }], ci) => (
          <motion.div key={cat} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.07 }}>
            <PixelPanel color={c} className="h-full">
              <div className="px-3 py-1.5" style={{ borderBottom: `2px solid ${c}44` }}>
                <NeonLabel text={cat} color={c} />
              </div>
              <div className="p-3 flex flex-wrap gap-1.5">
                {items.map(sk => (
                  <motion.span key={sk} whileHover={{ scale: 1.08 }}
                    style={{ fontFamily: "'VT323', monospace", fontSize: 15, color: c, border: `1px solid ${c}55`, padding: '1px 6px', background: `${c}10`, cursor: 'default' }}>
                    {sk}
                  </motion.span>
                ))}
              </div>
            </PixelPanel>
          </motion.div>
        ))}
      </div>

      {/* Bars */}
      <PixelPanel color={color}>
        <div className="px-3 py-1.5" style={{ borderBottom: `2px solid ${color}44` }}>
          <NeonLabel text="熟練度 · PROFICIENCY" color={color} />
        </div>
        <div className="p-4 space-y-4">
          {BARS.map((b, i) => (
            <div key={b.s}>
              <div className="flex justify-between mb-1">
                <span style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: '#aaa' }}>{b.s}</span>
                <span style={{ fontFamily: "'VT323', monospace", fontSize: 17, color: b.c }}>{b.pct}%</span>
              </div>
              <div style={{ height: 10, background: '#0d0025', border: `1px solid ${b.c}33` }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${b.pct}%` }} transition={{ delay: i * 0.1, duration: 0.9, ease: 'easeOut' }}
                  style={{ height: '100%', background: `linear-gradient(90deg, ${b.c}66, ${b.c})`, boxShadow: `0 0 8px ${b.c}88` }} />
              </div>
            </div>
          ))}
        </div>
      </PixelPanel>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
interface PortfolioPageProps {
  section: PortfolioSection;
  state: 'closed' | 'fadeIn' | 'open' | 'fadeOut';
  onExit: () => void;
}

export function PortfolioPage({ section, state, onExit }: PortfolioPageProps) {
  const cfg = SEC[section];
  const [role, setRole] = useState<RoleKey>('swe');
  if (state === 'closed') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: state === 'open' ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-50 overflow-hidden select-none"
    >
      {/* Pixel city + rain as backdrop */}
      <PixelCity />
      <Rain />

      {/* Dark overlay so content is readable */}
      <div className="absolute inset-0" style={{ background: 'rgba(4,2,18,0.72)' }} />

      {/* CRT scanlines */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 4px)' }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,0.75) 100%)' }} />

      {/* ── Header bar ── */}
      <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-2.5"
        style={{ background: 'rgba(4,2,18,0.96)', borderBottom: `3px solid ${cfg.color}`, boxShadow: `0 0 20px ${cfg.color}44` }}>

        <div className="flex items-center gap-3">
          {/* Pixel logo mark */}
          <div style={{ width: 10, height: 10, background: cfg.color, boxShadow: `0 0 8px ${cfg.color}` }} />
          <motion.span
            animate={{ textShadow: [`4px 4px 0 #ff00ff,-4px -4px 0 #00ffff`, `4px 4px 0 #ff00cc,-4px -4px 0 #00ccff`, `4px 4px 0 #ff00ff,-4px -4px 0 #00ffff`] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 'clamp(10px,1.8vw,16px)', color: '#fff', letterSpacing: '0.12em' }}
          >
            {cfg.title}
          </motion.span>
          <span style={{ fontFamily: "'VT323', monospace", fontSize: 16, color: cfg.color + 'aa', letterSpacing: '0.2em' }}>
            {cfg.jp} · {cfg.sub}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: `4px 4px 0 #000, 0 0 16px ${cfg.color}` }}
          whileTap={{ scale: 0.95 }}
          onClick={onExit}
          style={{
            fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: cfg.color,
            border: `2px solid ${cfg.color}`, background: 'rgba(4,2,18,0.9)',
            padding: '6px 14px', boxShadow: `3px 3px 0 #000, 0 0 10px ${cfg.color}55`,
            letterSpacing: '0.1em', cursor: 'pointer',
          }}
        >
          ✕ EXIT
        </motion.button>
      </div>

      {/* ── Section title ── */}
      <div className="absolute left-0 right-0 z-30 flex flex-col items-center pointer-events-none" style={{ top: 56 }}>
        <div className="flex items-center gap-3 py-2 px-6"
          style={{ background: 'rgba(4,2,18,0.7)', borderBottom: `1px solid ${cfg.color}33` }}>
          <div className="h-px flex-1 w-12" style={{ background: `linear-gradient(90deg,transparent,${cfg.color}88)` }} />
          <span style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: `${cfg.color}88`, letterSpacing: '0.3em' }}>
            TOKYO PORTFOLIO v2086
          </span>
          <div className="h-px flex-1 w-12" style={{ background: `linear-gradient(90deg,${cfg.color}88,transparent)` }} />
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="absolute inset-0 overflow-y-auto z-20 pt-[88px]" style={{ scrollbarWidth: 'none' }}>
        <AnimatePresence mode="wait">
          <motion.div key={section} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {section === 'home'       && <HomeSection role={role} setRole={setRole} />}
            {section === 'projects'   && <ProjectsSection color={cfg.color} role={role} />}
            {section === 'experience' && <ExperienceSection role={role} />}
            {section === 'skills'     && <SkillsSection color={cfg.color} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div className="absolute bottom-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-1"
        style={{ background: 'rgba(4,2,18,0.96)', borderTop: `2px solid ${cfg.color}55` }}>
        <span style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: `${cfg.color}66` }}>THASANEE PUTTAMADILOK</span>
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.1, repeat: Infinity }}
          style={{ fontFamily: "'VT323', monospace", fontSize: 13, color: '#44ff8899' }}>● ONLINE</motion.span>
      </div>
    </motion.div>
  );
}
