import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { Ticker } from "@/components/ticker"
import { TestimonialSection } from "@/components/testimonial-section"
import { DfySection } from "@/components/dfy-section"
import { BentoGrid } from "@/components/bento-grid"
import { ProjectGallery } from "@/components/project-gallery"
import { AchievementsSection } from "@/components/achievements-section"
import { ServicesSection } from "@/components/services-section"
import { PhilosophySection } from "@/components/philosophy-section"
import { ContactFooter } from "@/components/contact-footer"

import { getCachedSiteContent } from "@/lib/supabase/content"

// Force next.js to dynamic rendering to support cookie middleware session routing properly
export const dynamic = 'force-dynamic'

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
      <BentoGrid content={content} />
      <ProjectGallery content={content} />
      <AchievementsSection />
      <ServicesSection content={content} />
      <PhilosophySection />
      <ContactFooter content={content} />
    </main>
  )
}
