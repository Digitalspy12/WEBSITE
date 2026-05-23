"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function Keyboard3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const w = container.clientWidth
    const h = container.clientHeight

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 100)
    camera.position.set(0, 3.2, 7)
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(4, 8, 4)
    dirLight.castShadow = true
    scene.add(dirLight)

    // Orange point light (accent)
    const pointLight = new THREE.PointLight(0xff6b2b, 3, 10)
    pointLight.position.set(-2, 2, 3)
    scene.add(pointLight)

    // Rim light (blue tint)
    const rimLight = new THREE.PointLight(0x4488ff, 1.5, 12)
    rimLight.position.set(3, 1, -3)
    scene.add(rimLight)

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.15,
      metalness: 0.9,
    })

    const keyMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.3,
      metalness: 0.7,
    })

    const accentKeyMat = new THREE.MeshStandardMaterial({
      color: 0xff6b2b,
      roughness: 0.2,
      metalness: 0.6,
      emissive: new THREE.Color(0xff6b2b),
      emissiveIntensity: 0.3,
    })

    const specialKeyMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.25,
      metalness: 0.8,
    })

    // --- Keyboard body ---
    const bodyGeo = new THREE.BoxGeometry(5.6, 0.22, 2.0)
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat)
    bodyMesh.castShadow = true
    bodyMesh.receiveShadow = true
    bodyMesh.position.set(0, 0, 0)
    scene.add(bodyMesh)

    // Slight tilt
    bodyMesh.rotation.x = -0.08

    // --- Helper to create a key ---
    const makeKey = (
      width: number,
      height: number,
      depth: number,
      x: number,
      y: number,
      z: number,
      mat: THREE.Material
    ) => {
      const geo = new THREE.BoxGeometry(width, height, depth)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.castShadow = true
      mesh.position.set(x, y, z)
      // Slight bevel-ish look via scale
      mesh.scale.set(0.96, 1, 0.96)
      bodyMesh.add(mesh)
      return mesh
    }

    // Key layout config
    const keyW = 0.36
    const keyH = 0.1
    const keyD = 0.36
    const gap = 0.04
    const step = keyW + gap
    const yOff = 0.16
    const zStart = -0.72

    // Row definitions [cols, xOffset, mat, widthMultiplier?]
    const rows: Array<{
      count: number
      xStart: number
      z: number
      mat?: THREE.Material
      widths?: number[]
    }> = [
      // Row 0 — function row (top)
      { count: 14, xStart: -2.5, z: zStart, mat: specialKeyMat },
      // Row 1 — number row
      { count: 13, xStart: -2.3, z: zStart + step },
      // Row 2 — QWERTY
      { count: 12, xStart: -2.15, z: zStart + step * 2 },
      // Row 3 — ASDF
      { count: 11, xStart: -2.05, z: zStart + step * 3 },
      // Row 4 — ZXCV
      { count: 10, xStart: -1.9, z: zStart + step * 4 },
    ]

    rows.forEach((row) => {
      for (let i = 0; i < row.count; i++) {
        const x = row.xStart + i * step
        const mat = row.mat || (Math.random() < 0.05 ? accentKeyMat : keyMat)
        makeKey(keyW, keyH, keyD, x, yOff, row.z, mat)
      }
    })

    // Space bar
    makeKey(2.2, keyH, keyD, 0.0, yOff, zStart + step * 5, specialKeyMat)

    // Enter key (wide)
    makeKey(0.75, keyH, keyD, 2.0, yOff, zStart + step * 3, accentKeyMat)

    // Shift key (wide)
    makeKey(0.75, keyH, keyD, -2.35, yOff, zStart + step * 4, specialKeyMat)

    // Backspace
    makeKey(0.75, keyH, keyD, 2.0, yOff, zStart + step, accentKeyMat)

    // Ground reflection plane
    const planeGeo = new THREE.PlaneGeometry(14, 14)
    const planeMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      roughness: 1,
      metalness: 0,
    })
    const plane = new THREE.Mesh(planeGeo, planeMat)
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -0.28
    plane.receiveShadow = true
    scene.add(plane)

    // Mouse parallax
    let mouseX = 0
    let mouseY = 0
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener("mousemove", onMouseMove)

    // Resize
    const onResize = () => {
      const nw = container.clientWidth
      const nh = container.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener("resize", onResize)

    // Animation loop
    let frame: number
    const clock = new THREE.Clock()

    const animate = () => {
      frame = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Gentle floating
      bodyMesh.position.y = Math.sin(t * 0.8) * 0.06
      bodyMesh.rotation.y = Math.sin(t * 0.4) * 0.08 + mouseX * 0.18
      bodyMesh.rotation.x = -0.08 + mouseY * 0.06

      // Pulse accent light
      pointLight.intensity = 2.5 + Math.sin(t * 1.5) * 0.8

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      aria-hidden="true"
    />
  )
}
