"use client"

import { useRef, useEffect, useState, Suspense } from "react"
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Html, Environment, Box, Sphere } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, Maximize2 } from "lucide-react"
import * as THREE from "three"

// Shared animation transition system
const useSmoothTransition = (currentStep: number, duration: number = 800) => {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    setIsTransitioning(true)
    startTimeRef.current = Date.now()
    setTransitionProgress(0)

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth transitions
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      setTransitionProgress(easedProgress)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsTransitioning(false)
      }
    }

    requestAnimationFrame(animate)
  }, [currentStep, duration])

  return { isTransitioning, transitionProgress }
}

// Enhanced camera controller with smooth transitions
function EnhancedCameraController({ step, isTransitioning }: { step: number; isTransitioning: boolean }) {
  const { camera } = useThree()
  const targetPosition = useRef(new THREE.Vector3(0, 2, 8 + step * 0.5))
  const currentPosition = useRef(camera.position.clone())

  useFrame(() => {
    if (isTransitioning) {
      // Smooth camera movement during transitions
      currentPosition.current.lerp(targetPosition.current, 0.05)
      camera.position.copy(currentPosition.current)
      camera.lookAt(0, 0, 0)
    } else {
      // Gentle floating motion when not transitioning
      const time = Date.now() * 0.001
      camera.position.y = 2 + Math.sin(time * 0.5) * 0.1
    }
  })

  useEffect(() => {
    targetPosition.current.set(0, 2, 8 + step * 0.5)
  }, [step])

  return null
}

interface AnimationStep {
  step: number
  title: string
  description: string
  data: any
}

interface ThreeAnimationProps {
  steps: AnimationStep[]
  currentStep: number
  isPlaying: boolean
  onStepChange: (step: number) => void
  onPlayPause: () => void
  onReset: () => void
  algorithmId: string
}

