import { NextResponse } from 'next/server';
import { newsletters } from '../../route';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const newsletterIndex = newsletters.findIndex(n => n.id === id);
    
    if (newsletterIndex === -1) {
      return NextResponse.json(
        { error: "Newsletter not found" },
        { status: 404 }
      );
    }
    
    const newsletter = newsletters[newsletterIndex];
    
    // Check if newsletter is already sent
    if (newsletter.status === "Sent") {
      return NextResponse.json(
        { error: "Newsletter has already been sent" },
        { status: 400 }
      );
    }
    
    // Update newsletter to sent
    newsletters[newsletterIndex] = {
      ...newsletter,
      status: "Sent",
      sentDate: new Date().toISOString().split('T')[0],
      recipients: 8921, // Mock data - would be actual subscriber count
      openRate: "0%",
      clickRate: "0%",
    };
    
    return NextResponse.json(newsletters[newsletterIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send newsletter" },
      { status: 500 }
    );
  }
} 