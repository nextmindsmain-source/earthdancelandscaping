import { useEffect, useRef } from 'react'

// Phones, portrait tablets, short landscape phones and reduced motion get the still hero instead.
export const STILL_GATES = [
  '(max-width: 720px)',
  '(orientation: portrait) and (max-width: 1024px)',
  '(orientation: portrait) and (pointer: coarse)',
  '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
  '(prefers-reduced-motion: reduce)',
]

// Scroll progress (0..1) of `sectionRef` drives the video's currentTime.
// Streams the file as a Blob (works on hosts without Range support), lerps, and gates seeks.
export default function ScrubVideo({ sectionRef, src, poster, className = '' }) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return
    const mqls = STILL_GATES.map((q) => window.matchMedia(q))
    let target = 0, shown = 0, raf = null, last = 0, busy = false, pending = null
    let started = false, onScreen = true, objectUrl = null, armed = false

    const progress = () => {
      const r = section.getBoundingClientRect()
      const range = section.offsetHeight - window.innerHeight
      return Math.min(1, Math.max(0, -r.top / Math.max(1, range)))
    }
    const seek = (t) => {
      if (!video.duration) return
      if (busy) { pending = t; return }
      const next = Math.min(video.duration - 0.01, Math.max(0, t))
      if (Math.abs(video.currentTime - next) < 0.001) return   // no change means no 'seeked' event, so never raise the busy flag
      busy = true
      video.currentTime = next
    }
    const onSeeked = () => {
      busy = false
      if (pending !== null) { const t = pending; pending = null; seek(t) }
    }
    const onError = () => { busy = false; pending = null; video.style.display = 'none' }
    const tick = (now) => {
      const dt = Math.min(100, now - (last || now)); last = now
      shown += (target - shown) * (1 - Math.pow(1 - 0.16, dt / 16.667))
      if (Math.abs(target - shown) < 0.0005) { shown = target; raf = null; last = 0 } else raf = requestAnimationFrame(tick)
      seek(shown * video.duration)
    }
    const onScroll = () => {
      target = progress()
      if (raf === null && onScreen) raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (onScreen) onScroll() })
    io.observe(section)

    async function load() {
      if (started) return
      started = true
      const ctrl = new AbortController()
      let wd = setTimeout(() => ctrl.abort(), 20000)
      try {
        const res = await fetch(src, { priority: 'low', signal: ctrl.signal })
        const reader = res.body.getReader()
        const chunks = []
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          clearTimeout(wd); wd = setTimeout(() => ctrl.abort(), 20000)
          chunks.push(value)
        }
        clearTimeout(wd)
        objectUrl = URL.createObjectURL(new Blob(chunks, { type: 'video/mp4' }))
        video.src = objectUrl
        video.load()
        video.addEventListener('canplay', () => {
          seek(progress() * video.duration)
          section.classList.add('video-ready')
        }, { once: true })
      } catch { video.style.display = 'none' }
    }

    function apply() {
      const still = mqls.some((m) => m.matches)
      if (still && armed) { armed = false; window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); raf = null; section.classList.remove('video-ready') }
      if (!still && !armed) { armed = true; load(); window.addEventListener('scroll', onScroll, { passive: true }); onScroll() }
    }

    video.addEventListener('seeked', onSeeked)
    video.addEventListener('error', onError)
    mqls.forEach((m) => m.addEventListener('change', apply))
    apply()
    return () => {
      window.removeEventListener('scroll', onScroll)
      mqls.forEach((m) => m.removeEventListener('change', apply))
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('error', onError)
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [sectionRef, src])

  return (
    <video
      ref={videoRef}
      className={`scrub-video absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 will-change-transform ${className}`}
      poster={poster}
      muted
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}