// Two Sum 3D Visualization Component
function TwoSumVisualization({ step, data }: { step: AnimationStep; data: any }) {
  const groupRef = useRef<THREE.Group>(null)
  const { array, target, currentIndex, hashMap, complement, found, result } = data

  // Enhanced Array visualization as 3D boxes with advanced materials
  const ArrayBoxes = () => {
    return (
      <>
        {array.map((value: number, index: number) => {
          const isActive = index === currentIndex
          const isResult = result && result.includes(index)
          const isInHashMap = Object.values(hashMap).includes(index)

          let materialProps = {
            color: isResult ? "#22c55e" : isActive ? "#3b82f6" : isInHashMap ? "#8b5cf6" : "#6b7280",
            metalness: 0.3,
            roughness: 0.4,
            emissive: isActive ? "#1e40af" : isResult ? "#166534" : "#000000",
            emissiveIntensity: isActive ? 0.2 : isResult ? 0.1 : 0
          }

          return (
            <Box
              key={index}
              position={[index * 2 - array.length, 0, 0]}
              args={[1.5, 1.5, 1.5]}
              ref={groupRef}
            >
              <meshStandardMaterial {...materialProps} />
              <Html position={[0, 0, 0.8]} center>
                <div className={`px-3 py-2 rounded-lg shadow-lg text-sm font-bold border-2 transition-all duration-300 ${
                  isResult
                    ? "bg-green-100 text-green-800 border-green-400"
                    : isActive
                      ? "bg-blue-100 text-blue-800 border-blue-400 animate-pulse"
                      : isInHashMap
                        ? "bg-purple-100 text-purple-800 border-purple-400"
                        : "bg-white text-gray-800 border-gray-300"
                }`}>
                  {value}
                </div>
              </Html>
              <Html position={[0, -1.2, 0]} center>
                <div className={`text-xs px-2 py-1 rounded transition-all duration-300 ${
                  isResult
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse"
                      : "bg-gray-50 text-gray-600 border border-gray-200"
                }`}>
                  [{index}]
                </div>
              </Html>

              {/* Add glow effect for active/result elements */}
              {(isActive || isResult) && (
                <pointLight
                  position={[0, 0, 1]}
                  intensity={0.5}
                  distance={3}
                  color={isResult ? "#22c55e" : "#3b82f6"}
                />
              )}
            </Box>
          )
        })}
      </>
    )
  }

  // Enhanced Hash Map visualization as floating spheres with advanced effects
  const HashMapVisualization = () => {
    const hashEntries = Object.entries(hashMap)
    return (
      <>
        {hashEntries.map(([key, value], index) => {
          const isComplement = complement !== undefined && parseInt(key) === complement
          return (
            <group key={key} position={[index * 2.5 - hashEntries.length * 1.25, 3, 0]}>
              {/* Main sphere with enhanced materials */}
              <Sphere args={[0.8]} position={[0, 0, 0]}>
                <meshStandardMaterial
                  color={isComplement ? "#f59e0b" : "#8b5cf6"}
                  metalness={0.6}
                  roughness={0.2}
                  emissive={isComplement ? "#d97706" : "#7c3aed"}
                  emissiveIntensity={isComplement ? 0.3 : 0.1}
                />
              </Sphere>

              {/* Orbiting particles for active elements */}
              {isComplement && (
                <>
                  <Sphere args={[0.1]} position={[1.2, 0, 0]}>
                    <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
                  </Sphere>
                  <Sphere args={[0.1]} position={[-1.2, 0, 0]}>
                    <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
                  </Sphere>
                </>
              )}

              {/* Enhanced HTML overlay */}
              <Html position={[0, 0, 1.2]} center>
                <div className={`px-3 py-2 rounded-lg shadow-xl text-sm font-bold border-2 transition-all duration-300 ${
                  isComplement
                    ? "bg-orange-100 text-orange-800 border-orange-400 animate-pulse"
                    : "bg-purple-100 text-purple-800 border-purple-400"
                }`}>
                  <div className="flex items-center gap-2">
                    <span>{key}</span>
                    <span className="text-lg">→</span>
                    <span>{value}</span>
                  </div>
                  {isComplement && (
                    <div className="text-xs mt-1 opacity-75">🔍 Target Found!</div>
                  )}
                </div>
              </Html>

              {/* Connection lines to array elements */}
              {Object.values(hashMap).includes(value) && (
                <line>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([
                        0, 0, 0,
                        (value as number) * 2 - array.length, -3, 0
                      ])}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial color="#8b5cf6" opacity={0.3} transparent />
                </line>
              )}
            </group>
          )
        })}
      </>
    )
  }

  // Target and complement visualization
  const TargetVisualization = () => (
    <group position={[0, -3, 0]}>
      <Box args={[2, 1, 1]}>
        <meshStandardMaterial color="#f59e0b" />
      </Box>
      <Html position={[0, 0, 0.6]} center>
        <div className="bg-yellow-100 px-3 py-2 rounded shadow font-bold text-yellow-800">Target: {target}</div>
      </Html>
      {complement !== undefined && (
        <group position={[4, 0, 0]}>
          <Box args={[2, 1, 1]}>
            <meshStandardMaterial color={found ? "#22c55e" : "#ef4444"} />
          </Box>
          <Html position={[0, 0, 0.6]} center>
            <div
              className={`px-3 py-2 rounded shadow font-bold ${
                found ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              Need: {complement}
            </div>
          </Html>
        </group>
      )}
    </group>
  )

  // Animated connections
  const Connections = () => {
    if (!found || !result) return null

    return (
      <group>
        {/* Connection line between found elements */}
        <mesh position={[result[0] * 2 - array.length + (result[1] - result[0]), 0.5, 0]}>
          <boxGeometry args={[Math.abs(result[1] - result[0]) * 2, 0.1, 0.1]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
      </group>
    )
  }

  return (
    <group>
      <ArrayBoxes />
      <HashMapVisualization />
      <TargetVisualization />
      <Connections />

      {/* Step title */}
      <Text
        position={[0, 5, 0]}
        fontSize={0.8}
        color="#374151"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {step.title}
      </Text>

      {/* Step description */}
      <Html position={[0, -5, 0]} center>
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg max-w-md text-center">
          <p className="text-sm text-gray-700">{step.description}</p>
        </div>
      </Html>
    </group>
  )
}

// Generic 3D Algorithm Visualization
function GenericVisualization({ step }: { step: AnimationStep }) {
  return (
    <group>
      <Box args={[2, 2, 2]}>
        <meshStandardMaterial color="#6366f1" />
      </Box>
      <Text
        position={[0, 3, 0]}
        fontSize={0.6}
        color="#374151"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Geist-Bold.ttf"
      >
        {step.title}
      </Text>
      <Html position={[0, -3, 0]} center>
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg max-w-md text-center">
          <p className="text-sm text-gray-700">{step.description}</p>
        </div>
      </Html>
    </group>
  )
}

// Camera controller for smooth transitions
function CameraController({ step }: { step: number }) {
  const { camera } = useThree()

  useEffect(() => {
    // Smooth camera transitions based on step
    const targetPosition = new THREE.Vector3(0, 2, 8 + step * 0.5)
    const currentPosition = camera.position.clone()

    const animate = () => {
      camera.position.lerp(targetPosition, 0.05)
      if (camera.position.distanceTo(targetPosition) > 0.1) {
        requestAnimationFrame(animate)
      }
    }
    animate()
  }, [step, camera])

  return null
}

// Enhanced Loading fallback with 3D effect
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="relative">
          {/* 3D Cube loading animation */}
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 animate-spin">
              <div className="w-full h-full border-4 border-primary/20 rounded-lg"></div>
            </div>
            <div className="absolute inset-1 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}>
              <div className="w-full h-full border-4 border-secondary/40 rounded-lg border-t-secondary"></div>
            </div>
            <div className="absolute inset-2 animate-pulse">
              <div className="w-full h-full bg-primary/10 rounded-lg flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground font-medium">Loading Enhanced 3D Visualization...</p>
        <p className="text-xs text-muted-foreground mt-1">Preparing immersive experience</p>
      </div>
    </div>
  )
}

// Particle System Component for enhanced 3D atmosphere
function Particles() {
  const particlesRef = useRef<THREE.Points>(null)

  useEffect(() => {
    if (!particlesRef.current) return

    const particles = particlesRef.current
    let animationId: number

    const animate = () => {
      if (particles) {
        particles.rotation.x += 0.001
        particles.rotation.y += 0.002
      }
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  // Generate particle positions
  const particleCount = 200
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3

    // Random positions in a sphere
    const radius = Math.random() * 15 + 5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(Math.random() * 2 - 1)

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i3 + 2] = radius * Math.cos(phi)

    // Subtle colors
    const colorVariation = Math.random()
    colors[i3] = 0.6 + colorVariation * 0.4     // R
    colors[i3 + 1] = 0.8 + colorVariation * 0.2 // G
    colors[i3 + 2] = 1.0 - colorVariation * 0.3 // B
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export function ThreeAnimation({
  steps,
  currentStep,
  isPlaying,
  onStepChange,
  onPlayPause,
  onReset,
  algorithmId,
}: ThreeAnimationProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { isTransitioning, transitionProgress } = useSmoothTransition(currentStep)

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        onStepChange(currentStep + 1)
      }, 3000) // 3 seconds per step for 3D animations
    } else if (isPlaying && currentStep >= steps.length - 1) {
      onPlayPause()
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, steps.length, onStepChange, onPlayPause])

  const canGoPrevious = currentStep > 0
  const canGoNext = currentStep < steps.length - 1

  const currentStepData = steps[currentStep]

  const renderVisualization = () => {
    if (algorithmId === "two-sum") {
      return <TwoSumVisualization step={currentStepData} data={currentStepData.data} />
    }
    return <GenericVisualization step={currentStepData} />
  }

  return (
    <div className="space-y-4">
      {/* 3D Canvas Container */}
      <div
        className={`bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 rounded-lg border-2 border-muted overflow-hidden ${
          isFullscreen ? "fixed inset-0 z-50" : "h-[500px]"
        }`}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Canvas camera={{ position: [0, 2, 8], fov: 60 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} dpr={[1, 2]}>
            {/* Enhanced Lighting System */}
            <ambientLight intensity={0.4} color="#e0f2fe" />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.2}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
              color="#ffffff"
            />
            <pointLight position={[-10, -10, -5]} intensity={0.8} color="#fbbf24" />
            <pointLight position={[10, -10, 10]} intensity={0.6} color="#a855f7" />

            {/* Atmospheric Lighting */}
            <fog attach="fog" args={['#f8fafc', 10, 25]} />

            {/* Enhanced Environment */}
            <Environment preset="studio" background={false} />

            {/* Enhanced Camera Controller */}
            <EnhancedCameraController step={currentStep} isTransitioning={isTransitioning} />

            {/* Main Visualization */}
            {renderVisualization()}

            {/* Enhanced Interactive Controls */}
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              maxPolarAngle={Math.PI / 1.8}
              minPolarAngle={Math.PI / 6}
              minDistance={3}
              maxDistance={25}
              autoRotate={false}
              autoRotateSpeed={0.5}
              dampingFactor={0.05}
              enableDamping={true}
              zoomSpeed={0.6}
              rotateSpeed={0.4}
              panSpeed={0.8}
            />

            {/* Particle System Background */}
            <Particles />
          </Canvas>
        </Suspense>

        {/* Fullscreen toggle */}
        <Button
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Step Information */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-2">{currentStepData?.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{currentStepData?.description}</p>
      </div>

      {/* Animation Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onStepChange(currentStep - 1)} disabled={!canGoPrevious}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => onStepChange(currentStep + 1)} disabled={!canGoNext}>
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button variant="secondary" size="sm" onClick={onPlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => onStepChange(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentStep
                ? "bg-secondary"
                : index < currentStep
                  ? "bg-secondary/50"
                  : "bg-muted-foreground/30"
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>

      {/* Enhanced 3D Controls Help */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-700">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-800 rounded-full flex items-center justify-center">
              <span className="text-lg">🖱️</span>
            </div>
            <div>
              <div className="font-medium text-indigo-800 dark:text-indigo-200">Drag to rotate</div>
              <div className="text-xs text-indigo-600 dark:text-indigo-300">360° exploration</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
              <span className="text-lg">🔍</span>
            </div>
            <div>
              <div className="font-medium text-purple-800 dark:text-purple-200">Scroll to zoom</div>
              <div className="text-xs text-purple-600 dark:text-purple-300">3x to 25x zoom</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-100 dark:bg-pink-800 rounded-full flex items-center justify-center">
              <span className="text-lg">✋</span>
            </div>
            <div>
              <div className="font-medium text-pink-800 dark:text-pink-200">Shift+drag to pan</div>
              <div className="text-xs text-pink-600 dark:text-pink-300">Move around scene</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
            <div>
              <div className="font-medium text-green-800 dark:text-green-200">Enhanced Materials</div>
              <div className="text-xs text-green-600 dark:text-green-300">PBR lighting & effects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
