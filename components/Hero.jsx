"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "WELCOME ITZ FIZZ";
const STATS = [
  { n: 58, t: "Increase in pick up point use" },
  { n: 23, t: "Decrease in customer phone calls" },
  { n: 27, t: "Increase in pick up point use" },
  { n: 40, t: "Decrease in customer phone calls" },
];

export default function Hero() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray(".letter");
      const stats = gsap.utils.toArray(".stat");

      // 1) Intro animation (runs once on load)
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(letters, { y: 40, opacity: 0, duration: 1, stagger: 0.05 })
        .from(stats, { y: 30, opacity: 0, duration: 0.9, stagger: 0.18 }, "-=0.3")
        .from("#car", { xPercent: -30, opacity: 0, duration: 1.2 }, "<")
        .add(() => {
          gsap.utils.toArray("[data-n]").forEach((el) => {
            const o = { v: 0 };
            gsap.to(o, {
              v: +el.dataset.n, duration: 1.6, ease: "power2.out",
              onUpdate: () => (el.textContent = Math.round(o.v)),
            });
          });
        }, "-=1.4");

      // 2) Scroll-driven animation (scrubbed, transform/opacity only)
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "+=250%",
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            onUpdate: (s) => gsap.set("#progress", { scaleX: s.progress }),
          },
        })
        .fromTo("#car", { x: "-10vw", scale: 0.9 },
          { x: "62vw", scale: 1.1, transformOrigin: "50% 100%", ease: "power1.inOut" }, 0)
        .to(".wheel", { rotation: 1080, transformOrigin: "50% 50%" }, 0)
        .to("#dashes", { x: "-100vw" }, 0)
        .to(letters, { y: -50, opacity: 0.15, stagger: 0.03, ease: "power1.out" }, 0.1)
        .to(stats, { y: -30, opacity: 0.2, stagger: 0.05 }, 0.3)
        .to("#hint", { opacity: 0 }, 0);
    }, root);

    return () => ctx.revert(); // cleanup (React strict mode safe)
  }, []);

  const wheel = (cx) => (
    <g>
      <circle cx={cx} cy="130" r="32" fill="#111" />
      <g className="wheel">
        <circle cx={cx} cy="130" r="18" fill="#cfd3da" />
        <path
          d={`M${cx} 114V146M${cx - 16} 130H${cx + 16}M${cx - 11} 119L${cx + 11} 141M${cx + 11} 119L${cx - 11} 141`}
          stroke="#555" strokeWidth="3"
        />
      </g>
    </g>
  );

  return (
    <div ref={root}>
      <div id="progress" className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50"
        style={{ background: "var(--accent)", transform: "scaleX(0)" }} />

      <section id="hero" className="relative h-screen w-full overflow-hidden glow">
        <div className="absolute inset-x-0 top-[12%] px-4 text-center">
          <h1 aria-label="Welcome Itz Fizz"
            className="font-light text-[clamp(1.1rem,4.2vw,3.4rem)] tracking-[0.35em] sm:tracking-[0.6em] leading-tight">
            {[...TITLE].map((c, i) => (
              <span key={i} aria-hidden="true" className="letter will">{c}</span>
            ))}
          </h1>

          <div className="mt-10 sm:mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {STATS.map((s, i) => (
              <div key={i} className="stat will">
                <div className="text-4xl sm:text-5xl font-semibold" style={{ color: "var(--accent)" }}>
                  <span data-n={s.n}>0</span>%
                </div>
                <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>{s.t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* road */}
        <div className="absolute inset-x-0 bottom-0 h-[22%]" style={{ background: "var(--road)" }}>
          <div id="dashes" className="absolute top-1/2 left-0 h-[4px] will"
            style={{
              width: "300vw", opacity: 0.6,
              background: "repeating-linear-gradient(90deg,var(--muted) 0 60px,transparent 60px 140px)",
            }} />
        </div>

        {/* car */}
        <div id="car" className="absolute will left-0"
          style={{ bottom: "calc(22% - 18px)", width: "min(46vw,460px)" }}>
          <svg viewBox="0 0 460 170" className="w-full h-auto" role="img" aria-label="Car">
            <ellipse cx="230" cy="160" rx="200" ry="8" fill="#000" opacity=".25" />
            <path d="M20 120 L30 90 Q40 78 70 74 L130 68 Q165 25 215 22 L300 22 Q345 25 372 66 L420 76 Q445 82 442 112 L438 128 L20 128Z" fill="var(--accent)" />
            <path d="M150 66 Q178 36 218 34 L240 34 L240 66Z M254 34 L300 34 Q332 38 352 66 L254 66Z" fill="#cfe6f2" opacity=".9" />
            <rect x="236" y="34" width="22" height="34" fill="var(--accent)" />
            <rect x="418" y="86" width="22" height="10" rx="4" fill="#ffe9a8" />
            {wheel(110)}
            {wheel(352)}
          </svg>
        </div>

        <p id="hint" className="absolute bottom-3 inset-x-0 text-center text-xs tracking-[0.3em]"
          style={{ color: "var(--muted)" }}>SCROLL ↓</p>
      </section>
    </div>
  );
}