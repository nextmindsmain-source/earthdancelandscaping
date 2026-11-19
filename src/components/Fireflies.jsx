import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const COUNT = 260

function Motes() {
  const ref = useRef()
  const { positions, seeds } = useMemo(() => {
    const p = new Float32Array(COUNT * 3)
    const s = new Float32Array(COUNT * 2)
    for (let i = 0; i < COUNT; i++) {
      p[i * 3] = (Math.random() - 0.5) * 16
      p[i * 3 + 1] = (Math.random() - 0.5) * 9
      p[i * 3 + 2] = (Math.random() - 0.5) * 6
      s[i * 2] = Math.random() * 6.28
      s[i * 2 + 1] = 0.2 + Math.random() * 0.6
    }
    return { positions: p, seeds: s }
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uScroll: { value: 0 } },
        vertexShader: `
          attribute vec2 aSeed;
          uniform float uTime; uniform float uScroll;
          varying float vA;
          void main(){
            vec3 p = position;
            p.x += sin(uTime*aSeed.y + aSeed.x)*0.5;
            p.y += cos(uTime*aSeed.y*0.8 + aSeed.x*1.7)*0.4 + uScroll*aSeed.y*2.0;
            p.y = mod(p.y + 4.5, 9.0) - 4.5;
            vA = 0.35 + 0.65*abs(sin(uTime*aSeed.y*1.5 + aSeed.x));
            vec4 mv = modelViewMatrix * vec4(p,1.0);
            gl_PointSize = (14.0 + aSeed.y*18.0) * (1.0 / -mv.z) * 6.0;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          varying float vA;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(0.78, 0.84, 0.32, a*a*vA*0.8);
          }`,
      }),
    [],
  )

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uScroll.value = window.scrollY / Math.max(1, window.innerHeight) * 0.35
    if (ref.current) {
      ref.current.rotation.y += (state.pointer.x * 0.08 - ref.current.rotation.y) * 0.04
      ref.current.rotation.x += (-state.pointer.y * 0.05 - ref.current.rotation.x) * 0.04
    }
  })

  return (
    <points ref={ref} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
        <bufferAttribute attach="attributes-aSeed" array={seeds} count={COUNT} itemSize={2} />
      </bufferGeometry>
    </points>
  )
}

export default function Fireflies({ className = '' }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: false }}>
        <Motes />
      </Canvas>
    </div>
  )
}
