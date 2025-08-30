import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

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

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyToken(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get responseId from query parameters
    const { searchParams } = new URL(request.url)
    const responseId = searchParams.get('responseId')

    if (!responseId) {
      return NextResponse.json(
        { error: 'Response ID is required' },
        { status: 400 }
      )
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    })

    // Get specific response
    const response = await prisma.eSGResponse.findFirst({
      where: { 
        id: responseId,
        userId: userId // Ensure user can only access their own responses
      }
    })

    if (!response) {
      return NextResponse.json(
        { error: 'Response not found' },
        { status: 404 }
      )
    }

    // Create workbook
    const workbook = XLSX.utils.book_new()

    // Response details sheet
    const responseData = [
      ['ESG Questionnaire Response'],
      [''],
      ['Generated for:', user?.name],
      ['Email:', user?.email],
      ['Generated on:', new Date().toLocaleDateString()],
      ['Response ID:', responseId],
      [''],
      ['Financial Year:', response.financialYear],
      [''],
      ['Environmental Metrics'],
      ['Metric', 'Value', 'Unit'],
      ['Total Electricity Consumption', response.totalElectricityConsumption?.toLocaleString() || 'N/A', 'kWh'],
      ['Renewable Electricity Consumption', response.renewableElectricityConsumption?.toLocaleString() || 'N/A', 'kWh'],
      ['Total Fuel Consumption', response.totalFuelConsumption?.toLocaleString() || 'N/A', 'liters'],
      ['Carbon Emissions', response.carbonEmissions?.toLocaleString() || 'N/A', 'T CO2e'],
      [''],
      ['Social Metrics'],
      ['Metric', 'Value', 'Unit'],
      ['Total Employees', response.totalEmployees?.toLocaleString() || 'N/A', ''],
      ['Female Employees', response.femaleEmployees?.toLocaleString() || 'N/A', ''],
      ['Avg Training Hours per Employee', response.avgTrainingHoursPerEmployee?.toString() || 'N/A', 'hours'],
      ['Community Investment Spend', response.communityInvestmentSpend ? `₹${response.communityInvestmentSpend.toLocaleString()}` : 'N/A', 'INR'],
      [''],
      ['Governance Metrics'],
      ['Metric', 'Value', 'Unit'],
      ['Independent Board Members', response.independentBoardMembersPercent ? `${response.independentBoardMembersPercent}%` : 'N/A', ''],
      ['Data Privacy Policy', response.hasDataPrivacyPolicy ? 'Yes' : 'No', ''],
      ['Total Revenue', response.totalRevenue ? `₹${response.totalRevenue.toLocaleString()}` : 'N/A', 'INR'],
      [''],
      ['Calculated Metrics'],
      ['Metric', 'Value', 'Unit'],
      ['Carbon Intensity', response.carbonIntensity?.toFixed(6) || 'N/A', 'T CO2e/INR'],
      ['Renewable Electricity Ratio', response.renewableElectricityRatio ? `${response.renewableElectricityRatio.toFixed(2)}%` : 'N/A', ''],
      ['Diversity Ratio', response.diversityRatio ? `${response.diversityRatio.toFixed(2)}%` : 'N/A', ''],
      ['Community Spend Ratio', response.communitySpendRatio ? `${response.communitySpendRatio.toFixed(2)}%` : 'N/A', ''],
    ]

    const responseSheet = XLSX.utils.aoa_to_sheet(responseData)
    XLSX.utils.book_append_sheet(workbook, responseSheet, 'Response Details')

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="esg-response-${responseId}.xlsx"`
      }
    })

  } catch (error) {
    console.error('Error generating Excel:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 