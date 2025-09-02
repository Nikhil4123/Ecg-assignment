import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '../../../../lib/prisma'

async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true }
    })
    return user
  } catch (error) {
    return null
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const responseId = params.id

    // Validate responseId format
    if (!responseId || responseId.length < 10) {
      return NextResponse.json({ error: 'Invalid response ID' }, { status: 400 })
    }

    // Check if the response exists and belongs to the user
    const existingResponse = await prisma.eSGResponse.findFirst({
      where: {
        id: responseId,
        userId: user.id
      }
    })

    if (!existingResponse) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 })
    }

    // Delete the response
    await prisma.eSGResponse.delete({
      where: {
        id: responseId
      }
    })

    return NextResponse.json({ message: 'Response deleted successfully' }, { status: 200 })

  } catch (error) {
    console.error('Error deleting response:', error)
    
    // Check for specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Record to delete does not exist')) {
        return NextResponse.json(
          { error: 'Response not found' },
          { status: 404 }
        )
      }
      if (error.message.includes('Foreign key constraint failed')) {
        return NextResponse.json(
          { error: 'Cannot delete response due to related data' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
