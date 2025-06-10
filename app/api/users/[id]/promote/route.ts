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
    
    // Determine next role in promotion path
    let newRole: string;
    switch (user.role) {
      case "Author":
        newRole = "Reviewer";
        break;
      case "Reviewer":
        newRole = "Editor";
        break;
      case "Editor":
        newRole = "Admin";
        break;
      case "Admin":
        return NextResponse.json(
          { error: "User is already at the highest role level" },
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
    console.error("Error promoting user:", error);
    return NextResponse.json(
      { error: "Failed to promote user" },
      { status: 500 }
    );
  }
} 