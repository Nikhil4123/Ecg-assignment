@echo off
echo 🚀 Setting up ESG Questionnaire Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check if .env.local exists
if not exist .env.local (
    echo 📝 Creating .env.local file...
    (
        echo # Database Configuration
        echo DATABASE_URL="postgresql://username:password@localhost:5432/esg_questionnaire"
        echo.
        echo # JWT Configuration
        echo JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
        echo.
        echo # NextAuth Configuration
        echo NEXTAUTH_SECRET="your-nextauth-secret-here"
        echo NEXTAUTH_URL="http://localhost:3000"
    ) > .env.local
    echo ⚠️  Please update .env.local with your actual database credentials and secrets
) else (
    echo ✅ .env.local already exists
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npx prisma generate

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update .env.local with your database credentials
echo 2. Run 'npx prisma db push' to create database tables
echo 3. Run 'npm run dev' to start the development server
echo 4. Open http://localhost:3000 in your browser
echo.
echo 📚 For more information, see README.md
pause 