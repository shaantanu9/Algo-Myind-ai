import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file received.' }, { status: 400 })
    }

    // Validate file type
    if (!file.name.endsWith('.js') || file.type !== 'text/javascript') {
      return NextResponse.json({ error: 'Invalid file type. Please upload a JavaScript file.' }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
    }

    // Read file content
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const content = buffer.toString('utf-8')

    // Extract problem ID from filename (e.g., 0001-two-sum.js -> 1)
    const problemIdMatch = file.name.match(/^(\d{4})-(.+)\.js$/)
    const problemId = problemIdMatch ? parseInt(problemIdMatch[1]) : null
    const algorithmSlug = problemIdMatch ? problemIdMatch[2] : null

    // Save file to temporary location
    const tempDir = path.join(process.cwd(), 'temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    const fileName = `${Date.now()}-${file.name}`
    const filePath = path.join(tempDir, fileName)
    fs.writeFileSync(filePath, content)

    return NextResponse.json({
      success: true,
      fileName: file.name,
      filePath,
      content,
      problemId,
      algorithmSlug,
      size: file.size
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error during file upload.' },
      { status: 500 }
    )
  }
}
