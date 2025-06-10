import { NextResponse } from 'next/server';

// Mock user data
export const users = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    email: "sarah.chen@medresearch.org",
    role: "Admin",
    registrationDate: "2024-01-15",
    status: "Active",
    articles: 12,
    lastLogin: "2024-12-06",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Dr. Michael Rodriguez",
    email: "m.rodriguez@medresearch.org",
    role: "Editor",
    registrationDate: "2024-02-20",
    status: "Active",
    articles: 8,
    lastLogin: "2024-12-05",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Dr. Emily Johnson",
    email: "emily.j@medresearch.org",
    role: "Author",
    registrationDate: "2024-03-10",
    status: "Active",
    articles: 15,
    lastLogin: "2024-12-04",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    email: "j.wilson@medresearch.org",
    role: "Author",
    registrationDate: "2024-03-25",
    status: "Inactive",
    articles: 3,
    lastLogin: "2024-11-20",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    name: "Dr. Lisa Park",
    email: "l.park@medresearch.org",
    role: "Reviewer",
    registrationDate: "2024-04-12",
    status: "Active",
    articles: 6,
    lastLogin: "2024-12-06",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create new user
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
      name: body.name,
      email: body.email,
      role: body.role,
      registrationDate: new Date().toISOString().split('T')[0],
      status: "Active",
      articles: 0,
      lastLogin: new Date().toISOString().split('T')[0],
      avatar: "/placeholder.svg?height=32&width=32",
    };
    
    users.push(newUser);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
} 