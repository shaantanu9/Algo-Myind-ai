import { NextRequest, NextResponse } from 'next/server';
import { MarkdownParser } from '@/lib/markdown-parser';

const parser = new MarkdownParser('./src/algorithms');

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'all':
        const algorithms = await parser.parseAllAlgorithms();
        return NextResponse.json({
          success: true,
          data: algorithms,
          count: algorithms.length
        });

      case 'batch':
        const offset = parseInt(searchParams.get('offset') || '0');
        const limit = parseInt(searchParams.get('limit') || '12');

        const allAlgorithms = await parser.parseAllAlgorithms();
        const batch = allAlgorithms.slice(offset, offset + limit);
        const hasMore = offset + limit < allAlgorithms.length;

        return NextResponse.json({
          success: true,
          data: batch,
          hasMore,
          total: allAlgorithms.length,
          loaded: offset + batch.length
        });

      case 'search':
        const query = searchParams.get('q') || '';
        const allForSearch = await parser.parseAllAlgorithms();
        const filtered = allForSearch.filter(algorithm =>
          algorithm.title.toLowerCase().includes(query.toLowerCase()) ||
          algorithm.description.toLowerCase().includes(query.toLowerCase()) ||
          algorithm.keyInsights.some(insight => insight.toLowerCase().includes(query.toLowerCase()))
        );

        return NextResponse.json({
          success: true,
          data: filtered,
          count: filtered.length
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action parameter'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
