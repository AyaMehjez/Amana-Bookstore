// src/app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

/**
 * GET /api/cart
 * Retrieves all documents from the "cart" collection
 */
export async function GET() {
  try {
    // Establish connection to the database
    const db = await getDatabase();
    
    // Query the cart collection
    const cartItems = await db.collection('cart').find({}).toArray();
    
    // Return results as JSON with proper headers
    return NextResponse.json(
      cartItems,
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching cart from MongoDB:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch cart items',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Adds an item to the cart collection
 * Expected body: { userId: string, bookId: string, quantity: number }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, bookId, quantity } = body;
    
    // Validate required fields
    if (!userId || !bookId || quantity === undefined) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          details: 'userId, bookId, and quantity are required'
        },
        { status: 400 }
      );
    }
    
    // Establish connection to the database
    const db = await getDatabase();
    
    // Insert the document into the cart collection
    const result = await db.collection('cart').insertOne({
      userId,
      bookId,
      quantity: Number(quantity),
      addedAt: new Date(),
    });
    
    // Return JSON response with success and insertedId
    return NextResponse.json(
      { 
        success: true,
        insertedId: result.insertedId.toString(),
        message: 'Item added to cart successfully'
      },
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to add item to cart',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/cart - Update cart item
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const result = await db.collection('cart').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } }
    );
    
    return NextResponse.json({ 
      message: 'Cart item updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error('Error updating cart item:', err);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    
    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    const result = await db.collection('cart').deleteOne({ _id: new ObjectId(itemId) });
    
    return NextResponse.json({ 
      message: 'Item removed from cart successfully',
      deletedCount: result.deletedCount,
      itemId 
    });
  } catch (err) {
    console.error('Error removing cart item:', err);
    return NextResponse.json(
      { error: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}
