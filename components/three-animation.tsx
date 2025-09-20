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
        {hashEntries.map(([key, value]: [string, any], index: number) => {
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

  // Linked List Visualization Component
  function LinkedListVisualization({ step, data }: { step: AnimationStep; data: any }) {
    // Handle different data formats from AI-generated JSON
    let lessList = []
    let greaterList = []
    let finalList = []
    const partitionValue = data.partitionValue || 3

    if (data.lessList && Array.isArray(data.lessList)) {
      lessList = data.lessList
    }
    if (data.greaterList && Array.isArray(data.greaterList)) {
      greaterList = data.greaterList
    }
    if (data.finalList && Array.isArray(data.finalList)) {
      finalList = data.finalList
    }

    return (
      <group>
        {/* Algorithm title */}
        <Html position={[0, 8, 0]} center>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-xl">
            🔗 Linked List Partition Algorithm
          </div>
        </Html>

        {/* Step indicator */}
        <Html position={[0, 6, 0]} center>
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
            <p className="text-gray-700 font-semibold">Step {step.step}: {step.title}</p>
            <p className="text-sm text-gray-500">Partition Value: {partitionValue}</p>
          </div>
        </Html>

        {/* Less-than list visualization */}
        <group position={[-4, 2, 0]}>
          <Html position={[0, 1, 0]} center>
            <div className="bg-green-100 px-3 py-1 rounded shadow font-semibold text-green-800">
              Less Than {partitionValue}
            </div>
          </Html>

          {lessList.map((node: any, index: number) => {
            const value = typeof node === 'object' ? (node.value || node.val || node) : node
            const x = (index - lessList.length / 2) * 1.5
            const y = 0
            const z = 0

            return (
              <group key={`less-${index}`} position={[x, y, z]}>
                <Box args={[0.8, 0.8, 0.2]}>
                  <meshStandardMaterial
                    color="#10b981"
                    emissive="#047857"
                    emissiveIntensity={step.step >= 3 ? 0.2 : 0}
                  />
                </Box>

                {/* Node value */}
                <Html position={[0, 0, 0.15]} center>
                  <div className="bg-green-500 text-white px-2 py-1 rounded shadow font-bold text-lg">
                    {value}
                  </div>
                </Html>

                {/* Arrow to next node */}
                {index < lessList.length - 1 && (
                  <group position={[0.75, 0, 0]}>
                    <Cylinder args={[0.02, 0.02, 0.5]}>
                      <meshStandardMaterial color="#10b981" />
                    </Cylinder>
                    <Cone args={[0.08, 0.2]} position={[0, 0, 0.25]}>
                      <meshStandardMaterial color="#10b981" />
                    </Cone>
                  </group>
                )}

                {/* Active indicator */}
                {step.step >= 3 && (
                  <Sphere args={[0.1]} position={[0, 0.8, 0]}>
                    <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} />
                  </Sphere>
                )}
              </group>
            )
          })}
        </group>

        {/* Greater-than list visualization */}
        <group position={[-4, -2, 0]}>
          <Html position={[0, 1, 0]} center>
            <div className="bg-red-100 px-3 py-1 rounded shadow font-semibold text-red-800">
              Greater Than {partitionValue}
            </div>
          </Html>

          {greaterList.map((node: any, index: number) => {
            const value = typeof node === 'object' ? (node.value || node.val || node) : node
            const x = (index - greaterList.length / 2) * 1.5
            const y = 0
            const z = 0

            return (
              <group key={`greater-${index}`} position={[x, y, z]}>
                <Box args={[0.8, 0.8, 0.2]}>
                  <meshStandardMaterial
                    color="#ef4444"
                    emissive="#dc2626"
                    emissiveIntensity={step.step >= 4 ? 0.2 : 0}
                  />
                </Box>

                {/* Node value */}
                <Html position={[0, 0, 0.15]} center>
                  <div className="bg-red-500 text-white px-2 py-1 rounded shadow font-bold text-lg">
                    {value}
                  </div>
                </Html>

                {/* Arrow to next node */}
                {index < greaterList.length - 1 && (
                  <group position={[0.75, 0, 0]}>
                    <Cylinder args={[0.02, 0.02, 0.5]}>
                      <meshStandardMaterial color="#ef4444" />
                    </Cylinder>
                    <Cone args={[0.08, 0.2]} position={[0, 0, 0.25]}>
                      <meshStandardMaterial color="#ef4444" />
                    </Cone>
                  </group>
                )}

                {/* Active indicator */}
                {step.step >= 4 && (
                  <Sphere args={[0.1]} position={[0, 0.8, 0]}>
                    <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} />
                  </Sphere>
                )}
              </group>
            )
          })}
        </group>

        {/* Final merged list visualization */}
        {finalList.length > 0 && (
          <group position={[0, -6, 0]}>
            <Html position={[0, 2, 0]} center>
              <div className="bg-purple-100 px-4 py-2 rounded-lg shadow-lg font-semibold text-purple-800">
                Final Partitioned List
              </div>
            </Html>

            {finalList.map((value: any, index: number) => {
              const actualValue = typeof value === 'object' ? (value.value || value.val || value) : value
              const x = (index - finalList.length / 2) * 1.2
              const y = 0
              const z = 0
              const isLess = actualValue < partitionValue

              return (
                <group key={`final-${index}`} position={[x, y, z]}>
                  <Box args={[0.8, 0.8, 0.2]}>
                    <meshStandardMaterial
                      color={isLess ? "#10b981" : "#ef4444"}
                      emissive={isLess ? "#047857" : "#dc2626"}
                      emissiveIntensity={0.3}
                    />
                  </Box>

                  {/* Node value */}
                  <Html position={[0, 0, 0.15]} center>
                    <div className={`px-2 py-1 rounded shadow font-bold text-lg ${
                      isLess ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}>
                      {actualValue}
                    </div>
                  </Html>

                  {/* Arrow to next node */}
                  {index < finalList.length - 1 && (
                    <group position={[0.6, 0, 0]}>
                      <Cylinder args={[0.02, 0.02, 0.4]}>
                        <meshStandardMaterial color="#7c3aed" />
                      </Cylinder>
                      <Cone args={[0.06, 0.15]} position={[0, 0, 0.2]}>
                        <meshStandardMaterial color="#7c3aed" />
                      </Cone>
                    </group>
                  )}

                  {/* Celebration particles for final result */}
                  <group>
                    {Array.from({ length: 3 }, (_, i) => (
                      <Sphere key={i} args={[0.03]} position={[
                        (Math.random() - 0.5) * 0.8,
                        Math.random() * 0.5 + 0.5,
                        (Math.random() - 0.5) * 0.8
                      ]}>
                        <meshStandardMaterial
                          color={["#fbbf24", "#f59e0b", "#10b981", "#ef4444", "#7c3aed"][i]}
                          emissive={["#f59e0b", "#d97706", "#047857", "#dc2626", "#5b21b6"][i]}
                          emissiveIntensity={0.8}
                        />
                      </Sphere>
                    ))}
                  </group>
                </group>
              )
            })}
          </group>
        )}

        {/* Partition value indicator */}
        <group position={[6, 4, 0]}>
          <Sphere args={[0.3]}>
            <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.6} />
          </Sphere>
          <Html position={[0, 0, 0.4]} center>
            <div className="bg-orange-100 px-3 py-2 rounded-lg shadow-lg font-semibold text-orange-800">
              Partition: {partitionValue}
            </div>
          </Html>
        </group>
      </group>
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

// String Palindrome Visualization Component
function StringPalindromeVisualization({ step, data }: { step: AnimationStep; data: any }) {
  // Handle different data formats from AI-generated JSON
  let originalString = ""
  let reversedString = ""
  let currentIndex = 0

  if (data) {
    if (typeof data.original === 'string') {
      originalString = data.original
    } else if (Array.isArray(data.original)) {
      originalString = data.original.map((char: any) => char.char || char).join('')
    }

    if (typeof data.reversed === 'string') {
      reversedString = data.reversed
    } else if (Array.isArray(data.reversed)) {
      reversedString = data.reversed.map((char: any) => char.char || char).join('')
    }

    currentIndex = data.currentIndex || data.i || 0
  }

  const originalChars = originalString.split('')
  const reversedChars = reversedString.split('')

  return (
    <group>
      {/* Algorithm title */}
      <Html position={[0, 8, 0]} center>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-2xl font-bold text-xl">
          🔄 Shortest Palindrome Algorithm
        </div>
      </Html>

      {/* Step indicator */}
      <Html position={[0, 6, 0]} center>
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
          <p className="text-gray-700 font-semibold">Step {step.step}: {step.title}</p>
        </div>
      </Html>

      {/* Original string visualization */}
      <group position={[-4, 2, 0]}>
        <Html position={[0, 1, 0]} center>
          <div className="bg-blue-100 px-3 py-1 rounded shadow font-semibold text-blue-800">
            Original String
          </div>
        </Html>

        {originalChars.map((char: string, index: number) => {
          const isActive = index === currentIndex
          const x = (index - originalChars.length / 2) * 1.2
          const y = 0
          const z = 0

          return (
            <group key={`orig-${index}`} position={[x, y, z]}>
              <Box args={[0.8, 0.8, 0.2]}>
                <meshStandardMaterial
                  color={isActive ? "#3b82f6" : "#ffffff"}
                  emissive={isActive ? "#1d4ed8" : "#000000"}
                  emissiveIntensity={isActive ? 0.2 : 0}
                />
              </Box>

              {/* Character label */}
              <Html position={[0, 0, 0.15]} center>
                <div className={`px-2 py-1 rounded shadow font-bold text-lg ${
                  isActive ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                }`}>
                  {char}
                </div>
              </Html>

              {/* Index label */}
              <Html position={[0, -0.6, 0.15]} center>
                <div className="text-xs text-gray-600 font-medium">[{index}]</div>
              </Html>

              {/* Active indicator */}
              {isActive && (
                <Sphere args={[0.1]} position={[0, 0.8, 0]}>
                  <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} />
                </Sphere>
              )}
            </group>
          )
        })}
      </group>

      {/* Reversed string visualization */}
      <group position={[-4, -2, 0]}>
        <Html position={[0, 1, 0]} center>
          <div className="bg-green-100 px-3 py-1 rounded shadow font-semibold text-green-800">
            Reversed String
          </div>
        </Html>

        {reversedChars.map((char: string, index: number) => {
          const isActive = index === currentIndex
          const x = (index - reversedChars.length / 2) * 1.2
          const y = 0
          const z = 0

          return (
            <group key={`rev-${index}`} position={[x, y, z]}>
              <Box args={[0.8, 0.8, 0.2]}>
                <meshStandardMaterial
                  color={isActive ? "#10b981" : "#ffffff"}
                  emissive={isActive ? "#047857" : "#000000"}
                  emissiveIntensity={isActive ? 0.2 : 0}
                />
              </Box>

              {/* Character label */}
              <Html position={[0, 0, 0.15]} center>
                <div className={`px-2 py-1 rounded shadow font-bold text-lg ${
                  isActive ? "bg-green-500 text-white" : "bg-gray-100 text-gray-800"
                }`}>
                  {char}
                </div>
              </Html>

              {/* Index label */}
              <Html position={[0, -0.6, 0.15]} center>
                <div className="text-xs text-gray-600 font-medium">[{index}]</div>
              </Html>

              {/* Active indicator */}
              {isActive && (
                <Sphere args={[0.1]} position={[0, 0.8, 0]}>
                  <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} />
                </Sphere>
              )}
            </group>
          )
        })}
      </group>

      {/* Comparison visualization */}
      {data?.s_slice && data?.reversed_slice && (
        <group position={[4, 0, 0]}>
          <Html position={[0, 2, 0]} center>
            <div className="bg-purple-100 px-4 py-2 rounded-lg shadow-lg font-semibold text-purple-800">
              String Comparison
            </div>
          </Html>

          {/* S prefix */}
          <Html position={[-2, 1, 0]} center>
            <div className="bg-blue-50 px-3 py-2 rounded shadow font-medium text-blue-800">
              S Prefix: "{data.s_slice}"
            </div>
          </Html>

          {/* Reversed suffix */}
          <Html position={[-2, -1, 0]} center>
            <div className="bg-green-50 px-3 py-2 rounded shadow font-medium text-green-800">
              Reversed Suffix: "{data.reversed_slice}"
            </div>
          </Html>

          {/* Match result */}
          <Html position={[2, 0, 0]} center>
            <div className={`px-4 py-2 rounded-lg shadow-lg font-bold text-lg ${
              data.s_slice === data.reversed_slice
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
              {data.s_slice === data.reversed_slice ? "✅ MATCH!" : "❌ NO MATCH"}
            </div>
          </Html>
        </group>
      )}

      {/* Result visualization */}
      {data?.result && (
        <group position={[0, -6, 0]}>
          <Box args={[8, 1, 0.5]}>
            <meshStandardMaterial color="#7c3aed" emissive="#5b21b6" emissiveIntensity={0.1} />
          </Box>
          <Html position={[0, 0, 0.3]} center>
            <div className="bg-purple-100 px-6 py-3 rounded-xl shadow-xl font-bold text-purple-800 text-xl">
              Shortest Palindrome: "{data.result}"
            </div>
          </Html>

          {/* Celebration particles */}
          <group>
            {Array.from({ length: 10 }, (_, i) => (
              <Sphere key={i} args={[0.05]} position={[
                (Math.random() - 0.5) * 6,
                Math.random() * 2,
                (Math.random() - 0.5) * 2
              ]}>
                <meshStandardMaterial
                  color={["#fbbf24", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"][i % 5]}
                  emissive={["#f59e0b", "#d97706", "#047857", "#1d4ed8", "#6d28d9"][i % 5]}
                  emissiveIntensity={0.5}
                />
              </Sphere>
            ))}
          </group>
        </group>
      )}

      {/* Processing indicator */}
      <group position={[6, 4, 0]}>
        <Sphere args={[0.3]}>
          <meshStandardMaterial color="#f59e0b" emissive="#d97706" emissiveIntensity={0.6} />
        </Sphere>
        <Html position={[0, 0, 0.4]} center>
          <div className="bg-orange-100 px-3 py-2 rounded-lg shadow-lg font-semibold text-orange-800">
            Processing Length: {currentIndex}
          </div>
        </Html>
      </group>
    </group>
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
    // Enhanced algorithm detection for AI-generated JSON
    if (algorithmId === "two-sum" || (steps.length > 0 && steps[0].data?.array)) {
      return <TwoSumVisualization step={currentStepData} data={currentStepData.data} />
    }
    if (algorithmId === "shortest-palindrome" || (steps.length > 0 && steps[0].data?.original !== undefined)) {
      return <StringPalindromeVisualization step={currentStepData} data={currentStepData.data} />
    }
    if (algorithmId === "reverse-integer" || (steps.length > 0 && steps[0].data?.original !== undefined)) {
      return <MathVisualization step={currentStepData} data={currentStepData.data} />
    }
    if (algorithmId.includes("partition") || (steps.length > 0 && steps[0].data?.lessHead)) {
      return <LinkedListVisualization step={currentStepData} data={currentStepData.data} />
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
