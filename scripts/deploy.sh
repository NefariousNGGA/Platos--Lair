#!/bin/bash

# Public App Deploy Script for Termux/Render

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the public-app directory?"
    exit 1
fi

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Step 2: Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Step 3: Run database migrations
echo "🔄 Running database migrations..."
if [ -n "$DATABASE_URL" ]; then
    npx prisma migrate deploy
    echo "✅ Database migrated successfully"
else
    echo "⚠️ DATABASE_URL not set, skipping migrations"
fi

# Step 4: Build the application
echo "🔨 Building application..."
npm run build

# Step 5: Start the application
echo "🎉 Starting application..."
npm start