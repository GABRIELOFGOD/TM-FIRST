import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

// ─── Hero Background Canvas Animation ────────────────────────────────────────
function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    type Streak = {
      x: number; y: number;
      vx: number; vy: number;
      len: number; alpha: number;
      color: string; width: number;
      life: number; maxLife: number;
    };

    const COLORS = [
      'rgba(180,180,220,',
      'rgba(100,120,255,',
      'rgba(200,180,255,',
      'rgba(120,200,255,',
      'rgba(255,200,180,',
      'rgba(255,255,255,',
    ];

    const streaks: Streak[] = [];

    function makeStreak(): Streak {
      const cx = W / 2;
      const cy = H * 0.45;
      // radiate outward from center with some spread
      const angle = (Math.random() * Math.PI * 2);
      const speed = 4 + Math.random() * 10;
      const maxLife = 40 + Math.random() * 80;
      return {
        x: cx + (Math.random() - 0.5) * W * 0.3,
        y: cy + (Math.random() - 0.5) * H * 0.2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 60 + Math.random() * 180,
        alpha: 0.3 + Math.random() * 0.7,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        width: 0.5 + Math.random() * 1.5,
        life: 0,
        maxLife,
      };
    }

    for (let i = 0; i < 180; i++) {
      const s = makeStreak();
      s.life = Math.random() * s.maxLife; // stagger starts
      streaks.push(s);
    }

    function draw() {
      ctx!.fillStyle = 'rgba(11,11,11,0.18)';
      ctx!.fillRect(0, 0, W, H);

      for (const s of streaks) {
        s.life++;
        if (s.life > s.maxLife) {
          Object.assign(s, makeStreak());
          s.life = 0;
          continue;
        }
        const progress = s.life / s.maxLife;
        const fade = progress < 0.2 ? progress / 0.2 : progress > 0.7 ? (1 - progress) / 0.3 : 1;
        const alpha = s.alpha * fade;

        ctx!.beginPath();
        const tailX = s.x - s.vx * (s.len / Math.hypot(s.vx, s.vy));
        const tailY = s.y - s.vy * (s.len / Math.hypot(s.vx, s.vy));

        const grad = ctx!.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, s.color + '0)');
        grad.addColorStop(1, s.color + alpha + ')');
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = s.width;
        ctx!.moveTo(tailX, tailY);
        ctx!.lineTo(s.x, s.y);
        ctx!.stroke();

        s.x += s.vx * 0.6;
        s.y += s.vy * 0.6;
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="_backgroundAnimation_15jea_2 hero-bg"
    >
      <div
        className="_animationContainer_15jea_14 _fadeIn_15jea_37"
        style={{ width: '100%', height: '100%' }}
      >
        <canvas
          ref={canvasRef}
          width={1800}
          height={900}
          style={{
            minWidth: '1800px',
            height: 'auto',
            position: 'relative',
            left: '50%',
            transform: 'translate(-50%)',
            WebkitMask: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            mask: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        />
      </div>
    </div>
  );
}

// ─── Font-Swap Letter Component ────────────────────────────────────────────────
// Periodically swaps between normal font and pixel font with RGB glitch effect
function GlitchLetter({ char, className = '' }: { char: string; className?: string }) {
  const [glitching, setGlitching] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scheduleNext = useCallback(() => {
    const delay = 2000 + Math.random() * 4000;
    timeoutRef.current = setTimeout(() => {
      setGlitching(true);
      setTimeout(() => {
        setGlitching(false);
        scheduleNext();
      }, 300 + Math.random() * 200);
    }, delay);
  }, []);

  useEffect(() => {
    // Stagger initial glitch so letters don't sync
    const initDelay = Math.random() * 2000;
    timeoutRef.current = setTimeout(() => scheduleNext(), initDelay);
    return () => clearTimeout(timeoutRef.current);
  }, [scheduleNext]);

  if (glitching) {
    return (
      <span
        data-variant="highlight"
        className={className}
        style={{ display: 'inline-block' }}
      >
        {char}
      </span>
    );
  }

  return <span className={className}>{char}</span>;
}

// ─── Hero Heading with font-swap animation ─────────────────────────────────────
// Per the brief: "U" (index 4 in Superintelligence), second-to-last "E" (index 13),
// and "O" in Cloud
function HeroTitle() {
  // "Superintelligence" — positions of U(4) and second-to-last E(13)
  // S-u-p-e-r-i-n-t-e-l-l-i-g-e-n-c-e = index 0-16
  // U = index 1, second-to-last E = index 15 (e at 15, final e is 16)
  // "Cloud" — O = index 1
  const superWord = 'Superintelligence';
  // U is index 1, second-to-last E is index 15
  const cloudWord = 'Cloud';
  // O is index 1

  return (
    <h1 className="h1-large _heroTitle_m4xpb_78">
      <span className="sr-only">The Superintelligence Cloud</span>
      <span aria-hidden="true">
        {'The '}
        <span className="no-wrap">
          {superWord.split('').map((ch, i) => {
            if (i === 1 || i === 15) {
              return <GlitchLetter key={i} char={ch} />;
            }
            return <span key={i}>{ch}</span>;
          })}
        </span>
        <br />
        {cloudWord.split('').map((ch, i) => {
          if (i === 1) {
            return <GlitchLetter key={i} char={ch} />;
          }
          return <span key={i}>{ch}</span>;
        })}
      </span>
    </h1>
  );
}

// ─── Isometric Datacenter SVG ──────────────────────────────────────────────────
function IsometricIllustration({ activeIndex }: { activeIndex: number }) {
  const layers = [
    'Purpose-built datacenters',
    'AI infrastructure',
    'Managed services',
    'Co-engineering',
  ];
  const rightLabels = ['AI DEVELOPERS', 'ENTERPRISE', 'SUPERINTELLIGENCE'];

  // Isometric params
  const W = 420;
  const H = 500;
  const layerH = 52;
  const layerGap = 6;
  const totalLayers = 4;

  // Isometric box dimensions
  const faceW = 200;
  const faceH = 116;
  // Starting top Y
  const startY = 60;
  // X center
  const cx = W * 0.48;

  // Each layer stack (bottom to top = index 3 down to 0)
  // Build from top down: layer 0 is at top
  const topFaceColor = '#1a1a1c';
  const edgeColorLeft = '#2a2a2c';
  const edgeColorRight = '#222224';
  const highlightColors = ['#00e6d9', '#6236f4', '#e7e6d9', '#6236f4'];

  const getLayerY = (i: number) => startY + i * (layerH + layerGap);

  // Isometric top face: rhombus from center-top
  // faceW = full width of rhombus, faceH = height of rhombus
  function topFace(y: number, color: string, highlight: string, isActive: boolean) {
    // top-center, right, bottom-center, left
    const pts = [
      [cx, y],
      [cx + faceW / 2, y + faceH / 2],
      [cx, y + faceH],
      [cx - faceW / 2, y + faceH / 2],
    ];
    const dotRows = 4;
    const dotCols = 6;
    const dots = [];
    for (let r = 0; r < dotRows; r++) {
      for (let c = 0; c < dotCols; c++) {
        // interpolate on the rhombus
        const u = (c + 0.5) / dotCols;
        const v = (r + 0.5) / dotRows;
        // bilinear on rhombus
        const tx = pts[0][0] * (1 - u) * (1 - v) + pts[1][0] * u * (1 - v) + pts[2][0] * u * v + pts[3][0] * (1 - u) * v;
        const ty = pts[0][1] * (1 - u) * (1 - v) + pts[1][1] * u * (1 - v) + pts[2][1] * u * v + pts[3][1] * (1 - u) * v;
        dots.push({ x: tx, y: ty });
      }
    }

    return (
      <g key={y}>
        <polygon
          points={pts.map(p => p.join(',')).join(' ')}
          fill={color}
          stroke={isActive ? highlight : '#2a2a2e'}
          strokeWidth={isActive ? 1.5 : 0.5}
        />
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={1.2} fill={isActive ? highlight : '#3a3a3e'} opacity={0.6} />
        ))}
        {/* corner highlight dots */}
        <circle cx={pts[1][0]} cy={pts[1][1]} r={3} fill={highlight} opacity={isActive ? 1 : 0.3} />
      </g>
    );
  }

  function leftFace(layerY: number, color: string) {
    // left side face
    const top = [cx - faceW / 2, layerY + faceH / 2];
    const topRight = [cx, layerY + faceH];
    const botRight = [cx, layerY + faceH + layerH];
    const bot = [cx - faceW / 2, layerY + faceH / 2 + layerH];
    return (
      <polygon
        key={`lf-${layerY}`}
        points={[top, topRight, botRight, bot].map(p => p.join(',')).join(' ')}
        fill={color}
        stroke="#1e1e20"
        strokeWidth={0.5}
      />
    );
  }

  function rightFace(layerY: number, color: string) {
    const top = [cx, layerY + faceH];
    const topRight = [cx + faceW / 2, layerY + faceH / 2];
    const botRight = [cx + faceW / 2, layerY + faceH / 2 + layerH];
    const bot = [cx, layerY + faceH + layerH];
    return (
      <polygon
        key={`rf-${layerY}`}
        points={[top, topRight, botRight, bot].map(p => p.join(',')).join(' ')}
        fill={color}
        stroke="#1a1a1c"
        strokeWidth={0.5}
      />
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      style={{ maxHeight: '100%', display: 'block' }}
      aria-hidden="true"
    >
      {/* Right side vertical labels */}
      {rightLabels.map((label, i) => {
        const y = getLayerY(i) + layerH / 2 + faceH / 2 + 20;
        const isActive = i === activeIndex;
        return (
          <text
            key={label}
            x={W - 8}
            y={y}
            fill={isActive ? '#e7e6d9' : '#42413e'}
            fontSize={8}
            fontFamily="'Suisse Intl Mono', monospace"
            letterSpacing={1.5}
            textAnchor="end"
            fontWeight={isActive ? 600 : 400}
          >
            {label}
          </text>
        );
      })}

      {/* Dotted vertical lines connecting right labels */}
      {rightLabels.map((_, i) => {
        const y1 = getLayerY(i) + faceH / 2 + 10;
        const y2 = getLayerY(i) + layerH + faceH / 2;
        return (
          <line
            key={`vl-${i}`}
            x1={W - 90}
            y1={y1}
            x2={W - 90}
            y2={y2}
            stroke="#2a2a2e"
            strokeWidth={0.5}
            strokeDasharray="2,3"
          />
        );
      })}

      {/* Draw layers from bottom to top so top faces render correctly */}
      {[...Array(totalLayers)].reverse().map((_, ri) => {
        const i = totalLayers - 1 - ri;
        const layerY = getLayerY(i);
        const isActive = i === activeIndex;
        const hc = highlightColors[i];
        return (
          <g key={i}>
            {leftFace(layerY, edgeColorLeft)}
            {rightFace(layerY, edgeColorRight)}
            {topFace(layerY, topFaceColor, hc, isActive)}
            {/* Layer label on left face */}
            <text
              x={cx - faceW / 4 - 8}
              y={layerY + faceH / 2 + layerH / 2 + 4}
              fill={isActive ? '#e7e6d9' : '#5e5d58'}
              fontSize={9}
              fontFamily="'Suisse Intl', sans-serif"
              fontWeight={600}
              transform={`rotate(-26, ${cx - faceW / 4 - 8}, ${layerY + faceH / 2 + layerH / 2 + 4})`}
            >
              {layers[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Features Accordion ─────────────────────────────────────────────────────────
type AccordionItem = {
  number: string;
  title: string;
  body: string;
  locked?: boolean;
};

const ACCORDION_ITEMS: AccordionItem[] = [
  {
    number: '01',
    title: 'You bring models. We bring the compute.',
    body: 'Get complete AI factories integrating high-density power, liquid cooling, and NVIDIA GPUs into one system designed for peak AI performance.',
    locked: true,
  },
  {
    number: '02',
    title: 'Your supercomputer. Your rules.',
    body: 'Accelerate every stage of your AI lifecycle. Train foundation models and serve billions of tokens.',
  },
  {
    number: '03',
    title: 'Orchestration, handled.',
    body: 'Run large-scale AI workloads without the operational burden. We manage your clusters so you can focus on innovation.',
  },
  {
    number: '04',
    title: 'Experts included.',
    body: 'Co-engineer your workloads with the very people building the infrastructure behind the world\'s most advanced models.',
  },
];

function FeaturesSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (i: number) => {
    if (ACCORDION_ITEMS[i].locked) return; // locked item can't close
    setOpenIndex(i === openIndex ? openIndex : i); // open new, don't allow all closed
  };

  return (
    <section className="pt-xl pb-xl module-comp">
      <div className="container">
        <div className="stack--md">
          {/* Section heading */}
          <div className="dark-mode titleBlock">
            <div className="grid-x grid-margin-x">
              <div className="cell small-12 medium-7">
                <div>
                  <h2 className="h2">Built for AI. Ready for superintelligence.</h2>
                  <div className="content noContent" />
                </div>
              </div>
            </div>
          </div>

          {/* Accordion + illustration */}
          <div className="grid-x grid-margin-x">
            {/* Left: accordion */}
            <div className="cell small-12 medium-7">
              <div className="accordion">
                {ACCORDION_ITEMS.map((item, i) => {
                  const isOpen = openIndex === i;
                  return (
                    <div className="accordionItem" key={item.number}>
                      <div className="accordionItemNumberColumn">
                        <span
                          className="h5"
                          aria-hidden="true"
                          style={{ color: isOpen ? 'var(--color-ultraviolet)' : undefined }}
                        >
                          {item.number}
                        </span>
                      </div>
                      <div className="accordionItemContentColumn">
                        <h3 className="accordionItemHeader">
                          <button
                            type="button"
                            className="accordionItemHeaderButton"
                            aria-expanded={isOpen}
                            data-locked={item.locked ? 'true' : undefined}
                            onClick={() => handleToggle(i)}
                          >
                            <span className="accordionItemTitle">{item.title}</span>
                            <span className="accordionToggle" aria-hidden="true">
                              {isOpen ? '−' : '+'}
                            </span>
                          </button>
                        </h3>
                        <div
                          className={`accordionItemContent${isOpen ? ' accordionItemContentOpen' : ''}`}
                          role="region"
                          {...(!isOpen ? { inert: true } : {})}
                          style={{
                            maxHeight: isOpen ? '400px' : '0',
                            transition: 'max-height 0.4s cubic-bezier(0.6, 0, 0.4, 1), visibility 0.4s',
                          }}
                        >
                          <div className="accordionItemRich">
                            <div>{item.body}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: isometric illustration */}
            <div className="cell small-12 medium-5">
              <div className="_animationContainer_1wr90_9">
                <IsometricIllustration activeIndex={openIndex} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sectionBorder" />
    </section>
  );
}

// ─── Hardware Section ───────────────────────────────────────────────────────────
type HardwareProduct = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

const HARDWARE_PRODUCTS: HardwareProduct[] = [
  {
    title: 'NVIDIA VR200 NVL72',
    description: 'Rack-scale systems optimized for agentic AI.',
    image: '/images/vr200.jpg',
    alt: 'NVIDIA VR200 NVL72',
  },
  {
    title: 'NVIDIA GB300 NVL72',
    description: 'Rack-scale systems optimized for AI reasoning',
    image: '/images/gb300.png',
    alt: 'NVIDIA GB300 NVL72',
  },
  {
    title: 'NVIDIA HGX B300',
    description: 'Peak performance per watt for the largest training runs',
    image: '/images/hgx-b300.png',
    alt: 'NVIDIA HGX B300',
  },
  {
    title: 'NVIDIA HGX B200',
    description: 'Versatile fine-tuning and inference',
    image: '/images/hgx-b200.png',
    alt: 'NVIDIA HGX B200',
  },
];

function HardwareSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="hardwareSection">
      <div className="hardwareInner">
        {/* Title block */}
        <div className="hardwareTitleBlock">
          <div className="hardwareTitleLeft">
            <h2 className="hardwareHeading">
              The engines of<br />superintelligence
            </h2>
          </div>
          <div className="hardwareTitleRight">
            <p className="hardwareSubtitle">
              Give your team the computational precision to train foundation models and serve inference at global scale.
            </p>
          </div>
        </div>

        {/* Horizontal accordion */}
        <div className="hardwareAccordionItems">
          {HARDWARE_PRODUCTS.map((product, i) => {
            const isActive = activeIndex === i;
            return (
              <div
                key={product.title}
                className={`hardwareAccordionItem w-full bg-[#0B0B0B] ${isActive ? ' hardwareActive' : ''}`}
                aria-expanded={isActive}
                onClick={() => setActiveIndex(i)}
              >
                <div className={`hardwareAccordionImage ${isActive ? ' hardwareActiveImage' : ''}`}>
                  <img
                    src={product.image}
                    alt={product.alt}
                    width={410}
                    height={410}
                    className="hardwareAccordionImg"
                  />
                </div>
                <div className="hardwareAccordionItemInner">
                  <div className={`hardwareAccordionTextContent ${isActive ? 'hardwareActiveTextContent' : ''}`}>
                    <h3 className="hardwareAccordionItemTitle">{product.title}</h3>
                    <div className={`hardwareAccordionItemRichText ${isActive ? ' hardwareActiveRichText' : ''}`}>
                      {product.description}
                    </div>
                  </div>
                </div>
                <div className={`hardwareAccordionItemIndicator ${isActive ? ' hardwareActiveIndicator' : ''}`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────────
const App = () => {
  return (
    <div>
      {/* SECTION 1 — HERO */}
      <section
        className="pt-xl pb-xl _homeHero_m4xpb_1 module-comp"
        id="section-home-hero"
      >
        <HeroBackground />

        <p className="_eyebrow_m4xpb_37">Supercomputers for training and inference</p>

        {/* Reduced-motion fallback */}
        <h1 className="h1-large _reducedMotionTitle_m4xpb_75">
          <span>The Superintelligence <br /> Cloud</span>
        </h1>

        {/* Animated heading */}
        <HeroTitle />

        <div className="container _titleContainer_m4xpb_58">
          <div className="buttonGroup _buttonGroup_m4xpb_63" data-align="center">
            <a href="/sign-up" className="button" aria-label="Launch GPU instance">
              Launch GPU instance
            </a>
            <a href="/talk-to-our-team" className="button button--secondary" aria-label="Talk to our team">
              Talk to our team
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2 — FEATURES */}
      <FeaturesSection />

      {/* SECTION 3 — HARDWARE */}
      <HardwareSection />
    </div>
  );
};

export default App;
