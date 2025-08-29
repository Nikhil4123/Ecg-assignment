import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'

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

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyToken(request)
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user and their responses
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    })

    const responses = await prisma.eSGResponse.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    if (responses.length === 0) {
      return NextResponse.json(
        { error: 'No data to export' },
        { status: 404 }
      )
    }

    // Create workbook
    const workbook = XLSX.utils.book_new()

    // Summary sheet
    const latestResponse = responses[0]
    const summaryData = [
      ['ESG Questionnaire Summary'],
      [''],
      ['Generated for:', user?.name],
      ['Email:', user?.email],
      ['Generated on:', new Date().toLocaleDateString()],
      [''],
      ['Financial Year:', latestResponse.financialYear],
      [''],
      ['Environmental Metrics'],
      ['Metric', 'Value', 'Unit'],
      ['Total Electricity Consumption', latestResponse.totalElectricityConsumption, 'kWh'],
      ['Renewable Electricity Consumption', latestResponse.renewableElectricityConsumption, 'kWh'],
      ['Total Fuel Consumption', latestResponse.totalFuelConsumption, 'liters'],
      ['Carbon Emissions', latestResponse.carbonEmissions, 'T CO2e'],
      [''],
      ['Social Metrics'],
      ['Metric', 'Value', 'Unit'],
      ['Total Employees', latestResponse.totalEmployees, ''],
      ['Female Employees', latestResponse.femaleEmployees, ''],
      ['Avg Training Hours per Employee', latestResponse.avgTrainingHoursPerEmployee, 'hours'],
      ['Community Investment Spend', latestResponse.communityInvestmentSpend, 'INR'],
      [''],
      ['Governance Metrics'],
      ['Metric', 'Value', 'Unit'],
      ['Independent Board Members', latestResponse.independentBoardMembersPercent, '%'],
      ['Data Privacy Policy', latestResponse.hasDataPrivacyPolicy ? 'Yes' : 'No', ''],
      ['Total Revenue', latestResponse.totalRevenue, 'INR'],
      [''],
      ['Calculated Metrics'],
      ['Metric', 'Value', 'Unit'],
      ['Carbon Intensity', latestResponse.carbonIntensity, 'T CO2e/INR'],
      ['Renewable Electricity Ratio', latestResponse.renewableElectricityRatio, '%'],
      ['Diversity Ratio', latestResponse.diversityRatio, '%'],
      ['Community Spend Ratio', latestResponse.communitySpendRatio, '%'],
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

    // Historical data sheet
    const historicalData = responses.map(response => ({
      'Financial Year': response.financialYear,
      'Created Date': new Date(response.createdAt).toLocaleDateString(),
      'Total Electricity (kWh)': response.totalElectricityConsumption,
      'Renewable Electricity (kWh)': response.renewableElectricityConsumption,
      'Total Fuel (liters)': response.totalFuelConsumption,
      'Carbon Emissions (T CO2e)': response.carbonEmissions,
      'Total Employees': response.totalEmployees,
      'Female Employees': response.femaleEmployees,
      'Avg Training Hours': response.avgTrainingHoursPerEmployee,
      'Community Investment (INR)': response.communityInvestmentSpend,
      'Independent Board Members (%)': response.independentBoardMembersPercent,
      'Data Privacy Policy': response.hasDataPrivacyPolicy ? 'Yes' : 'No',
      'Total Revenue (INR)': response.totalRevenue,
      'Carbon Intensity (T CO2e/INR)': response.carbonIntensity,
      'Renewable Electricity Ratio (%)': response.renewableElectricityRatio,
      'Diversity Ratio (%)': response.diversityRatio,
      'Community Spend Ratio (%)': response.communitySpendRatio,
    }))

    const historicalSheet = XLSX.utils.json_to_sheet(historicalData)
    XLSX.utils.book_append_sheet(workbook, historicalSheet, 'Historical Data')

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="esg-questionnaire-summary.xlsx"'
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