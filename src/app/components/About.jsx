"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bebas_Neue, Caveat, DM_Sans } from "next/font/google";
import { Mail, Link, Code2 } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const bebas = Bebas_Neue({ subsets: ["latin"], weight: ["400"] });
const caveat = Caveat({ subsets: ["latin"], weight: ["600"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });
const TEXT = "ABOUT ME";
const HOBBIES = [
  { name: "Reading", done: true },
  { name: "Golf", done: true },
  { name: "KickBoxing", done: false },
  { name: "Snowboarding", done: true },
  { name: "Photography", done: false },
  { name: "This website", done: true },
  { name: "Rock Climbing", done: true },
  { name: "Content Creation", done: false },
  { name: "Bench 225", done: true },
  { name: "Fishing", done: true },
  { name: "Basktball", done: true },
  { name: "Learning Spanish", done: false },
  { name: "Camping", done: true },
];

export default function About() {
  const sectionRef = useRef(null);
  const nameRef = useRef(null);
  const scribblePathRef = useRef(null);
  const parallaxRef = useRef(null);
  const photoRef = useRef(null);
  const socialRef = useRef(null);
  const ohHiRef = useRef(null);
  const blockRef1 = useRef(null);
  const blockRef2 = useRef(null);
  const blockRef3 = useRef(null);
  const blockRef4 = useRef(null);
  const hobbiesRef = useRef(null);
  const rollTargetsRef = useRef([]);
  const [blockText1, setBlockText1] = useState("");
  const [blockText2, setBlockText2] = useState("");
  const [blockText3, setBlockText3] = useState("");
  const [blockText4, setBlockText4] = useState("");

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const name = nameRef.current;
    const path = scribblePathRef.current;
    const parallax = parallaxRef.current;
    const photo = photoRef.current;
    const social = socialRef.current;
    const ohHi = ohHiRef.current;
    const block1 = blockRef1.current;
    const block2 = blockRef2.current;
    const block3 = blockRef3.current;
    const block4 = blockRef4.current;
    const hobbies = hobbiesRef.current;
    if (
      !section ||
      !name ||
      !path ||
      !photo ||
      !parallax ||
      !social ||
      !ohHi ||
      !block1 ||
      !block2 ||
      !block3 ||
      !block4 ||
      !hobbies
    ) {
      return;
    }

    const nodes = name.querySelectorAll("[data-roll-inner]");
    rollTargetsRef.current = Array.from(nodes);
    gsap.set(rollTargetsRef.current, { yPercent: 0 });

    const pathLength = path.getTotalLength();

    gsap.set(name, { y: 120, opacity: 0, scale: 0.85 });
    gsap.set(path, { strokeDashoffset: pathLength, strokeDasharray: pathLength });
    gsap.set(photo, { opacity: 0 });
    gsap.set(social, { opacity: 0 });
    gsap.set(ohHi, { opacity: 0, y: 20 });
    gsap.set([block1, block2, block3, block4], { opacity: 0 });

    const hobbyItems = hobbies.querySelectorAll("[data-hobby-item]");
    gsap.set(hobbyItems, { opacity: 0, x: -40 });

    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          once: false,
          onEnter: () => tl.restart(),
          onLeaveBack: () => tl.progress(0).pause(),
        }
      });

      tl
        .to(name, { y: 0, opacity: 1, scale: 1.05, duration: 0.5, ease: "power3.out" })
        .to(name, { scale: 1, duration: 0.15, ease: "power2.in" })
        .to(name, { y: -60, duration: 0.4, ease: "power2.inOut" })
        .to(path, { strokeDashoffset: 0, duration: 1, ease: "power2.inOut" }, "+=0.1")
        .to(photo, { opacity: 1, duration: 0.6, ease: "power1.out" }, "+=0.1")
        .to(social, { opacity: 1, duration: 0.5 }, "+=0.1")
        .to(ohHi, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "+=0.3");

      gsap.to(parallax, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(hobbyItems, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: hobbies,
          start: "top 85%",
          once: false,
          toggleActions: "play none none reset",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const blocks = [
      {
        ref: blockRef1,
        text: "What's up! I'm Simran, a Computer Engineering student at the University of Alberta, currently interning at General Motors.",
        set: setBlockText1,
      },
      {
        ref: blockRef2,
        text: "I love cars, bikes, getting amazed by new technology and most of all, talking to people.",
        set: setBlockText2, 
      },
      {
        ref: blockRef3,
        text: "When I'm not at work, school, or eating (because I'm always hungry), I'm actively trying to collect as many hobbies as I possibly can.",
        set: setBlockText3,
      },
      {
        ref: blockRef4,
        text: "Feel free to reach out, I would love to have a conversation with you! (Bring a snack)",
        set: setBlockText4,
      },
      
    ];

    const observers = [];
    const timers = [];

    blocks.forEach(({ ref, text, set }) => {
      const el = ref.current;
      if (!el) return;
      let index = 0;
      let started = false;

      const type = () => {
        if (index >= text.length) return;
        const ch = text[index];
        index += 1;
        set((prev) => prev + ch);
        const id = window.setTimeout(type, ch === " " ? 130 : 30);
        timers.push(id);
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !started) {
              started = true;
              gsap.to(el, { opacity: 0.5, duration: 0.3, overwrite: "auto" });
              type();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="min-h-screen scroll-mt-16 overflow-x-hidden bg-[var(--bg)]"
      aria-label="About"
    >
      <div className="mx-auto flex w-full flex-col items-center px-4 pb-[120px] sm:px-8">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: "20vh",
            width: "100%",
            position: "relative",
          }}
        >
          <h2
            ref={nameRef}
            className={`${bebas.className} text-center text-[clamp(5rem,18vw,16rem)] uppercase leading-none tracking-tight text-[var(--text)]`}
            aria-label="About Me"
          >
            {TEXT.split("").map((char, i) => (
              <span
                key={`${char}-${i}`}
                style={{ display: "inline-block", overflow: "hidden", height: "0.85em", verticalAlign: "top" }}
                onMouseEnter={() => {
                  const inner = rollTargetsRef.current[i];
                  if (!inner) return;
                  gsap.to(inner, { yPercent: -50, duration: 0.4, ease: "power2.out", overwrite: "auto" });
                }}
                onMouseLeave={() => {
                  const inner = rollTargetsRef.current[i];
                  if (!inner) return;
                  gsap.to(inner, { yPercent: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" });
                }}
              >
                <span
                  data-roll-inner
                  ref={(el) => { if (el) rollTargetsRef.current[i] = el; }}
                  style={{ display: "flex", flexDirection: "column", willChange: "transform" }}
                >
                  <span style={{ display: "block", lineHeight: "0.85em" }}>{char === " " ? "\u00A0" : char}</span>
                  <span style={{ display: "block", lineHeight: "0.85em" }}>{char === " " ? "\u00A0" : char}</span>
                </span>
              </span>
            ))}
          </h2>

          <div style={{ position: "relative", width: "100%", marginTop: "48px" }}>
            <svg
              viewBox="0 0 1440 160"
              height="160"
              preserveAspectRatio="none"
              style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)", display: "block" }}
              aria-hidden
            >
              <path
                ref={scribblePathRef}
                d="M-10,80 C30,80 20,30 80,60 C130,85 120,20 180,50 C240,80 220,130 290,90 C340,60 360,140 420,80 C480,20 500,120 560,70 C610,30 630,110 700,80 C760,50 770,130 840,60 C900,0 920,140 990,80 C1050,30 1070,120 1140,70 C1200,25 1220,130 1290,80 C1350,35 1380,100 1450,80"
                stroke="#C17A3A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>

            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }}
              className="flex flex-col items-center"
            >
              <div ref={parallaxRef}>
                <div ref={photoRef}>
                  <img
                    src="/images/Personal_picture.jpg"
                    alt="Simran Bansal"
                    className="h-[380px] w-[260px] rounded-[12px] object-cover"
                  />
                </div>
              </div>
              <div ref={socialRef} style={{ marginTop: "16px" }} className="flex items-center justify-center gap-6">
                <a
                  href="mailto:ssbansal731@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1"
                  aria-label="Email"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-all duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white">
                    <Mail size={16} />
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--accent)]">
                    Email
                  </span>
                </a>
                <a
                  href="https://www.linkedin.com/in/simransb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1"
                  aria-label="LinkedIn"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-all duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white">
                    <Link size={16} />
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--accent)]">
                    LinkedIn
                  </span>
                </a>
                <a
                  href="https://github.com/ssbansal3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1"
                  aria-label="GitHub"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-all duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white">
                    <Code2 size={16} />
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--accent)]">
                    GitHub
                  </span>
                </a>
              </div>
            </div>
          </div>
          <p
          ref={ohHiRef}
          style={{
            position: "absolute",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
          className={`${caveat.className} text-center text-[clamp(2rem,6vw,4rem)] text-[var(--muted)]`}
          >
          A Visitor? Hello!
          </p>
        </div>

        <div
          ref={blockRef1}
          style={{ marginTop: "80px" }}
          className={`${dmSans.className} w-full max-w-[700px] text-center text-[clamp(1.5rem,3.5vw,4rem)] leading-[1.2] text-[var(--text)]`}
        >
          {blockText1}
        </div>

        <div
          ref={blockRef2}
          style={{ marginTop: "80px" }}
          className={`${dmSans.className} w-full max-w-[700px] text-center text-[clamp(1.5rem,3.5vw,4rem)] leading-[1.2] text-[var(--text)]`}
        >
          {blockText2}
        </div>
        
        <div
          ref={blockRef3}
          style={{ marginTop: "80px" }}
          className={`${dmSans.className} w-full max-w-[700px] text-center text-[clamp(1.5rem,3.5vw,4rem)] leading-[1.2] text-[var(--text)]`}
        >
          {blockText3}
        </div>

        <div
          ref={blockRef4}
          style={{ marginTop: "80px", marginBottom: "120px" }}
          className={`${dmSans.className} flex w-full max-w-[700px] flex-col items-center text-center text-[clamp(1.5rem,3.5vw,4rem)] leading-[1.2] text-[var(--text)]`}
        >
          <p>{blockText4}</p>
          <a
            href="mailto:ssbansal731@gmail.com"
            className="mt-6 text-[clamp(1rem,2vw,2rem)] uppercase tracking-widest text-[var(--accent)] underline underline-offset-4 transition hover:opacity-70"
          >
            ssbansal731@gmail.com
          </a>
        </div>

        <div style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)", height: "1px", background: "#C17A3A", opacity: 0.6, marginTop: "140px" }} />
        <div ref={hobbiesRef} style={{ marginTop: "0px" }} className="w-full">
          <div className={`${bebas.className} mb-2 flex items-center justify-center gap-2 text-[clamp(1rem,3vw,2rem)] text-[var(--muted)]`}>
            <span>CURRENTLY COLLECTING:</span>
            <span className="text-[clamp(1rem,3vw,2rem)] text-[var(--accent)]">↓</span>
          </div>
          <div>
            {HOBBIES.map((hobby, index) => (
              <div
                key={hobby.name}
                data-hobby-item
                style={{
                  width: "100vw",
                  marginLeft: "calc(-50vw + 50%)",
                  padding: "12px 5vw",
                  borderTop: "0.5px solid var(--border)",
                  borderBottom: index === HOBBIES.length - 1 ? "0.5px solid var(--border)" : "none",
                }}
                className="group relative cursor-default text-center transition-all duration-200 ease-in-out hover:bg-[#C17A3A] hover:text-[#fff]"
              >
                <div className={`${bebas.className} text-[clamp(4rem,12vw,12rem)] uppercase leading-none text-[var(--text)] transition-colors duration-200 group-hover:text-[#fff]`}>
                  {hobby.name}
                </div>
                {hobby.done ? (
                  <span
                    className={`${caveat.className} absolute opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
                    style={{
                      left: "3vw",
                      top: "-30px",
                      transform: "rotate(-12deg)",
                      fontSize: "clamp(3rem,8vw,8rem)",
                      color: "#fff",
                      lineHeight: 1,
                      pointerEvents: "none",
                    }}
                  >
                    ✓
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}