# Complete Upload JS to Markdown Flow Documentation

## Architecture Overview

```
┌─────────────────┐
│  Upload JS File │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ 1. /api/upload-js           │
│    - Validate file          │
│    - Extract metadata       │
│    - Save to temp/          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ 2. /api/analyze-js          │
│    - Read enhanced prompt   │
│    - Call GPT-4o API        │
│    - Generate markdown      │
│    - Save to src/algorithms/│
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ 3. /api/algorithms          │
│    - Parse markdown files   │
│    - Return algorithm data  │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ 4. Homepage Display         │
│    - Infinite scroll        │
│    - Search & filter        │
│    - Algorithm cards        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ 5. Detail Page              │
│    - /algorithm/[id]        │
│    - Full visualization     │
│    - Interactive animations │
└─────────────────────────────┘
```

## Detailed Flow Steps

### Step 1: Upload JS File
**Endpoint:** `POST /api/upload-js`

**Input:**
- Multipart form data with JavaScript file

**Process:**
1. Validate file extension (.js)
2. Extract problem ID from filename (e.g., `0003-` → `3`)
3. Extract algorithm slug (e.g., `longest-substring-without-repeating-characters`)
4. Read file content
5. Save to `temp/` directory with timestamp

**Output:**
```json
{
  "success": true,
  "fileName": "0003-longest-substring-without-repeating-characters.js",
  "filePath": "/path/to/temp/timestamp-filename.js",
  "content": "var lengthOfLongestSubstring = function(s) {...}",
  "problemId": 3,
  "algorithmSlug": "longest-substring-without-repeating-characters",
  "size": 577
}
```

### Step 2: AI Analysis & Markdown Generation
**Endpoint:** `POST /api/analyze-js`

**Input:**
```json
{
  "fileName": "0003-longest-substring-without-repeating-characters.js",
  "fileContent": "var lengthOfLongestSubstring = function(s) {...}",
  "filePath": "/path/to/temp/file.js"
}
```

**Process:**
1. **Read Enhanced Prompt Template**
   - Location: `src/prompts/enhanced-algorithm-prompt.md`
   - Contains instructions for GPT-4o to analyze code

2. **Replace Placeholders**
   - `{CODE}` → Actual JavaScript code
   - `{FILENAME}` → Original filename
   - `{PROBLEM_ID}` → Extracted problem ID
   - `{ALGORITHM_SLUG}` → Algorithm slug

3. **Call OpenAI GPT-4o API**
   - Model: `gpt-4o` (more accurate than gpt-4o-mini)
   - Temperature: `0.2` (more focused and consistent)
   - Max tokens: `6000` (enough for complete markdown)
   
4. **AI Analyzes Code**
   - Identifies function name (e.g., `lengthOfLongestSubstring`)
   - Maps to algorithm name ("Longest Substring Without Repeating Characters")
   - Analyzes data structures (map/object, reduce function)
   - Identifies pattern (sliding window)
   - Calculates complexity (O(n) time, O(n) space)

5. **Generate Complete Markdown**
   - Full problem statement
   - Multiple examples
   - Creative analogy
   - Key insights
   - Real-world applications
   - Step-by-step animations (D3, React Flow, Three.js)
   - Testing scenarios
   - Performance analysis
   - Related algorithms

6. **Save Markdown File**
   - Location: `src/algorithms/[algorithm-slug].md`
   - Example: `src/algorithms/longest-substring-without-repeating-characters.md`

**Output:**
```json
{
  "success": true,
  "markdown": "# Longest Substring Without Repeating Characters Algorithm\n\n...",
  "message": "Markdown documentation generated and saved successfully"
}
```

### Step 3: Algorithm API Parsing
**Endpoint:** `GET /api/algorithms?action=all`

**Process:**
1. **Scan Algorithms Directory**
   - Read all `.md` files from `src/algorithms/`
   - Use `MarkdownParser` class

2. **Parse Each Markdown File**
   - Extract Basic Information section
   - Parse Problem Statement
   - Extract Examples
   - Parse Analogy
   - Extract Key Insights
   - Parse Implementations (code blocks)
   - Extract Animation States (D3, React Flow, Three.js JSON)
   - Parse Educational Content
   - Extract Testing Scenarios
   - Parse Performance Analysis
   - Extract Metadata

3. **Transform to JSON**
   - Convert markdown to structured `AlgorithmData` objects
   - Validate all required fields
   - Handle optional fields (analogy, animations)

**Output:**
```json
{
  "success": true,
  "data": [
    {
      "id": "longest-substring-without-repeating-characters",
      "title": "Longest Substring Without Repeating Characters",
      "description": "Find the length of the longest substring without repeating characters",
      "difficulty": "Medium",
      "category": "String",
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(n)",
      "examples": [...],
      "implementations": {
        "optimized": {
          "code": "var lengthOfLongestSubstring = function(s) {...}",
          "timeComplexity": "O(n)",
          "spaceComplexity": "O(n)"
        }
      },
      "animationStates": [...]
    }
  ],
  "total": 3
}
```

### Step 4: Homepage Display
**Component:** `src/components/algorithm-discovery.tsx`

**Process:**
1. **Initial Load**
   - `useAlgorithmLoader` hook fetches from `/api/algorithms`
   - Loads first batch (12 algorithms)
   - Caches results for 5 minutes

2. **Display Algorithm Cards**
   - Show title, description, difficulty badge
   - Display category, complexity info
   - Show popularity and estimated time

