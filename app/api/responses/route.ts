import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to verify JWT token
async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string }
    return decoded.userId
  } catch (error) {
    return null
  }
}

// GET - Fetch all responses for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyToken(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const responses = await prisma.eSGResponse.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(responses)

  } catch (error) {
    console.error('Error fetching responses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Save a new ESG response
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyToken(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Validate required fields
    if (!data.financialYear) {
      return NextResponse.json(
        { error: 'Financial year is required' },
        { status: 400 }
      )
    }

    // Create ESG response
    const response = await prisma.eSGResponse.create({
      data: {
        userId,
        financialYear: data.financialYear,
        // Environmental metrics
        totalElectricityConsumption: data.totalElectricityConsumption || 0,
        renewableElectricityConsumption: data.renewableElectricityConsumption || 0,
        totalFuelConsumption: data.totalFuelConsumption || 0,
        carbonEmissions: data.carbonEmissions || 0,
        // Social metrics
        totalEmployees: data.totalEmployees || 0,
        femaleEmployees: data.femaleEmployees || 0,
        avgTrainingHoursPerEmployee: data.avgTrainingHoursPerEmployee || 0,
        communityInvestmentSpend: data.communityInvestmentSpend || 0,
        // Governance metrics
        independentBoardMembersPercent: data.independentBoardMembersPercent || 0,
        hasDataPrivacyPolicy: data.hasDataPrivacyPolicy || false,
        totalRevenue: data.totalRevenue || 0,
        // Auto-calculated metrics
        carbonIntensity: data.carbonIntensity || 0,
        renewableElectricityRatio: data.renewableElectricityRatio || 0,
        diversityRatio: data.diversityRatio || 0,
        communitySpendRatio: data.communitySpendRatio || 0,
      }
    })

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Error saving response:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 