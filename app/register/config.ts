// This file configures how Next.js handles the register page during build

// Set to force-dynamic to prevent static prerendering issues with useSearchParams
export const dynamic = 'force-dynamic'

// Disable static generation for this route
export const generateStaticParams = () => {
  return []
}

// Indicate that this page should be dynamically rendered
export const dynamicParams = true 