3. **Infinite Scroll**
   - `useIntersectionInfiniteScroll` hook detects scroll
   - Loads next batch when near bottom
   - Smooth loading indicator

4. **Search & Filter**
   - `useAlgorithmFilters` hook manages queries
   - Real-time search across title, description, insights
   - Filter by category (Array, String, Tree, etc.)
   - Filter by difficulty (Easy, Medium, Hard)
   - Debounced search (300ms)

**Features:**
- ✅ Responsive grid layout
- ✅ Loading states with spinners
- ✅ Error handling with retry
- ✅ "Load More" button as fallback
- ✅ Algorithm count display
- ✅ Smooth animations

### Step 5: Detail Page
**Route:** `/algorithm/[id]`
**Component:** `app/algorithm/[id]/page.tsx`

**Process:**
1. **Dynamic Route**
   - URL: `/algorithm/longest-substring-without-repeating-characters`
   - Matches markdown file ID

2. **Load Algorithm Data**
   - Either from API or direct markdown parsing
   - Includes all sections from markdown

3. **Render Components**
   - `AlgorithmDetailPage` component
   - Tabbed interface for different visualization types
   - Code editor with syntax highlighting
   - Interactive animations

**Features:**
- ✅ Problem statement with examples
- ✅ Multiple code implementations
- ✅ D3.js visualizations
- ✅ React Flow diagrams
- ✅ Three.js 3D animations
- ✅ Step-by-step playback controls
- ✅ Educational content and tips

## Key Files & Locations

### API Routes
```
app/api/
├── upload-js/
│   └── route.ts          # File upload handler
├── analyze-js/
│   └── route.ts          # AI analysis & markdown generation
├── algorithms/
│   └── route.ts          # Markdown parsing & data API
└── generate-page/
    └── route.ts          # Dynamic page generation (optional)
```

### Algorithm Storage
```
src/algorithms/
├── two-sum.md
├── longest-substring-without-repeating-characters.md
├── longest-palindromic-substring.md
└── [new-algorithm].md   # New uploads go here
```

### Prompts
```
src/prompts/
├── enhanced-algorithm-prompt.md    # Main AI prompt (USE THIS)
└── algorithm-markdown-prompt.md    # Old prompt (deprecated)
```

### Components
```
src/components/
├── algorithm-discovery.tsx         # Homepage with infinite scroll
└── algorithm-detail-page.tsx       # Detail page component
```

### Hooks
```
src/hooks/
└── use-infinite-scroll.ts          # Infinite scroll logic
```

### Libraries
```
src/lib/
├── markdown-parser.ts              # Parse markdown to JSON
├── algorithm-loader.ts             # Load algorithms with caching
└── algorithm-animation-generator.ts # Generate animations
```

## Data Flow Summary

1. **Upload** → `temp/timestamp-filename.js`
2. **AI Analysis** → `src/algorithms/algorithm-slug.md`
3. **API Parsing** → JSON from markdown
4. **Homepage** → Display cards with infinite scroll
5. **Detail Page** → Full visualization

## Testing the Complete Flow

### 1. Upload a File
```bash
curl -X POST http://localhost:3000/api/upload-js \
  -F "file=@leetcode-javascript-1-master/solutions/0003-longest-substring-without-repeating-characters.js"
```

### 2. Trigger AI Analysis (Automatic in UI)
```bash
curl -X POST http://localhost:3000/api/analyze-js \
  -H "Content-Type: application/json" \
  -d '{"fileName":"0003-longest-substring-without-repeating-characters.js","fileContent":"...","filePath":"..."}'
```

### 3. Check Algorithm API
```bash
curl http://localhost:3000/api/algorithms?action=all
```

### 4. Visit Homepage
```
http://localhost:3000
```

### 5. View Detail Page
```
http://localhost:3000/algorithm/longest-substring-without-repeating-characters
```

## Configuration

### OpenAI Settings
```typescript
model: "gpt-4o"           // Use GPT-4o for accuracy
temperature: 0.2          // Low temperature for consistency
max_tokens: 6000          // Enough for complete markdown
```

### Caching
```typescript
cacheTimeout: 5 * 60 * 1000  // 5 minutes
batchSize: 12                 // Load 12 at a time
```

### Infinite Scroll
```typescript
rootMargin: '200px'      // Start loading 200px before bottom
threshold: 0.1           // Trigger at 10% visibility
```

## Success Criteria

✅ **Upload works** - File uploads successfully
✅ **AI analyzes correctly** - Identifies algorithm from function name
✅ **Markdown generated** - Complete, accurate documentation
✅ **File saved** - Markdown saved to correct location
✅ **API loads** - Algorithms API returns new algorithm
✅ **Homepage shows** - New algorithm appears in list
✅ **Detail page works** - Full visualization available
✅ **Search works** - Can find new algorithm
✅ **Animations work** - D3, React Flow, Three.js render

## Troubleshooting

### AI generates wrong algorithm
- Check function name extraction
- Verify prompt is using enhanced version
- Increase temperature slightly (0.3)
- Use GPT-4o instead of gpt-4o-mini

### Markdown not parsing
- Verify markdown format matches parser expectations
- Check for malformed JSON in animation sections
- Validate all required sections exist

### Algorithm not showing on homepage
- Verify markdown file saved to `src/algorithms/`
- Check file naming (kebab-case)
- Clear cache and refresh
- Check API response

### Animations not working
- Verify JSON format in markdown
- Check for syntax errors in animation data
- Ensure all required fields present
