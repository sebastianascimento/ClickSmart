import { NextRequest, NextResponse } from 'next/server';
import { getScenarios } from '../scenarios';

export async function GET(request: NextRequest) {
  try {
    // Get locale from URL or query param
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale') || 'pt';
    
    // Get scenarios for the selected locale
    const scenarios = getScenarios(locale as 'pt' | 'en');
    
    // Create a new game session
    const session = await prisma.gameSession.create({
      data: {
        currentLevel: 1,
        score: 0,
        completed: false,
        locale: locale
      }
    });
    
    return NextResponse.json({
      levels: scenarios,
      sessionId: session.id
    });
  } catch (error) {
    console.error('Error starting game:', error);
    return NextResponse.json(
      { error: 'Failed to start game' },
      { status: 500 }
    );
  }
}