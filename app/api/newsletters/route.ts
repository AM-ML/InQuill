import { NextResponse } from 'next/server';

// Mock newsletter data
export const newsletters = [
  {
    id: 1,
    subject: "Weekly Research Digest - December 2024",
    content: "This week's top medical research findings and breakthroughs...",
    sentDate: "2024-12-01",
    recipients: 8921,
    openRate: "68.5%",
    clickRate: "12.3%",
    status: "Sent",
  },
  {
    id: 2,
    subject: "New Breakthrough in Cancer Research",
    content: "Exciting developments in cancer immunotherapy...",
    sentDate: "2024-11-28",
    recipients: 8856,
    openRate: "72.1%",
    clickRate: "15.7%",
    status: "Sent",
  },
  {
    id: 3,
    subject: "AI in Healthcare: Latest Developments",
    content: "How artificial intelligence is transforming medical diagnostics...",
    sentDate: "2024-11-25",
    recipients: 8792,
    openRate: "65.9%",
    clickRate: "11.8%",
    status: "Sent",
  },
  {
    id: 4,
    subject: "Monthly Newsletter - November 2024",
    content: "A summary of this month's medical research highlights...",
    sentDate: "",
    recipients: 0,
    openRate: "0%",
    clickRate: "0%",
    status: "Draft",
  },
];

export async function GET() {
  return NextResponse.json(newsletters);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.subject || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create new newsletter
    const newNewsletter = {
      id: newsletters.length > 0 ? Math.max(...newsletters.map(newsletter => newsletter.id)) + 1 : 1,
      subject: body.subject,
      content: body.content,
      sentDate: "",
      recipients: 0,
      openRate: "0%",
      clickRate: "0%",
      status: "Draft",
    };
    
    newsletters.push(newNewsletter);
    
    return NextResponse.json(newNewsletter, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// API route for sending a newsletter
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "Newsletter ID is required" },
        { status: 400 }
      );
    }
    
    const newsletterIndex = newsletters.findIndex(n => n.id === parseInt(id));
    
    if (newsletterIndex === -1) {
      return NextResponse.json(
        { error: "Newsletter not found" },
        { status: 404 }
      );
    }
    
    // Update newsletter status to sent
    newsletters[newsletterIndex] = {
      ...newsletters[newsletterIndex],
      status: "Sent",
      sentDate: new Date().toISOString().split('T')[0],
    };
    
    return NextResponse.json(newsletters[newsletterIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
} 