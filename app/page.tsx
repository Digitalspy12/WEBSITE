import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { Ticker } from "@/components/ticker"
import { TestimonialSection } from "@/components/testimonial-section"
import { DfySection } from "@/components/dfy-section"
import { ProjectGallery } from "@/components/project-gallery"
import { AchievementsSection } from "@/components/achievements-section"
import { ServicesSection } from "@/components/services-section"
import { ProcessSection } from "@/components/process-section"
import { ContactFooter } from "@/components/contact-footer"

import { getCachedSiteContent } from "@/lib/supabase/content"

// ISR: Regenerate static HTML every 1 hour (3600s).
// Serves cached pages instantly. If Supabase is down during regeneration,
// stale-while-revalidate serves the last good version automatically.
// Admin saves trigger revalidateTag('site-content') for instant refresh.
export const revalidate = 3600

export default async function Home() {
  // Fetch entire Supabase site content in a single fast, cached server database round-trip
  const content = await getCachedSiteContent()

  return (
    <main>
      <Navbar content={content} />
      <HeroSection content={content} />
      <Ticker />
      <TestimonialSection content={content} />
      <DfySection />
      <ServicesSection content={content} />
      <ProcessSection />
      <ProjectGallery content={content} />
      <AchievementsSection />
      <ContactFooter content={content} />
    </main>
  )
}
