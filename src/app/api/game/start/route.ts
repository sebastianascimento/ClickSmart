import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // You might need to install this
import { getScenarios } from '../scenarios'; // Path may need adjustment based on your file structure

export async function GET(request: NextRequest) {
  try {
    // Get locale from URL or query param
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale') || 'pt';
    
    // Get scenarios for the selected locale
    const scenarios = getScenarios(locale as 'pt' | 'en');
    
    // Create a simple session ID 
    const sessionId = uuidv4();
    
    return NextResponse.json({
      levels: scenarios,
      sessionId: sessionId
    });
  } catch (error) {
    console.error('Error starting game:', error);
    return NextResponse.json(
      { error: 'Failed to start game' },
      { status: 500 }
    );
  }
}