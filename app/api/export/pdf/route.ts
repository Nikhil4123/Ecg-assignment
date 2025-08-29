import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

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

    // Create PDF
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.text('ESG Questionnaire Summary', 20, 20)
    
    // User info
    doc.setFontSize(12)
    doc.text(`Generated for: ${user?.name}`, 20, 35)
    doc.text(`Email: ${user?.email}`, 20, 45)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 55)

    let yPosition = 75

    // Latest response summary
    const latestResponse = responses[0]
    doc.setFontSize(16)
    doc.text(`Financial Year: ${latestResponse.financialYear}`, 20, yPosition)
    yPosition += 15

    // Environmental metrics
    doc.setFontSize(14)
    doc.text('Environmental Metrics', 20, yPosition)
    yPosition += 10

    const envData = [
      ['Metric', 'Value', 'Unit'],
      ['Total Electricity Consumption', latestResponse.totalElectricityConsumption?.toLocaleString() || 'N/A', 'kWh'],
      ['Renewable Electricity Consumption', latestResponse.renewableElectricityConsumption?.toLocaleString() || 'N/A', 'kWh'],
      ['Total Fuel Consumption', latestResponse.totalFuelConsumption?.toLocaleString() || 'N/A', 'liters'],
      ['Carbon Emissions', latestResponse.carbonEmissions?.toLocaleString() || 'N/A', 'T CO2e'],
    ]

    ;(doc as any).autoTable({
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
      ['Total Employees', latestResponse.totalEmployees?.toLocaleString() || 'N/A', ''],
      ['Female Employees', latestResponse.femaleEmployees?.toLocaleString() || 'N/A', ''],
      ['Avg Training Hours per Employee', latestResponse.avgTrainingHoursPerEmployee?.toString() || 'N/A', 'hours'],
      ['Community Investment Spend', latestResponse.communityInvestmentSpend ? `₹${latestResponse.communityInvestmentSpend.toLocaleString()}` : 'N/A', 'INR'],
    ]

    ;(doc as any).autoTable({
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
      ['Independent Board Members', latestResponse.independentBoardMembersPercent ? `${latestResponse.independentBoardMembersPercent}%` : 'N/A', ''],
      ['Data Privacy Policy', latestResponse.hasDataPrivacyPolicy ? 'Yes' : 'No', ''],
      ['Total Revenue', latestResponse.totalRevenue ? `₹${latestResponse.totalRevenue.toLocaleString()}` : 'N/A', 'INR'],
    ]

    ;(doc as any).autoTable({
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
      ['Carbon Intensity', latestResponse.carbonIntensity?.toFixed(6) || 'N/A', 'T CO2e/INR'],
      ['Renewable Electricity Ratio', latestResponse.renewableElectricityRatio ? `${latestResponse.renewableElectricityRatio.toFixed(2)}%` : 'N/A', ''],
      ['Diversity Ratio', latestResponse.diversityRatio ? `${latestResponse.diversityRatio.toFixed(2)}%` : 'N/A', ''],
      ['Community Spend Ratio', latestResponse.communitySpendRatio ? `${latestResponse.communitySpendRatio.toFixed(2)}%` : 'N/A', ''],
    ]

    ;(doc as any).autoTable({
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
        'Content-Disposition': 'attachment; filename="esg-questionnaire-summary.pdf"'
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 