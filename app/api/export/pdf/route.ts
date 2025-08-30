import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

// Extend jsPDF with autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable
  }
}

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

    // Create PDF
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.text('ESG Questionnaire Response', 20, 20)
    
    // User info
    doc.setFontSize(12)
    doc.text(`Generated for: ${user?.name || 'N/A'}`, 20, 35)
    doc.text(`Email: ${user?.email || 'N/A'}`, 20, 45)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55)
    doc.text(`Response ID: ${responseId}`, 20, 65)

    let yPosition = 85

    // Response details
    doc.setFontSize(16)
    doc.text(`Financial Year: ${response.financialYear || 'N/A'}`, 20, yPosition)
    yPosition += 15

    // Environmental metrics
    doc.setFontSize(14)
    doc.text('Environmental Metrics', 20, yPosition)
    yPosition += 10

    const envData = [
      ['Metric', 'Value', 'Unit'],
      ['Total Electricity Consumption', response.totalElectricityConsumption?.toLocaleString() || 'N/A', 'kWh'],
      ['Renewable Electricity Consumption', response.renewableElectricityConsumption?.toLocaleString() || 'N/A', 'kWh'],
      ['Total Fuel Consumption', response.totalFuelConsumption?.toLocaleString() || 'N/A', 'liters'],
      ['Carbon Emissions', response.carbonEmissions?.toLocaleString() || 'N/A', 'T CO2e'],
    ]

    autoTable(doc, {
      startY: yPosition,
      head: [envData[0]],
      body: envData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [34, 197, 94] }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // Social metrics
    doc.setFontSize(14)
    doc.text('Social Metrics', 20, yPosition)
    yPosition += 10

    const socialData = [
      ['Metric', 'Value', 'Unit'],
      ['Total Employees', response.totalEmployees?.toLocaleString() || 'N/A', ''],
      ['Female Employees', response.femaleEmployees?.toLocaleString() || 'N/A', ''],
      ['Avg Training Hours per Employee', response.avgTrainingHoursPerEmployee?.toString() || 'N/A', 'hours'],
      ['Community Investment Spend', response.communityInvestmentSpend ? `₹${response.communityInvestmentSpend.toLocaleString()}` : 'N/A', 'INR'],
    ]

    autoTable(doc, {
      startY: yPosition,
      head: [socialData[0]],
      body: socialData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // Governance metrics
    doc.setFontSize(14)
    doc.text('Governance Metrics', 20, yPosition)
    yPosition += 10

    const govData = [
      ['Metric', 'Value', 'Unit'],
      ['Independent Board Members', response.independentBoardMembersPercent ? `${response.independentBoardMembersPercent}%` : 'N/A', ''],
      ['Data Privacy Policy', response.hasDataPrivacyPolicy ? 'Yes' : 'No', ''],
      ['Total Revenue', response.totalRevenue ? `₹${response.totalRevenue.toLocaleString()}` : 'N/A', 'INR'],
    ]

    autoTable(doc, {
      startY: yPosition,
      head: [govData[0]],
      body: govData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [147, 51, 234] }
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // Calculated metrics
    doc.setFontSize(14)
    doc.text('Calculated Metrics', 20, yPosition)
    yPosition += 10

    const calcData = [
      ['Metric', 'Value', 'Unit'],
      ['Carbon Intensity', response.carbonIntensity?.toFixed(6) || 'N/A', 'T CO2e/INR'],
      ['Renewable Electricity Ratio', response.renewableElectricityRatio ? `${response.renewableElectricityRatio.toFixed(2)}%` : 'N/A', ''],
      ['Diversity Ratio', response.diversityRatio ? `${response.diversityRatio.toFixed(2)}%` : 'N/A', ''],
      ['Community Spend Ratio', response.communitySpendRatio ? `${response.communitySpendRatio.toFixed(2)}%` : 'N/A', ''],
    ]

    autoTable(doc, {
      startY: yPosition,
      head: [calcData[0]],
      body: calcData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [107, 114, 128] }
    })

    // Convert to buffer
    const pdfBuffer = doc.output('arraybuffer')

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="esg-response-${responseId}.pdf"`,
        'Cache-Control': 'no-cache'
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}