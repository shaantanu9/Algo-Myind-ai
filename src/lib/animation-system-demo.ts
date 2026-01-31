/**
 * Animation System Demo
 * Complete demonstration of the comprehensive animation system
 */

import { AnimationTiming, ColorSystem } from './animation-core'
import { AnimationFrameGenerator } from './data-transformers'
import { VisualGeneratorFactory } from './visual-generators'
import { SequenceBuilder, ComplexAnimations, timelineManager } from './animation-composers'
import { AlgorithmPresetFactory } from './animation-presets'
import { AlgorithmTemplateFactory, TwoSumTemplate } from './algorithm-templates'
import { AnimationOptimizer, QualityManager } from './animation-optimizer'

// Demo: Complete Two Sum Algorithm Animation
export function demonstrateTwoSumAnimation() {
  console.log('🎯 Two Sum Animation Demo')

  // Step 1: Generate algorithm frames
  const algorithmData = {
    array: [2, 7, 11, 15],
    target: 9,
    hashMap: {},
    complement: undefined,
    found: false,
    result: undefined
  }

  const frames = AnimationFrameGenerator.createFrames(algorithmData, 'two-sum')
  console.log('📊 Generated', frames.length, 'animation frames')

  // Step 2: Create visual representations for different types
  const visualTypes = ['mermaid', 'reactflow', 'd3', 'three'] as const

  visualTypes.forEach(type => {
    const visualData = VisualGeneratorFactory.generateVisuals(type, algorithmData, [])
    console.log(`🎨 ${type.toUpperCase()} Visual Data:`, visualData)
  })

  // Step 3: Use animation preset
  const preset = AlgorithmPresetFactory.getPreset('two-sum')
  if (preset) {
    console.log('🎭 Using Animation Preset:', preset.name)
    console.log('🎪 Sequences Available:', Object.keys(preset.sequences))
  }

  // Step 4: Create custom animation sequence
  const customSequence = SequenceBuilder.create()
    .addStep('intro', ['algorithm-title'], [{
      property: 'opacity',
      from: 0,
      to: 1,
      duration: 500,
      easing: 'cubic'
    }], 500)
    .addDelay(200)
    .addStep('show-data', ['array', 'target'], [{
      property: 'position',
      from: { x: -100, y: 0 },
      to: { x: 0, y: 0 },
      duration: 600,
      easing: 'elastic'
    }], 600)
    .addDelay(300)
    .addStep('processing', ['current-element', 'hash-map'], [{
      property: 'scale',
      from: { x: 1, y: 1, z: 1 },
      to: { x: 1.2, y: 1.2, z: 1.2 },
      duration: 400,
      easing: 'bounce'
    }], 400)
    .build('two-sum-demo', false)

  console.log('🎬 Custom Sequence Created:', customSequence.id)

  // Step 5: Optimize for performance
  QualityManager.setQualityLevel('high')
  const optimizedSettings = QualityManager.getOptimalSettings()
  console.log('⚡ Performance Settings:', optimizedSettings)

  return {
    frames,
    preset,
    customSequence,
    optimizedSettings
  }
}

// Demo: Complex Animation Composition
export function demonstrateAnimationComposition() {
  console.log('🎭 Animation Composition Demo')

  // Create multiple sequences
  const introSequence = ComplexAnimations.algorithmIntroduction(['title', 'data'])
  const processingSequence = SequenceBuilder.create()
    .addStep('process-1', ['element-1'], [{ property: 'opacity', from: 0, to: 1, duration: 300 }], 300)
    .addStep('process-2', ['element-2'], [{ property: 'scale', from: 0.5, to: 1, duration: 400 }], 400)
    .addStep('process-3', ['element-3'], [{ property: 'position', from: { x: 100 }, to: { x: 0 }, duration: 500 }], 500)
    .build('processing', false)

  const conclusionSequence = ComplexAnimations.successCelebration(['result'])

  // Create timeline with all sequences
  const timeline = timelineManager.createTimeline('complex-demo', [
    introSequence,
    processingSequence,
    conclusionSequence
  ])

  console.log('🎪 Complex Timeline Created:', timeline.sequences.length, 'sequences')

  // Play the timeline
  timelineManager.playTimeline('complex-demo')
  console.log('▶️ Timeline Started')

  return timeline
}

