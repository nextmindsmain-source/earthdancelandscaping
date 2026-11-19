import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Lenis from 'lenis'
import SplitText from './components/SplitText'
import BlurText from './components/BlurText'
import ScrollReveal from './components/ScrollReveal'
import Magnet from './components/Magnet'
import Fireflies from './components/Fireflies'
import ScrubVideo, { STILL_GATES } from './components/ScrubVideo'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PHONE = '(905) 321 1482'
const PHONE_HREF = 'tel:+19053211482'

const SERVICES = [
  { n: '01', title: 'Plantscapes', img: '/img/plantscapes.jpg', text: 'Layered beds of trees, shrubs and perennials, planned so every month of the Niagara year has something to look at.' },
  { n: '02', title: 'Hardscapes', img: '/img/hardscapes.jpg', text: 'Natural stone patios, walkways, fire pits and outdoor rooms, built to last through every freeze and thaw.' },
  { n: '03', title: 'Water Features', img: '/img/water.jpg', text: 'Waterfalls, ponds and streams that give the yard a sound and a heartbeat.' },
  { n: '04', title: 'Retaining Walls', img: '/img/walls.jpg', text: 'Engineered stone walls that hold a slope and turn it into terraced garden.' },
  { n: '05', title: 'Commercial Landscaping', img: '/img/commercial.jpg', text: 'First impressions for offices, hotels and retail. Clean lines, healthy plantings, zero excuses.' },
]

function Preloader({ done }) {
  const ref = useRef(null)
  const num = useRef(null)
  useGSAP(() => {
    const o = { v: 0 }
    const tl = gsap.timeline({ onComplete: done })
    tl.to(o, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, '0') } })
      .to('.pre-logo', { y: -20, opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.1')
      .to(ref.current, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '<0.1')
  }, { scope: ref })
  return (
    <div ref={ref} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-night">
      <div className="pre-logo flex flex-col items-center gap-6">
        <div className="rounded-2xl bg-bone px-6 py-3 shadow-[0_0_80px_rgba(183,194,60,.18)]">
          <img src="/img/logo.png" alt="Earthdance Landscaping" width="220" height="83" />
        </div>
        <span className="label text-olive">Niagara · Since 1996</span>
      </div>
      <span ref={num} className="label absolute bottom-8 right-8 text-bone/60">000</span>
    </div>
  )
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50"><div className="wrap flex items-center justify-between py-4">
      <a href="#top" className="block rounded-xl bg-bone/95 px-3 py-1.5 backdrop-blur" aria-label="Earthdance Landscaping home">
        <img src="/img/logo.png" alt="Earthdance Landscaping" className="h-9 w-auto md:h-11" />
      </a>
      <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
        {[['Work', '#work'], ['Maintenance', '#care'], ['About', '#about'], ['Contact', '#contact']].map(([t, h]) => (
          <a key={t} href={h} className="label text-bone/80 transition-colors hover:text-olive">{t}</a>
        ))}
      </nav>
      <Magnet padding={60} magnetStrength={3}>
        <a href={PHONE_HREF} className="label inline-flex min-h-11 items-center rounded-full border border-olive/60 bg-night/40 px-5 py-2 text-olive backdrop-blur transition-colors hover:bg-olive hover:text-night">
          {PHONE}
        </a>
      </Magnet>
    </div></header>
  )
}

