#!/bin/bash

# Temple Management System - Quick Start Script
# This script helps you get started with the integration

echo "🕉️  Temple Management System - Quick Start"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install additional dependencies
echo "📦 Installing additional dependencies..."
npm install @stripe/stripe-js stripe @tanstack/react-query-devtools

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local file not found"
    echo "Please create .env.local with your Supabase and Stripe credentials"
    echo "See .env.local.example for reference"
else
    echo "✅ Environment file found"
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "📥 Installing Supabase CLI..."
    npm install -g supabase
else
    echo "✅ Supabase CLI is installed"
fi

echo ""
echo "🚀 Next Steps:"
echo "=============="
echo ""
echo "1. 📊 Set up your database:"
echo "   - Go to your Supabase dashboard: https://supabase.com/dashboard"
echo "   - Open SQL Editor"
echo "   - Run the complete schema from: claude-backend-files-dump/schema-rsl.txt"
echo "   - Then run: setup-database.sql"
echo ""
echo "2. 🔑 Generate TypeScript types:"
echo "   supabase login"
echo "   supabase link --project-ref eqltkcrsbvvxcrqnklwk"
echo "   supabase gen types typescript --project-id eqltkcrsbvvxcrqnklwk > src/integrations/supabase/types.ts"
echo ""
echo "3. 💳 Set up Stripe (optional for donations):"
echo "   - Get your keys from: https://dashboard.stripe.com/apikeys"
echo "   - Add them to .env.local"
echo ""
echo "4. 🏃‍♂️ Start the development server:"
echo "   npm run dev"
echo ""
echo "5. 👤 Create your first admin user:"
echo "   - Sign up through the app"
echo "   - Run in Supabase SQL Editor: SELECT public.make_super_admin('your-email@example.com');"
echo "   - Run: SELECT public.create_default_community('your-email@example.com');"
echo ""
echo "📚 For detailed instructions, see: INTEGRATION_GUIDE.md"
echo ""
echo "🆘 Need help? Check the troubleshooting section in the guide"