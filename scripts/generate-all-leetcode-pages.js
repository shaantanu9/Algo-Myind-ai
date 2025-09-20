#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { LeetCodeParser } = require('../lib/leetcode-parser');

const BASE_PATH = path.join(__dirname, '..', 'LeetCodeAnimation-master');
const OUTPUT_DIR = path.join(__dirname, '..', 'app', 'algorithm');

async function generateAllPages() {
  console.log('🚀 Starting Complete LeetCode Page Generation...');

  const parser = new LeetCodeParser(BASE_PATH);

  try {
    // Parse all problems
    console.log('📖 Parsing all LeetCode problems...');
    const problems = await parser.parseAllProblems();
    console.log(`✅ Found ${problems.length} problems to process`);

    // Generate pages for all problems
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < problems.length; i++) {
      const problem = problems[i];

      try {
        await generatePageForProblem(problem, parser);
        successCount++;
        console.log(`✅ Generated page for: ${problem.title} (${problem.number}) - ${successCount}/${problems.length}`);
      } catch (error) {
        console.warn(`❌ Failed to generate page for ${problem.title}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\n🎉 Generation completed!`);
    console.log(`✅ Successfully generated: ${successCount} pages`);
    console.log(`❌ Failed: ${errorCount} pages`);

    // Save complete algorithm data
    await saveCompleteAlgorithmData(problems, parser);

  } catch (error) {
    console.error('❌ Error in generation:', error);
  }
}

async function generatePageForProblem(problem, parser) {
  const algorithmData = await parser.generateAlgorithmJSON(problem);

  // Create directory structure
  const problemDir = path.join(OUTPUT_DIR, algorithmData.id);

  // Ensure directory exists
  if (!fs.existsSync(problemDir)) {
    fs.mkdirSync(problemDir, { recursive: true });
  }

  // Generate layout.tsx
  const layoutContent = `import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${algorithmData.title} | DSA Learning App',
  description: '${algorithmData.description.substring(0, 160)}...',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}`;

  // Generate page.tsx
  const pageContent = `'use client'

import { AlgorithmDetailPage } from '@/components/algorithm-detail-page'

const algorithmData = ${JSON.stringify(algorithmData, null, 2)}

export default function Page() {
  return <AlgorithmDetailPage algorithm={algorithmData} />
}`;

  // Write files
  fs.writeFileSync(path.join(problemDir, 'layout.tsx'), layoutContent);
  fs.writeFileSync(path.join(problemDir, 'page.tsx'), pageContent);
}

async function saveCompleteAlgorithmData(problems, parser) {
  const allData = {};
  for (const problem of problems) {
    try {
      const algorithmData = await parser.generateAlgorithmJSON(problem);
      allData[algorithmData.id] = algorithmData;
    } catch (error) {
      console.warn(`Failed to generate data for ${problem.title}:`, error);
    }
  }

  const outputPath = path.join(__dirname, '..', 'lib', 'complete-leetcode-algorithms-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
  console.log('💾 Saved complete algorithm data to JSON file');

  // Also create a summary file
  const summary = {
    totalProblems: problems.length,
    generatedAt: new Date().toISOString(),
    categories: {},
    difficulties: {},
    features: {}
  };

  // Calculate statistics
  for (const problem of problems) {
    const algorithmData = await parser.generateAlgorithmJSON(problem);

    // Category stats
    summary.categories[algorithmData.category] = (summary.categories[algorithmData.category] || 0) + 1;

    // Difficulty stats
    summary.difficulties[algorithmData.difficulty] = (summary.difficulties[algorithmData.difficulty] || 0) + 1;

    // Feature completeness
    summary.features.hasExamples = (summary.features.hasExamples || 0) + (algorithmData.examples?.length > 0 ? 1 : 0);
    summary.features.hasKeyInsights = (summary.features.hasKeyInsights || 0) + (algorithmData.keyInsights?.length > 0 ? 1 : 0);
    summary.features.hasImplementations = (summary.features.hasImplementations || 0) + (Object.keys(algorithmData.implementations || {}).length > 0 ? 1 : 0);
    summary.features.hasAnimationStates = (summary.features.hasAnimationStates || 0) + (algorithmData.animationStates?.length > 0 ? 1 : 0);
  }

  const summaryPath = path.join(__dirname, '..', 'lib', 'leetcode-generation-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  console.log('📊 Saved generation summary');
}

// Run the complete generation
if (require.main === module) {
  generateAllPages();
}

module.exports = { generateAllPages };
