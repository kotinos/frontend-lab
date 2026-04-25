import { Canvas } from '@react-three/fiber'
import { SceneContent } from './Scene.tsx'

export function App() {
  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative', background: '#020617' }}>
      <Canvas camera={{ position: [0, 1.2, 6.2], fov: 42 }}>
        <SceneContent />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: '8%',
          transform: 'translateX(-50%)',
          width: 'min(420px, 92vw)',
          padding: '1.25rem 1.5rem',
          borderRadius: '20px',
          border: '1px solid rgba(148,163,184,0.35)',
          background: 'rgba(15,23,42,0.55)',
          color: '#e2e8f0',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h1 style={{ margin: '0 0 0.35rem', fontSize: '1.15rem', letterSpacing: '-0.02em' }}>AeroStride One</h1>
        <p style={{ margin: 0, opacity: 0.78, lineHeight: 1.55, fontSize: '0.92rem' }}>
          Lightweight orbital shell · adaptive lacing · studio lighting reacts to your cursor.
        </p>
        <button
          type="button"
          style={{
            marginTop: '1rem',
            width: '100%',
            borderRadius: '999px',
            border: 'none',
            padding: '0.75rem 1rem',
            fontWeight: 600,
            cursor: 'pointer',
            color: '#020617',
            background: 'linear-gradient(120deg, #c7d2fe, #fef9c3)',
            boxShadow: '0 12px 40px rgba(129,140,248,0.45)',
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
