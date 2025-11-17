// src/app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

/**
 * GET /api/reviews
 * Retrieves all documents from the "reviews" collection
 */
export async function GET() {
  try {
    // Establish connection to the database
    const db = await getDatabase();
    
    // Query the reviews collection
    const reviews = await db.collection('reviews').find({}).toArray();
    
    // Return results as JSON with proper headers
    return NextResponse.json(
      reviews,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching reviews from MongoDB:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch reviews',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

