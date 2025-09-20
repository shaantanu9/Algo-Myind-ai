#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { LeetCodeParser } = require('../lib/leetcode-parser');

const BASE_PATH = path.join(__dirname, '..', 'LeetCodeAnimation-master');
const OUTPUT_DIR = path.join(__dirname, '..', 'app', 'algorithm');

async function generatePages() {
  console.log('🚀 Starting LeetCode page generation...');

  const parser = new LeetCodeParser(BASE_PATH);

  try {
    // Parse all problems
    console.log('📖 Parsing LeetCode problems...');
    const problems = await parser.parseAllProblems();
    console.log(`✅ Found ${problems.length} problems`);

    // Generate pages for each problem
    for (const problem of problems.slice(0, 10)) { // Process first 10 for testing
      await generatePageForProblem(problem, parser);
    }

    console.log('🎉 Page generation completed!');

  } catch (error) {
    console.error('❌ Error generating pages:', error);
  }
}

async function generatePageForProblem(problem, parser) {
  const algorithmData = await parser.generateAlgorithmJSON(problem);

  // Create directory structure
  const problemDir = path.join(OUTPUT_DIR, algorithmData.id);
  const layoutPath = path.join(problemDir, 'layout.tsx');
  const pagePath = path.join(problemDir, 'page.tsx');

  // Ensure directory exists
  if (!fs.existsSync(problemDir)) {
    fs.mkdirSync(problemDir, { recursive: true });
  }

  // Generate layout.tsx
  const safeTitle = (algorithmData.title || 'Algorithm').replace(/'/g, "\\'");
  const safeDescription = (algorithmData.description || 'Learn this algorithm step by step')
    .replace(/'/g, "\\'")
    .replace(/\n/g, ' ')
    .substring(0, 150);

  const layoutContent = `import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '${safeTitle} | DSA Learning App',
  description: '${safeDescription}...',
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
  fs.writeFileSync(layoutPath, layoutContent);
  fs.writeFileSync(pagePath, pageContent);

  console.log(`✅ Generated page for: ${algorithmData.title} (${algorithmData.id})`);
}

// Save algorithm data to JSON file for reference
async function saveAlgorithmData() {
  const parser = new LeetCodeParser(BASE_PATH);
  const problems = await parser.parseAllProblems();

  const allData = {};
  for (const problem of problems.slice(0, 10)) {
    const algorithmData = await parser.generateAlgorithmJSON(problem);
    allData[algorithmData.id] = algorithmData;
  }

  const outputPath = path.join(__dirname, '..', 'lib', 'leetcode-algorithms-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
  console.log('💾 Saved algorithm data to JSON file');
}

// Run the generation
if (require.main === module) {
  generatePages().then(() => {
    return saveAlgorithmData();
  });
}

module.exports = { generatePages, saveAlgorithmData };
