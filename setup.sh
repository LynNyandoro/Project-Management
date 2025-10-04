#!/bin/bash

echo "🚀 Setting up Project Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional check)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB doesn't seem to be installed. Make sure you have MongoDB running or use MongoDB Atlas."
fi

echo "📦 Installing backend dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

echo "🌱 Seeding database with demo data..."
npm run seed

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: npm run dev (from root directory)"
echo "2. Frontend: cd client && npm start"
echo ""
echo "Demo account:"
echo "Email: demo@example.com"
echo "Password: password123"
echo ""
echo "Backend will run on http://localhost:5000"
echo "Frontend will run on http://localhost:3000"
