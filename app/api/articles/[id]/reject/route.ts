import { NextResponse } from 'next/server';
import { articles } from '../../route';

export async function PUT(
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
    
    const article = articles[articleIndex];
    
    // Check if article is already rejected
    if (article.status === "Rejected") {
      return NextResponse.json(
        { error: "Article is already rejected" },
        { status: 400 }
      );
    }
    
    // Update article status to rejected
    articles[articleIndex] = {
      ...article,
      status: "Rejected"
    };
    
    return NextResponse.json(articles[articleIndex]);
  } catch (error) {
    console.error("Error rejecting article:", error);
    return NextResponse.json(
      { error: "Failed to reject article" },
      { status: 500 }
    );
  }
} 