function Hero({ ready }) {
  const root = useRef(null)
  const [still, setStill] = useState(false)
  useEffect(() => {
    const mqls = STILL_GATES.map((q) => window.matchMedia(q))
    const upd = () => setStill(mqls.some((m) => m.matches))
    upd()
    mqls.forEach((m) => m.addEventListener('change', upd))
    return () => mqls.forEach((m) => m.removeEventListener('change', upd))
  }, [])

  useGSAP(() => {
    gsap.set('.hero-sub, .hero-cta', { opacity: 0, y: 24 })
    if (still) return
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
    tl.to('.hero-copy', { yPercent: -18, opacity: 0, duration: 0.14, ease: 'power1.in' }, 0.1)
      .to('.hero-shade', { opacity: 0.55, duration: 0.1 }, 0.1)
      .fromTo('.hero-mid', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.12 }, 0.3)
      .to('.hero-mid', { opacity: 0, y: -40, duration: 0.12 }, 0.58)
      .to('.hero-shade', { opacity: 0, duration: 0.15 }, 0.62)
      .fromTo('.hero-end', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.14 }, 0.82)
      .to('.hero-scroll', { opacity: 0, duration: 0.05 }, 0)
  }, { scope: root, dependencies: [still], revertOnUpdate: true })

  useGSAP(() => {
    if (!ready) return
    gsap.timeline()
      .to('.hero-sub', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.9)
      .to('.hero-cta', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 1.1)
  }, { scope: root, dependencies: [ready] })

  return (
    <section ref={root} id="top" className={`relative ${still ? 'h-screen' : 'h-[500vh]'}`}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <img className="absolute inset-0 h-full w-full object-cover" src="/img/hero.jpg" alt="Luxury Niagara garden with pool and willow at golden hour" fetchPriority="high" />
        <ScrubVideo sectionRef={root} src="/img/hero-scrub.mp4" />
        <div className="vignette pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/10 to-night/55" />
        <div className="hero-shade pointer-events-none absolute inset-0 bg-night/70 opacity-0" />
        <Fireflies className="pointer-events-none absolute inset-0" />

        <div className="hero-copy relative z-10 flex h-full flex-col justify-end"><div className="wrap pb-16 md:pb-20">
          <p className="label mb-5 text-olive">Landscape design + build · Niagara Falls &amp; St. Catharines</p>
          {ready && (
            <h1 className="font-display text-[15vw] leading-[0.88] tracking-tight md:text-[9.5vw]">
              <div><SplitText text="Gardens that" tag="span" className="" splitType="chars" delay={28} duration={1.1} from={{ opacity: 0, y: 70 }} to={{ opacity: 1, y: 0 }} textAlign="left" /></div>
              <div><SplitText text="move you." tag="span" className="italic text-olive" splitType="chars" delay={28} duration={1.1} from={{ opacity: 0, y: 70 }} to={{ opacity: 1, y: 0 }} textAlign="left" /></div>
            </h1>
          )}
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="hero-sub max-w-md text-base text-bone/85 md:text-lg" style={{ textShadow: '0 2px 20px rgba(7,31,23,.9)' }}>
              Award-winning residential and commercial landscapes, designed and built in the Niagara Region since 1996.
            </p>
            <div className="hero-cta flex items-center gap-4">
              <Magnet padding={70} magnetStrength={3}>
                <a href="#contact" className="inline-flex min-h-12 items-center rounded-full bg-olive px-7 py-3 text-sm font-bold text-night transition-transform hover:scale-105">Book a consultation</a>
              </Magnet>
              <a href="#work" className="label text-bone/80 underline-offset-8 hover:text-olive hover:underline">See the work</a>
            </div>
          </div>
        </div></div>

        {!still && (
          <>
            <div className="hero-mid pointer-events-none absolute inset-0 z-10 flex items-center opacity-0">
              <div className="wrap"><p className="max-w-3xl font-display text-5xl leading-[1.02] md:text-7xl" style={{ textShadow: '0 2px 30px rgba(7,31,23,.9)' }}>
                Thirty years of Niagara gardens. <em className="text-olive">One standard.</em>
              </p></div>
            </div>
            <div className="hero-end pointer-events-none absolute inset-x-0 bottom-0 z-10 pb-20 opacity-0">
              <div className="wrap"><p className="label mb-4 text-olive">Your turn</p>
              <p className="max-w-2xl font-display text-5xl leading-[1.02] md:text-7xl" style={{ textShadow: '0 2px 30px rgba(7,31,23,.9)' }}>
                Walk the garden <em className="text-olive">before it exists.</em>
              </p></div>
            </div>
            <div className="hero-scroll label absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-bone/60 md:block">Scroll</div>
          </>
        )}
      </div>
    </section>
  )
}

