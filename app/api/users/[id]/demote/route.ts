import { NextResponse } from 'next/server';
import { users } from '../../route';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    const user = users[userIndex];
    
    // Determine next role in demotion path
    let newRole: string;
    switch (user.role) {
      case "Admin":
        newRole = "Editor";
        break;
      case "Editor":
        newRole = "Reviewer";
        break;
      case "Reviewer":
        newRole = "Author";
        break;
      case "Author":
        return NextResponse.json(
          { error: "User is already at the lowest role level" },
          { status: 400 }
        );
      default:
        newRole = "Author";
    }
    
    // Update user role
    users[userIndex] = {
      ...user,
      role: newRole
    };
    
    return NextResponse.json(users[userIndex]);
  } catch (error) {
    console.error("Error demoting user:", error);
    return NextResponse.json(
      { error: "Failed to demote user" },
      { status: 500 }
    );
  }
} 