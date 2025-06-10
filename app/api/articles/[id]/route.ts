import { NextResponse } from 'next/server';

// Import mock article data from parent route
// In a real application, this would be a database query
import { articles } from '../route';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const article = articles.find(a => a.id === id);
  
  if (!article) {
    return NextResponse.json(
      { error: "Article not found" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(article);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const articleIndex = articles.findIndex(a => a.id === id);
    
    if (articleIndex === -1) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Update article
    articles[articleIndex] = {
      ...articles[articleIndex],
      ...body,
    };
    
    return NextResponse.json(articles[articleIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const articleIndex = articles.findIndex(a => a.id === id);
  
  if (articleIndex === -1) {
    return NextResponse.json(
      { error: "Article not found" },
      { status: 404 }
    );
  }
  
  // Remove article (soft delete by changing status)
  articles[articleIndex] = {
    ...articles[articleIndex],
    status: "Deleted"
  };
  
  return NextResponse.json(articles[articleIndex]);
} 