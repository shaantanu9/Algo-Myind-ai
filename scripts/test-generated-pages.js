#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', 'app', 'algorithm');

function testGeneratedPages() {
  console.log('🧪 Testing Generated LeetCode Pages...\n');

  // Get all algorithm directories
  const algorithmDirs = fs.readdirSync(BASE_DIR).filter(dir =>
    fs.statSync(path.join(BASE_DIR, dir)).isDirectory() &&
    dir.startsWith('leetcode-')
  );

  console.log(`📂 Found ${algorithmDirs.length} generated algorithm pages\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const dir of algorithmDirs) {
    console.log(`🔍 Testing ${dir}...`);

    const pagePath = path.join(BASE_DIR, dir, 'page.tsx');
    const layoutPath = path.join(BASE_DIR, dir, 'layout.tsx');

    try {
      // Check if files exist
      if (!fs.existsSync(pagePath)) {
        throw new Error(`page.tsx not found in ${dir}`);
      }
      if (!fs.existsSync(layoutPath)) {
        throw new Error(`layout.tsx not found in ${dir}`);
      }

      // Read and validate page.tsx
      const pageContent = fs.readFileSync(pagePath, 'utf-8');

      // Check for required imports
      if (!pageContent.includes("import { AlgorithmDetailPage }")) {
        throw new Error('Missing AlgorithmDetailPage import');
      }

      // Check for algorithm data
      if (!pageContent.includes('const algorithmData = {')) {
        throw new Error('Missing algorithm data');
      }

      // Check for required fields
      const requiredFields = [
        '"id":',
        '"title":',
        '"difficulty":',
        '"category":',
        '"examples":',
        '"implementations":'
      ];

      for (const field of requiredFields) {
        if (!pageContent.includes(field)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Read and validate layout.tsx
      const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

      // Check for metadata export
      if (!layoutContent.includes('export const metadata:')) {
        throw new Error('Missing metadata export in layout');
      }

      console.log(`  ✅ ${dir} - All checks passed`);
      successCount++;

    } catch (error) {
      console.log(`  ❌ ${dir} - ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Test Results:`);
  console.log(`  ✅ Successful: ${successCount}`);
  console.log(`  ❌ Errors: ${errorCount}`);
  console.log(`  📈 Success Rate: ${((successCount / (successCount + errorCount)) * 100).toFixed(1)}%`);

  if (errorCount === 0) {
    console.log('\n🎉 All tests passed! Pages are ready for production.');
  } else {
    console.log('\n⚠️  Some issues found. Please review the errors above.');
  }

  return errorCount === 0;
}

function generateSummaryReport() {
  console.log('\n📋 Generation Summary Report');
  console.log('=' * 50);

  const dataPath = path.join(__dirname, '..', 'lib', 'leetcode-algorithms-data.json');

  if (fs.existsSync(dataPath)) {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const algorithms = Object.values(data);

    console.log(`📊 Total Algorithms Processed: ${algorithms.length}`);

    // Category breakdown
    const categories = {};
    algorithms.forEach(algo => {
      categories[algo.category] = (categories[algo.category] || 0) + 1;
    });

    console.log('\n📂 Category Breakdown:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });

    // Difficulty breakdown
    const difficulties = {};
    algorithms.forEach(algo => {
      difficulties[algo.difficulty] = (difficulties[algo.difficulty] || 0) + 1;
    });

    console.log('\n🎯 Difficulty Breakdown:');
    Object.entries(difficulties).forEach(([difficulty, count]) => {
      console.log(`  ${difficulty}: ${count}`);
    });

    // Features completeness
    const features = {
      hasExamples: algorithms.filter(a => a.examples && a.examples.length > 0).length,
      hasKeyInsights: algorithms.filter(a => a.keyInsights && a.keyInsights.length > 0).length,
      hasImplementations: algorithms.filter(a => a.implementations && Object.keys(a.implementations).length > 0).length,
      hasAnimationStates: algorithms.filter(a => a.animationStates && a.animationStates.length > 0).length
    };

    console.log('\n✨ Feature Completeness:');
    Object.entries(features).forEach(([feature, count]) => {
      const percentage = ((count / algorithms.length) * 100).toFixed(1);
      console.log(`  ${feature}: ${count}/${algorithms.length} (${percentage}%)`);
    });

  } else {
    console.log('❌ Algorithm data file not found');
  }
}

// Run tests
const success = testGeneratedPages();
generateSummaryReport();

if (!success) {
  process.exit(1);
}
