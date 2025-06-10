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
    
    // Check if article is already published
    if (article.status === "Published") {
      return NextResponse.json(
        { error: "Article is already published" },
        { status: 400 }
      );
    }
    
    // Update article status to published
    articles[articleIndex] = {
      ...article,
      status: "Published",
      publishDate: new Date().toISOString().split('T')[0]
    };
    
    return NextResponse.json(articles[articleIndex]);
  } catch (error) {
    console.error("Error approving article:", error);
    return NextResponse.json(
      { error: "Failed to approve article" },
      { status: 500 }
    );
  }
} 