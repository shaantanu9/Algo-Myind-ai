# Quick Start Guide - Upload JS Flow

## 🚀 Start the Application

```bash
npm run dev
```

Visit: `http://localhost:3000`

## 📤 Upload a JavaScript Algorithm

### Via UI (Easiest)
1. Go to: `http://localhost:3000/upload-js`
2. Click "Choose File"
3. Select any JavaScript algorithm file (e.g., `0003-longest-substring-without-repeating-characters.js`)
4. Click "Analyze with AI" button
5. Wait 30-60 seconds (GPT-4o processing)
6. Click "View Algorithm Page" when done

### Via Command Line
```bash
# Upload file
curl -X POST http://localhost:3000/api/upload-js \
  -F "file=@leetcode-javascript-1-master/solutions/0003-longest-substring-without-repeating-characters.js"
```

## ✅ Verify It Worked

### 1. Check Markdown File
```bash
# File should be created here:
ls -lh src/algorithms/longest-substring-without-repeating-characters.md
```

### 2. Check API
```bash
curl "http://localhost:3000/api/algorithms?action=all" | jq '.data | length'
```

### 3. View on Homepage
Visit: `http://localhost:3000`
- Should see new algorithm in the list
- Use search to find it

### 4. View Detail Page
Visit: `http://localhost:3000/algorithm/longest-substring-without-repeating-characters`
- Should see complete visualization
- Animations should work

## 🧪 Run Automated Test

```bash
./test-complete-upload-flow.sh
```

## 📁 Key Files

### Input
- **Upload location**: `temp/` directory
- **Source files**: `leetcode-javascript-1-master/solutions/*.js`

### Output
- **Markdown files**: `src/algorithms/[algorithm-slug].md`
- **API endpoint**: `/api/algorithms?action=all`
- **Homepage**: `/` (infinite scroll)
- **Detail pages**: `/algorithm/[id]`

### Configuration
- **AI Prompt**: `src/prompts/enhanced-algorithm-prompt.md`
- **Upload API**: `app/api/upload-js/route.ts`
- **Analysis API**: `app/api/analyze-js/route.ts`

## 🎯 Expected Behavior

### ✅ Good Upload
1. File uploads successfully
2. AI identifies algorithm (e.g., "Longest Substring Without Repeating Characters")
3. Markdown generated with:
   - Correct algorithm name
   - Accurate complexity analysis
   - Realistic examples
   - Complete animations
4. File saved to `src/algorithms/`
5. Appears on homepage
6. Detail page works

### ❌ Bad Upload
- Error message displayed
- Check console for details
- Common issues:
  - File not `.js`
  - OpenAI API key missing
  - Network timeout

## 🔧 Troubleshooting

### "AI analysis failed"
- Check OpenAI API key in `.env`
- Verify internet connection
- Try again (GPT-4o can be slow)

### "Markdown not showing on homepage"
- Wait 5 minutes for cache expiry
- Or restart dev server
- Clear browser cache

### "Wrong algorithm generated"
- Check function name in JS file
- Verify using `enhanced-algorithm-prompt.md`
- Check GPT-4o model setting

## 📚 Documentation

- **Complete Flow**: `UPLOAD_FLOW_DOCUMENTATION.md`
- **Implementation**: `IMPLEMENTATION_SUMMARY.md`
- **This Guide**: `QUICK_START.md`

## 💡 Tips

1. **File naming**: Use LeetCode format: `0003-algorithm-name.js`
2. **Function names**: Clear names help AI (e.g., `twoSum`, `lengthOfLongestSubstring`)
3. **Comments**: Add comments to help AI understand
4. **Testing**: Always verify output before using in production

## 🎉 Success Indicators

You'll know it's working when:
- ✅ Markdown file created
- ✅ Correct algorithm name extracted
- ✅ Accurate time/space complexity
- ✅ Examples match function signature
- ✅ Animations have realistic data
- ✅ Homepage shows new algorithm
- ✅ Detail page renders correctly

## 🆘 Need Help?

1. Check error messages in browser console
2. Check terminal for API errors
3. Review `UPLOAD_FLOW_DOCUMENTATION.md`
4. Run `./test-complete-upload-flow.sh` for diagnostics