function Manifesto() {
  return (
    <section id="about" className="relative z-10 bg-night py-32 md:py-48">
      <div className="wrap flex flex-col items-center text-center">
        <p className="label mb-10 text-olive">( The Earthdance way )</p>
        <ScrollReveal baseOpacity={0.12} enableBlur baseRotation={2} blurStrength={6} containerClassName="mx-auto max-w-6xl" textClassName="font-display !text-[8vw] md:!text-[4.4vw] !leading-[1.08] text-bone text-center">
          We design and build outdoor spaces with balance, patience and an obsession for detail. Thirty years of Niagara gardens, one standard.
        </ScrollReveal>
      </div>
    </section>
  )
}

function Work() {
  const root = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const track = root.current.querySelector('.track')
      const dist = () => track.scrollWidth - window.innerWidth
      const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + dist(), scrub: 0.7, pin: true, invalidateOnRefresh: true } })
      gsap.utils.toArray('.panel-img').forEach((img) => {
        gsap.fromTo(img, { xPercent: -12 }, { xPercent: 12, ease: 'none', scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
      })
      gsap.to('.work-bar', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: () => '+=' + dist(), scrub: true } })
    })
    mm.add('(max-width: 767px)', () => {
      gsap.utils.toArray('.panel').forEach((p) => {
        gsap.from(p, { opacity: 0, y: 60, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: p, start: 'top 85%' } })
      })
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <section ref={root} id="work" className="relative overflow-hidden bg-moss md:h-screen">
      <div className="absolute inset-x-0 top-24 z-20">
        <div className="wrap"><p className="label text-olive">( What we build )</p></div>
      </div>
      <div className="work-bar absolute inset-x-0 bottom-0 z-20 hidden h-1 origin-left scale-x-0 bg-olive md:block" />
      <div className="track flex flex-col gap-10 pb-20 pt-40 track-pad md:h-full md:flex-row md:items-center md:gap-8 md:pb-0 md:pt-0">
        <div className="shrink-0 md:w-[34vw]">
          <h2 className="font-display text-6xl leading-[0.95] md:text-8xl">Five ways to <em className="text-olive">shape land.</em></h2>
          <p className="mt-6 max-w-sm text-bone/70">From a single garden bed to a full commercial campus, each project starts with the site and ends with something you want to walk through.</p>
        </div>
        {SERVICES.map((s) => (
          <article key={s.n} className="panel relative shrink-0 overflow-hidden rounded-3xl md:h-[72vh] md:w-[56vw]">
            <div className="relative aspect-[4/3] overflow-hidden md:absolute md:inset-0 md:aspect-auto">
              <img className="panel-img absolute inset-0 h-full w-full object-cover md:w-[125%] md:max-w-none md:-left-[12.5%]" src={s.img} alt={s.title + ' by Earthdance Landscaping'} loading="lazy" />
            </div>
            <div className="absolute inset-0 hidden bg-gradient-to-t from-night/90 via-night/10 to-transparent md:block" />
            <div className="relative bg-night p-6 md:absolute md:inset-x-0 md:bottom-0 md:bg-transparent md:p-10">
              <span className="label text-olive">{s.n} / 05</span>
              <h3 className="mt-2 font-display text-4xl md:text-6xl">{s.title}</h3>
              <p className="mt-3 max-w-md text-bone/80">{s.text}</p>
            </div>
          </article>
        ))}
        <div className="shrink-0 md:w-[20vw]" />
      </div>
    </section>
  )
}

