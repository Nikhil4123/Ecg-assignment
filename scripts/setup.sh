#!/bin/bash

# ESG Questionnaire Setup Script
echo "🚀 Setting up ESG Questionnaire Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/esg_questionnaire"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
EOF
    echo "⚠️  Please update .env.local with your actual database credentials and secrets"
else
    echo "✅ .env.local already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Check if database is accessible
echo "🔍 Checking database connection..."
if npx prisma db push --accept-data-loss &> /dev/null; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Database connection failed. Please check your DATABASE_URL in .env.local"
    echo "💡 You can run 'npx prisma db push' manually after setting up your database"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your database credentials"
echo "2. Run 'npx prisma db push' to create database tables"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more information, see README.md" 