// Demo: Algorithm Template Usage
export function demonstrateAlgorithmTemplates() {
  console.log('📚 Algorithm Templates Demo')

  // Get template
  const template = AlgorithmTemplateFactory.getTemplate('two-sum')
  if (!template) {
    console.error('❌ Template not found')
    return null
  }

  console.log('📋 Template:', template.name)
  console.log('📊 Complexity:', template.timeComplexity, 'time,', template.spaceComplexity, 'space')
  console.log('🎨 Default Visualization:', template.defaultVisualization)
  console.log('💡 Key Insights:', template.keyInsights.length)
  console.log('⚠️ Common Mistakes:', template.commonMistakes.length)
  console.log('🚀 Optimization Tips:', template.optimizationTips.length)

  // Create animation from template
  const sampleData = {
    array: [3, 2, 4],
    target: 6,
    currentIndex: 1,
    hashMap: { 3: 0, 2: 1 },
    complement: 4,
    found: true,
    result: [1, 2]
  }

  const animation = AlgorithmTemplateFactory.createAnimationForAlgorithm('two-sum', sampleData)
  console.log('🎬 Animation Created:', animation.frames.length, 'frames')

  // Get educational content
  const educationalContent = AlgorithmTemplateFactory.getEducationalContent('two-sum')
  console.log('🎓 Educational Content Available:', !!educationalContent)

  return {
    template,
    animation,
    educationalContent
  }
}

// Demo: Performance Optimization
export function demonstratePerformanceOptimization() {
  console.log('⚡ Performance Optimization Demo')

  // Get current performance metrics
  const metrics = AnimationOptimizer.getPerformanceMetrics()
  console.log('📈 Current Metrics:', metrics)

  // Test different quality levels
  const qualityLevels = ['low', 'medium', 'high', 'ultra'] as const

  qualityLevels.forEach(level => {
    QualityManager.setQualityLevel(level)
    const settings = QualityManager.getOptimalSettings()
    console.log(`🎯 ${level.toUpperCase()} Quality Settings:`, {
      maxFPS: settings.maxFPS,
      enableLOD: settings.enableLOD,
      enableCulling: settings.enableCulling,
      enablePooling: settings.enablePooling
    })
  })

  // Enable adaptive quality
  QualityManager.enableAdaptiveQuality(true)
  console.log('🔄 Adaptive Quality Enabled')

  return {
    metrics,
    qualityLevels: qualityLevels.map(level => ({
      level,
      settings: QualityManager.getOptimalSettings()
    }))
  }
}

// Demo: Color System Usage
export function demonstrateColorSystem() {
  console.log('🎨 Color System Demo')

  const palettes = ['algorithm', 'data', 'process'] as const

  palettes.forEach(paletteType => {
    const palette = ColorSystem.getPalette(paletteType)
    console.log(`🎨 ${paletteType.toUpperCase()} Palette:`, palette)

    // Generate gradient
    const gradient = ColorSystem.generateGradient([
      palette.primary,
      palette.secondary,
      palette.accent
    ], 5)

    console.log(`🌈 ${paletteType} Gradient:`, gradient)

    // Interpolate colors
    const interpolated = ColorSystem.interpolateColor(
      palette.primary,
      palette.success,
      0.5
    )
    console.log(`🔄 ${paletteType} Interpolation:`, interpolated)
  })

  return { palettes }
}

// Demo: Timing and Easing
export function demonstrateTimingAndEasing() {
  console.log('⏱️ Timing & Easing Demo')

  const easings = ['cubic', 'elastic', 'bounce'] as const

  easings.forEach(easing => {
    const timingFunction = AnimationTiming.createTimingFunction(easing)

    // Test at different progress points
    const testPoints = [0, 0.25, 0.5, 0.75, 1]
    const results = testPoints.map(t => ({
      input: t,
      output: Math.round(timingFunction(t) * 100) / 100
    }))

    console.log(`📈 ${easing.toUpperCase()} Easing:`, results)
  })

  return { easings }
}

// Main Demo Runner
export function runCompleteAnimationDemo() {
  console.log('🚀 Complete Animation System Demo')
  console.log('=' .repeat(50))

  try {
    // Run all demos
    const results = {
      twoSum: demonstrateTwoSumAnimation(),
      composition: demonstrateAnimationComposition(),
      templates: demonstrateAlgorithmTemplates(),
      performance: demonstratePerformanceOptimization(),
      colors: demonstrateColorSystem(),
      timing: demonstrateTimingAndEasing()
    }

    console.log('=' .repeat(50))
    console.log('✅ All Animation Demos Completed Successfully!')
    console.log('🎯 Animation System Ready for Production Use')

    return results

  } catch (error) {
    console.error('❌ Demo Error:', error)
    return null
  }
}

// Export for external usage
export const AnimationDemos = {
  twoSum: demonstrateTwoSumAnimation,
  composition: demonstrateAnimationComposition,
  templates: demonstrateAlgorithmTemplates,
  performance: demonstratePerformanceOptimization,
  colors: demonstrateColorSystem,
  timing: demonstrateTimingAndEasing,
  complete: runCompleteAnimationDemo
}
