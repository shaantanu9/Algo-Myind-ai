import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { algorithmId, question, context } = await req.json()

    const prompt = `You are an expert computer science tutor specializing in algorithms and data structures. 

Algorithm: ${algorithmId}
Question: ${question}
Context: ${context || "General algorithm explanation"}

Provide a clear, educational explanation that:
1. Answers the specific question directly
2. Uses simple analogies when helpful
3. Explains the underlying concepts
4. Connects to real-world applications
5. Keeps the tone encouraging and accessible

Limit your response to 2-3 paragraphs maximum.`

    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt,
      maxOutputTokens: 500,
      temperature: 0.7,
    })

    return Response.json({ explanation: text })
  } catch (error) {
    console.error("AI explanation error:", error)

    // Fallback to mock response if AI fails
    const mockExplanations = getMockExplanation(req)
    return Response.json({ explanation: mockExplanations })
  }
}

function getMockExplanation(req: Request): string {
  // Mock responses for testing when AI is unavailable
  const mockResponses = {
    "why-hash-map-faster": `The hash map approach is faster because it eliminates the need to check every possible pair. Instead of comparing each element with every other element (which takes O(n²) time), we use the hash map as a "memory" that instantly tells us if we've seen the complement before.

Think of it like having a perfect memory assistant: instead of asking everyone at a party if they know someone with a specific trait, you ask your assistant who instantly remembers everyone they've met. This transforms a slow, exhaustive search into a quick lookup.

The trade-off is space - we use extra memory to store the hash map, but we gain significant speed. In most real-world applications, this trade-off is worth it because memory is often more abundant than time.`,

    "space-time-tradeoff": `We're trading space (memory) for time (speed). The brute force approach uses O(1) space but takes O(n²) time, while the hash map approach uses O(n) space but only takes O(n) time.

This is a fundamental concept in computer science: often you can make algorithms faster by using more memory to store intermediate results. It's like keeping a cheat sheet during an exam - you use more paper (space) but answer questions much faster (time).

In system design, this principle appears everywhere: caching, indexing, memoization, and lookup tables all follow this same pattern of using extra space to achieve better performance.`,

    "when-brute-force-better": `Brute force might be better when memory is extremely limited or when the input size is very small. If you're working on an embedded system with strict memory constraints, the O(1) space complexity of brute force could be crucial.

Additionally, for very small arrays (say, less than 10 elements), the overhead of creating and managing a hash map might actually make it slower than the simple nested loops. The hash map approach has constant factors that can dominate for tiny inputs.

Finally, brute force is simpler to implement and understand, making it valuable for educational purposes or when code maintainability is more important than optimal performance.`,
  }

  // Return a default mock response
  return mockResponses["why-hash-map-faster"]
}
