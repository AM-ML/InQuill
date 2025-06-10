import { NextResponse } from 'next/server';

// Mock article data
export const articles = [
  {
    id: 1,
    title: "AI-Powered Diagnostic Tools in Modern Medicine",
    author: "Dr. Sarah Chen",
    publishDate: "2024-12-01",
    status: "Published",
    views: 2100,
    category: "AI & Technology",
    wordCount: 2500,
  },
  {
    id: 2,
    title: "The Future of Personalized Medicine",
    author: "Dr. Michael Rodriguez",
    publishDate: "2024-11-28",
    status: "Pending",
    views: 0,
    category: "Personalized Medicine",
    wordCount: 3200,
  },
  {
    id: 3,
    title: "Breakthrough in Cancer Immunotherapy",
    author: "Dr. Emily Johnson",
    publishDate: "2024-11-25",
    status: "Published",
    views: 3400,
    category: "Oncology",
    wordCount: 2800,
  },
  {
    id: 4,
    title: "Gene Therapy Advances in 2024",
    author: "Dr. James Wilson",
    publishDate: "2024-11-20",
    status: "Draft",
    views: 0,
    category: "Gene Therapy",
    wordCount: 1900,
  },
  {
    id: 5,
    title: "Telemedicine: Transforming Healthcare Delivery",
    author: "Dr. Lisa Park",
    publishDate: "2024-11-18",
    status: "Under Review",
    views: 0,
    category: "Digital Health",
    wordCount: 2100,
  },
];

export async function GET() {
  return NextResponse.json(articles);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.author || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create new article
    const newArticle = {
      id: articles.length > 0 ? Math.max(...articles.map(article => article.id)) + 1 : 1,
      title: body.title,
      author: body.author,
      publishDate: body.status === "Published" ? new Date().toISOString().split('T')[0] : "",
      status: body.status || "Draft",
      views: 0,
      category: body.category,
      wordCount: body.wordCount || 0,
    };
    
    articles.push(newArticle);
    
    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
} 