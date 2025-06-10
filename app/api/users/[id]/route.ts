import { NextResponse } from 'next/server';

// Import mock user data from parent route
// In a real application, this would be a database query
import { users } from '../route';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(user);
}

export async function PATCH(
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
    
    const body = await request.json();
    
    // Update user
    users[userIndex] = {
      ...users[userIndex],
      ...body,
    };
    
    return NextResponse.json(users[userIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }
  
  // Remove user
  const deletedUser = users.splice(userIndex, 1)[0];
  
  return NextResponse.json(deletedUser);
} 