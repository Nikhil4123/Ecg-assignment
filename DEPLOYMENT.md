# Deployment Guide

This guide will help you deploy the ESG Questionnaire application to various platforms.

## Prerequisites

Before deploying, ensure you have:
- A PostgreSQL database (local or cloud)
- Environment variables configured
- All dependencies installed

## Option 1: Vercel (Recommended)

Vercel is the easiest platform for deploying Next.js applications.

### Step 1: Prepare Your Repository
1. Push your code to a GitHub repository
2. Ensure all environment variables are documented

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

### Step 3: Configure Environment Variables
In the Vercel dashboard, go to your project settings and add:

```env
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-vercel-domain.vercel.app"
```

### Step 4: Set Up Database
1. **Option A: Vercel Postgres**
   - In Vercel dashboard, go to Storage
   - Create a new Postgres database
   - Copy the connection string to your environment variables

2. **Option B: External Database**
   - Use services like Supabase, Railway, or PlanetScale
   - Add the connection string to environment variables

### Step 5: Deploy
1. Vercel will automatically deploy on every push to main branch
2. You can also manually deploy from the dashboard
3. Your app will be available at `https://your-project.vercel.app`

## Option 2: Railway

Railway provides full-stack deployment with database hosting.

### Step 1: Set Up Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### Step 2: Add Your Repository
1. Click "Deploy from GitHub repo"
2. Select your repository
3. Railway will automatically detect the Next.js project

### Step 3: Add Database
1. Click "New" → "Database" → "PostgreSQL"
2. Railway will create a PostgreSQL database
3. The connection string will be automatically added to environment variables

### Step 4: Configure Environment Variables
Add these variables in Railway dashboard:
```env
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-railway-domain.railway.app"
```

### Step 5: Deploy
1. Railway will automatically deploy your application
2. Access your app at the provided URL

## Option 3: DigitalOcean App Platform

### Step 1: Prepare Your App
1. Ensure your `package.json` has the correct build script
2. Add a `Dockerfile` if needed (optional)

### Step 2: Deploy to DigitalOcean
1. Go to DigitalOcean App Platform
2. Create a new app
3. Connect your GitHub repository
4. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Output Directory: `.next`

### Step 3: Add Database
1. Create a managed PostgreSQL database
2. Add the connection string to environment variables

### Step 4: Configure Environment Variables
Add all required environment variables in the DigitalOcean dashboard.

## Option 4: Self-Hosted (Docker)

### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Step 2: Create docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/esg_questionnaire
      - JWT_SECRET=your-jwt-secret
      - NEXTAUTH_SECRET=your-nextauth-secret
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=esg_questionnaire
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Step 3: Deploy
```bash
docker-compose up -d
```

## Database Setup for Production

### PostgreSQL Requirements
- PostgreSQL 12 or higher
- At least 1GB storage
- Connection pooling recommended for high traffic

### Recommended Cloud Databases

1. **Vercel Postgres**
   - Easy integration with Vercel
   - Automatic backups
   - Connection pooling included

2. **Supabase**
   - Free tier available
   - Built-in authentication
   - Real-time subscriptions

3. **Railway Postgres**
   - Simple setup
   - Automatic scaling
   - Built-in monitoring

4. **PlanetScale**
   - MySQL-compatible
   - Serverless scaling
   - Branch-based development

## Environment Variables for Production

### Required Variables
```env
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.com"
```

### Optional Variables
```env
# For additional security
NODE_ENV="production"

# For custom domains
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

## SSL and Domain Setup

### Custom Domain with Vercel
1. In Vercel dashboard, go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Configure DNS records as instructed
5. Vercel will automatically provision SSL certificates

### Custom Domain with Other Platforms
- Follow the platform-specific instructions
- Ensure SSL certificates are enabled
- Update `NEXTAUTH_URL` to use your custom domain

## Monitoring and Maintenance

### Health Checks
Add a health check endpoint:
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```

### Logging
- Use platform-specific logging (Vercel, Railway, etc.)
- Consider adding structured logging for production
- Monitor error rates and performance

### Backups
- Enable automatic database backups
- Test restore procedures regularly
- Keep multiple backup copies

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check `DATABASE_URL` format
   - Ensure database is accessible
   - Verify network connectivity

2. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Review build logs for specific errors

3. **Environment Variable Issues**
   - Ensure all required variables are set
   - Check for typos in variable names
   - Verify variable values are correct

4. **Authentication Problems**
   - Verify JWT_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Ensure cookies are working properly

### Performance Optimization

1. **Database Optimization**
   - Add indexes to frequently queried fields
   - Use connection pooling
   - Monitor query performance

2. **Application Optimization**
   - Enable Next.js caching
   - Optimize images and assets
   - Use CDN for static files

3. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Monitor response times
   - Track user engagement metrics

## Security Considerations

1. **Environment Variables**
   - Never commit secrets to version control
   - Use strong, unique secrets
   - Rotate secrets regularly

2. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict database access

3. **Application Security**
   - Keep dependencies updated
   - Enable HTTPS everywhere
   - Implement rate limiting

4. **User Data**
   - Hash passwords properly
   - Validate all inputs
   - Implement proper authorization

## Support

If you encounter issues during deployment:
1. Check the platform's documentation
2. Review error logs
3. Test locally first
4. Contact platform support if needed 