function Care() {
  const root = useRef(null)
  useGSAP(() => {
    gsap.utils.toArray('.care-img').forEach((el) => {
      gsap.fromTo(el.querySelector('img'), { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo(el, { clipPath: 'inset(18% 12% 18% 12% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 25%', scrub: true } })
    })
  }, { scope: root })

  const rows = [
    { tag: 'Property maintenance', title: 'Perfect, every week.', img: '/img/maintenance.jpg', text: 'Mowing, edging, pruning and seasonal care for homes and commercial properties across Niagara. More than 15 years of crews who show up and finish the job.' },
    { tag: 'Winter services', title: 'Clear by morning.', img: '/img/winter.jpg', text: 'Snow removal that keeps driveways, lots and walkways clean, clear and safe, so winter never stops your day.' },
  ]
  return (
    <section ref={root} id="care" className="wrap relative py-24 md:py-40">
      {rows.map((r, i) => (
        <div key={r.tag} className="mb-24 grid items-center gap-10 last:mb-0 md:mb-40 md:grid-cols-12">
          <div className={`care-img overflow-hidden md:col-span-8 md:row-start-1 ${i % 2 ? 'md:col-start-5' : 'md:col-start-1'}`}>
            <img src={r.img} alt={r.tag + ' in Niagara'} className="aspect-[16/10] w-full object-cover" loading="lazy" />
          </div>
          <div className={`md:col-span-4 md:row-start-1 ${i % 2 ? 'md:col-start-1' : 'md:col-start-9'}`}>
            <p className="label mb-4 text-olive">{r.tag}</p>
            <BlurText text={r.title} className="font-display text-5xl leading-none md:text-7xl" animateBy="words" delay={120} />
            <p className="mt-6 max-w-sm text-bone/75">{r.text}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

function Numbers() {
  const root = useRef(null)
  const year = useRef(null)
  useGSAP(() => {
    const o = { v: 1900 }
    gsap.to(o, { v: 1996, duration: 2.6, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 70%', once: true }, onUpdate: () => { if (year.current) year.current.textContent = Math.round(o.v) } })
    gsap.fromTo('.year-fill', { backgroundPositionY: '0%' }, { backgroundPositionY: '100%', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    gsap.fromTo('.tl-line', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.tl', start: 'top 85%', end: 'top 35%', scrub: true } })
    gsap.from('.tl-item', { opacity: 0, y: 40, duration: 0.9, stagger: 0.18, ease: 'power3.out', scrollTrigger: { trigger: '.tl', start: 'top 80%' } })
    gsap.from('.tl-dot', { scale: 0, duration: 0.5, stagger: 0.25, ease: 'back.out(2)', scrollTrigger: { trigger: '.tl', start: 'top 80%' } })
  }, { scope: root })
  const steps = [
    { k: '1996', t: 'Planted', d: 'Earthdance is founded in Niagara Falls with one idea: balanced design, built with care.' },
    { k: 'Growing', t: 'Design, build, maintain', d: 'One team for the plan, the construction and the years of upkeep that follow.' },
    { k: 'Today', t: 'Every season', d: 'Homes and commercial properties across Niagara, from first frost to full bloom.' },
  ]
  return (
    <section ref={root} className="relative overflow-hidden border-y border-bone/15 bg-moss py-24 md:py-36">
      <div className="wrap">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <p className="label text-olive">( Rooted in Niagara )</p>
          <p className="max-w-xs text-bone/70 md:text-right">Thirty years of gardens, walls, water and snow. Same name, same standard.</p>
        </div>
        <div className="mt-6 text-center">
          <span className="label text-bone/60">Our first garden</span>
          <div
            ref={year}
            aria-label="1996"
            className="year-fill select-none font-display text-[34vw] leading-[0.82] text-transparent md:text-[min(30vw,26rem)]"
            style={{ backgroundImage: 'linear-gradient(rgba(7,31,23,.15), rgba(7,31,23,.15)), url(/img/plantscapes.jpg)', backgroundSize: 'cover', backgroundPositionX: 'center', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextStroke: '1px rgba(183,194,60,.55)' }}
          >1996</div>
        </div>
        <div className="tl relative mt-16 grid gap-10 md:mt-24 md:grid-cols-3 md:gap-8">
          <div className="tl-line absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-olive md:block" />
          {steps.map((s) => (
            <div key={s.k} className="tl-item relative md:pt-10">
              <span className="tl-dot absolute left-0 top-0 hidden h-[15px] w-[15px] rounded-full border-2 border-olive bg-moss md:block" />
              <p className="label text-olive">{s.k}</p>
              <h3 className="mt-3 font-display text-4xl leading-none md:text-5xl">{s.t}</h3>
              <p className="mt-4 max-w-sm text-bone/70">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  const root = useRef(null)
  useGSAP(() => {
    gsap.from('.cta-bg', { scale: 1.25, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } })
  }, { scope: root })
  const field = 'w-full rounded-xl border border-bone/40 bg-night/50 px-4 py-3 text-bone placeholder:text-bone/50 backdrop-blur focus:border-olive'
  return (
    <section ref={root} id="contact" className="relative isolate overflow-hidden py-28 md:py-44">
      <img className="cta-bg absolute inset-0 -z-10 h-full w-full object-cover" src="/img/hero.jpg" alt="" aria-hidden="true" loading="lazy" />
      <div className="absolute inset-0 -z-10 bg-night/80" />
      <div className="wrap grid gap-16 md:grid-cols-2">
        <div>
          <p className="label mb-6 text-olive">( Start here )</p>
          <h2 className="font-display text-6xl leading-[0.95] md:text-8xl">Let&apos;s plant <em className="text-olive">something.</em></h2>
          <p className="mt-6 max-w-md text-lg text-bone/80">Tell us about your property. We will walk it with you and come back with a plan.</p>
          <a href={PHONE_HREF} className="mt-10 block font-display text-4xl text-bone transition-colors hover:text-olive md:text-6xl">{PHONE}</a>
          <p className="label mt-3 text-bone/60">Ask for Victor · Niagara Falls, Ontario</p>
        </div>
        <form
          className="space-y-4 self-end"
          onSubmit={(e) => { e.preventDefault(); setSent(true) }}
        >
          {sent ? (
            <p className="rounded-2xl border border-olive/50 bg-night/60 p-8 font-display text-3xl">Thank you. For now, please call {PHONE} and we will pick it up from there.</p>
          ) : (
            <>
              <label className="block"><span className="label mb-2 block text-bone/70">Name</span><input required name="name" autoComplete="name" className={field} placeholder="Your name" /></label>
              <label className="block"><span className="label mb-2 block text-bone/70">Phone or email</span><input required name="contact" className={field} placeholder="How should we reach you?" /></label>
              <label className="block"><span className="label mb-2 block text-bone/70">Your project</span><textarea required name="msg" rows="4" className={field} placeholder="Garden, patio, water feature, maintenance, snow..." /></label>
              <button type="submit" className="inline-flex min-h-12 items-center rounded-full bg-olive px-8 py-3 text-sm font-bold text-night transition-transform hover:scale-105">Request a consultation</button>
            </>
          )}
        </form>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-bone/15 bg-night py-12">
      <div className="wrap"><div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <div className="inline-block rounded-xl bg-bone px-3 py-1.5"><img src="/img/logo.png" alt="Earthdance Landscaping" className="h-10 w-auto" /></div>
          <p className="mt-4 max-w-sm text-sm text-bone/60">Award-winning residential and commercial landscape design and build firm serving Niagara Falls, St. Catharines and beyond.</p>
        </div>
        <ul className="label flex flex-wrap gap-x-8 gap-y-3 text-bone/70">
          {['Plantscapes', 'Hardscapes', 'Water Features', 'Retaining Walls', 'Commercial', 'Property Maintenance', 'Winter Services', 'Careers'].map((t) => (<li key={t}>{t}</li>))}
        </ul>
      </div>
      <p className="label mt-10 text-bone/40">© {new Date().getFullYear()} Earthdance Landscaping · Imagery is AI generated concept art</p></div>
    </footer>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [])

  return (
    <div className="grain">
      <Preloader done={() => setReady(true)} />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Manifesto />
        <Work />
        <Care />
        <Numbers />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
