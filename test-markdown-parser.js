const fs = require('fs');
const path = require('path');

// Simple markdown parser test
function testMarkdownParser() {
  try {
    const markdownPath = path.join(__dirname, 'algorithms', 'two-sum.md');

    if (!fs.existsSync(markdownPath)) {
      console.error('❌ Two Sum markdown file not found at:', markdownPath);
      return;
    }

    const content = fs.readFileSync(markdownPath, 'utf-8');
    console.log('✅ Successfully read markdown file');
    console.log('File size:', content.length, 'characters');

    // Basic parsing test
    const lines = content.split('\n');
    console.log('Total lines:', lines.length);

    // Check for key sections
    const hasBasicInfo = content.includes('## Basic Information');
    const hasExamples = content.includes('## Examples');
    const hasAnimationStates = content.includes('## Animation States');
    const hasImplementations = content.includes('## Implementations');

    console.log('✅ Basic Information section:', hasBasicInfo);
    console.log('✅ Examples section:', hasExamples);
    console.log('✅ Animation States section:', hasAnimationStates);
    console.log('✅ Implementations section:', hasImplementations);

    // Extract basic info
    const idMatch = content.match(/- \*\*ID\*\*: (.+)/);
    const titleMatch = content.match(/- \*\*Title\*\*: (.+)/);
    const difficultyMatch = content.match(/- \*\*Difficulty\*\*: (.+)/);

    console.log('📋 Parsed Basic Info:');
    console.log('   ID:', idMatch ? idMatch[1] : 'Not found');
    console.log('   Title:', titleMatch ? titleMatch[1] : 'Not found');
    console.log('   Difficulty:', difficultyMatch ? difficultyMatch[1] : 'Not found');

    // Check animation states
    const animationStatesMatch = content.match(/## Animation States \([^)]*\)([^#]*)/s);
    if (animationStatesMatch) {
      const animationContent = animationStatesMatch[1];
      const totalSteps = (animationContent.match(/#### Step \d+:/g) || []).length;
      console.log('🎬 Total Animation Steps:', totalSteps);
      console.log('Animation content length:', animationContent.length);

      // Check different animation types by splitting content
      const parts = animationContent.split('### ');
      const d3Section = parts.find(p => p.startsWith('D3 Animation States'));
      const d3Steps = d3Section ? (d3Section.match(/#### Step \d+:/g) || []).length : 0;

      const reactFlowSection = parts.find(p => p.startsWith('React Flow Animation States'));
      const reactFlowSteps = reactFlowSection ? (reactFlowSection.match(/#### Step \d+:/g) || []).length : 0;

      const threeSection = parts.find(p => p.startsWith('Three.js Animation States'));
      const threeSteps = threeSection ? (threeSection.match(/#### Step \d+:/g) || []).length : 0;

      console.log('   D3 Steps:', d3Steps);
      console.log('   React Flow Steps:', reactFlowSteps);
      console.log('   Three.js Steps:', threeSteps);
    }

    console.log('🎉 Markdown file structure looks good!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMarkdownParser();
