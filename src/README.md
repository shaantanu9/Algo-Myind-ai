# DSA Learning App - Source Code Structure

## 📁 Directory Structure

```
src/
├── api/                    # API routes and endpoints
│   ├── ai-explanation/     # AI-powered explanations
│   ├── analyze-js/         # JavaScript code analysis & markdown generation
│   ├── generate-page/      # Dynamic page generation
│   └── upload-js/          # File upload handling
├── components/             # React components
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   ├── *-animation.tsx     # Animation visualization components
│   ├── *-modal.tsx         # Modal components
│   └── algorithm-detail-page.tsx  # Main algorithm display
├── lib/                    # Utility libraries and core logic
│   ├── animation-*/        # Animation system components
│   ├── *-parser.ts         # Data parsing utilities
│   ├── *-loader.ts         # Data loading utilities
│   └── local-storage-manager.ts  # Client-side persistence
├── types/                  # TypeScript type definitions
│   └── algorithm.ts        # Core algorithm interfaces
├── constants/              # Application constants and config
├── prompts/                # AI prompt templates
├── algorithms/             # Generated algorithm markdown files
└── utils/                  # Helper functions and utilities
```

## 🚀 Key Features

### AI-Powered Algorithm Analysis
- **Upload JavaScript files** via `/upload-js`
- **Automatic analysis** using OpenAI GPT-4
- **Markdown generation** with comprehensive educational content
- **Animation data creation** for D3, React Flow, and Three.js

### Comprehensive Educational Content
- **Algorithm analogies** with visual aids
- **Real-world applications** across different domains
- **Engineering lessons** teaching system design principles
- **Performance analysis** with complexity breakdowns
- **Testing scenarios** covering edge cases

### Multi-Library Animation System
- **D3.js**: Array and data structure visualizations
- **React Flow**: Interactive node-link diagrams
- **Three.js**: 3D algorithm animations
- **Mermaid**: Study notes and flowcharts

## 🔧 Development Workflow

### Adding New Algorithms
1. **Upload JavaScript file** to `/upload-js`
2. **AI analyzes code** and generates markdown
3. **Markdown saved** to `src/algorithms/`
4. **Page automatically available** at `/algorithm/[id]`

### File Organization
- **API routes**: `src/api/` - Next.js API routes
- **Components**: `src/components/` - React components
- **Libraries**: `src/lib/` - Core utilities and parsers
- **Types**: `src/types/` - TypeScript definitions
- **Constants**: `src/constants/` - Configuration
- **Prompts**: `src/prompts/` - AI prompt templates
- **Algorithms**: `src/algorithms/` - Generated content

## 📊 Data Flow

```
JavaScript Upload
        ↓
AI Analysis (GPT-4)
        ↓
Markdown Generation
        ↓
File Storage (src/algorithms/)
        ↓
Parser Processing
        ↓
Algorithm Display (/algorithm/[id])
```

## 🎯 Architecture Benefits

- **Scalable**: Easy to add new algorithms and features
- **Modular**: Clear separation of concerns
- **Type-safe**: Full TypeScript coverage
- **AI-powered**: Automated content generation
- **Educational**: Rich learning materials
- **Interactive**: Multiple visualization options

## 🛠️ Technologies Used

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Animations**: D3.js, React Flow, Three.js, Mermaid
- **AI**: OpenAI GPT-4
- **State**: React hooks, local storage
- **Build**: Next.js with custom path mapping

## 📝 API Endpoints

- `POST /api/analyze-js` - Analyze JS code and generate markdown
- `POST /api/ai-explanation` - Get AI-powered explanations
- `POST /api/generate-page` - Generate algorithm pages
- `POST /api/upload-js` - Handle file uploads

## 🔄 Build & Development

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🎨 Component Architecture

- **AlgorithmDetailPage**: Main algorithm display with tabs
- **Animation Components**: Library-specific visualizations
- **Modal Components**: AI explanations and export functionality
- **UI Components**: Reusable design system components

## 📚 Content Structure

Each algorithm markdown file contains:
- Basic information (difficulty, complexity, etc.)
- Problem statement and examples
- Educational content (analogies, applications, lessons)
- Implementation details (brute force, optimized)
- Animation data for all visualization libraries
- Testing scenarios and performance analysis
