import { useFrame, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, useGLTF } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { damp } from './lightMath.ts'

const MODEL =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb'

useGLTF.preload(MODEL)

function Product() {
  const gltf = useGLTF(MODEL)
  return <primitive object={gltf.scene} scale={1.35} position={[0, -0.6, 0]} />
}

function PointerLight() {
  const ref = useRef<THREE.PointLight>(null)
  const { pointer } = useThree()
  useFrame((_, delta) => {
    const l = ref.current
    if (!l) return
    const targetX = pointer.x * 6
    const targetY = pointer.y * 4 + 1
    l.position.x = damp(l.position.x, targetX, 0.85, delta)
    l.position.y = damp(l.position.y, targetY, 0.85, delta)
    l.position.z = damp(l.position.z, 5.5, 0.9, delta)
  })
  return <pointLight ref={ref} intensity={2.4} color="#ffe8c2" distance={28} decay={2} />
}

export function SceneContent() {
  return (
    <>
      <color attach="background" args={['#020617']} />
      <ambientLight intensity={0.35} />
      <PointerLight />
      <directionalLight position={[-4, 6, 2]} intensity={0.8} color="#c7d2fe" />
      <Suspense fallback={null}>
        <Product />
      </Suspense>
      <Environment preset="city" />
      <OrbitControls enablePan={false} minDistance={3} maxDistance={9} />
    </>
  )
}
