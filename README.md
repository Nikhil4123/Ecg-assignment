# ESG Questionnaire Application

A comprehensive Environmental, Social, and Governance (ESG) questionnaire application built with Next.js, TypeScript, and PostgreSQL. This application allows users to track and analyze their ESG metrics across multiple financial years.

## Features

### 🔐 Authentication & Security
- User registration and login with JWT tokens
- Password hashing with bcrypt
- Protected routes and API endpoints
- Session management

### 📊 ESG Metrics Tracking
- **Environmental Metrics:**
  - Total electricity consumption (kWh)
  - Renewable electricity consumption (kWh)
  - Total fuel consumption (liters)
  - Carbon emissions (T CO2e)

- **Social Metrics:**
  - Total number of employees
  - Number of female employees
  - Average training hours per employee
  - Community investment spend (INR)

- **Governance Metrics:**
  - Percentage of independent board members
  - Data privacy policy status
  - Total revenue (INR)

### 🧮 Auto-Calculated Metrics
- **Carbon Intensity:** Carbon emissions / Total revenue (T CO2e / INR)
- **Renewable Electricity Ratio:** (Renewable electricity / Total electricity) × 100%
- **Diversity Ratio:** (Female employees / Total employees) × 100%
- **Community Spend Ratio:** (Community investment / Total revenue) × 100%

### 📈 Dashboard & Analytics
- Real-time metric calculations
- Interactive charts using Recharts
- Historical data comparison
- Summary dashboard with key performance indicators

### 📄 Export Functionality
- PDF export with formatted tables
- Excel export with multiple sheets
- Comprehensive data summaries

### 💾 Data Management
- PostgreSQL database with Prisma ORM
- Persistent data storage
- Historical response tracking
- User-specific data isolation

## Technology Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT tokens with bcrypt
- **Charts:** Recharts
- **Export:** jsPDF, XLSX
- **Deployment:** Vercel-ready

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd esg-questionnaire
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/esg_questionnaire"
   JWT_SECRET="your-super-secret-jwt-key-here"
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup

### Option 1: Local PostgreSQL
1. Install PostgreSQL on your system
2. Create a new database:
   ```sql
   CREATE DATABASE esg_questionnaire;
   ```
3. Update the `DATABASE_URL` in your `.env.local` file

### Option 2: Cloud Database (Recommended for production)
- **Vercel Postgres:** Easy integration with Vercel deployment
- **Supabase:** Free tier available with PostgreSQL
- **Railway:** Simple PostgreSQL hosting
- **PlanetScale:** MySQL-compatible alternative

## Usage

### 1. User Registration
- Navigate to the application
- Click "Sign Up" to create a new account
- Provide your name, email, and password

### 2. ESG Questionnaire
- Fill in the ESG questionnaire with your organization's data
- All calculated metrics update in real-time
- Save your responses for future reference

### 3. Dashboard
- View summary statistics and charts
- Compare metrics across different financial years
- Export data in PDF or Excel format

### 4. Historical Data
- Access all your previous submissions
- Compare performance over time
- Track progress on ESG initiatives

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### ESG Data
- `GET /api/responses` - Fetch user's ESG responses
- `POST /api/responses` - Save new ESG response

### Export
- `GET /api/export/pdf` - Export data as PDF
- `GET /api/export/excel` - Export data as Excel

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify:** Compatible with Next.js
- **Railway:** Full-stack deployment
- **DigitalOcean App Platform:** Scalable hosting

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |

## Project Structure

```
esg-questionnaire/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── responses/      # ESG data endpoints
│   │   └── export/         # Export endpoints
│   ├── components/         # React components
│   ├── context/           # React context providers
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── prisma/
│   └── schema.prisma      # Database schema
├── public/                # Static assets
├── .env.local            # Environment variables
├── package.json          # Dependencies
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

## AI Tools Used

This project was developed with assistance from:
- **Claude Sonnet 4** - Code generation and architecture design
- **GitHub Copilot** - Code completion and suggestions
- **Cursor IDE** - AI-powered development environment

## Future Enhancements

- [ ] Multi-language support
- [ ] Advanced analytics and reporting
- [ ] Integration with external ESG data sources
- [ ] Mobile application
- [ ] Real-time collaboration features
- [ ] Advanced charting and visualization options
- [ ] Automated ESG scoring algorithms
- [ ] Compliance reporting templates 