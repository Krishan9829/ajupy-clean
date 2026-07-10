# AI Saree Design Generator

A premium Next.js SaaS starter for generating saree concepts with authentication, history, collections, credits, billing, and admin oversight.

## Setup

1. Create a Supabase project and run the SQL from supabase-schema.sql.
2. Configure environment variables:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET
   - NEXT_PUBLIC_SITE_URL
3. Create a Stripe checkout price and set STRIPE_PRO_PRICE_ID.
4. Deploy to Vercel.
