import { FloatingContactBar } from '@/components/layout/FloatingContactBar';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ClinicGallerySection } from '@/components/sections/ClinicGallerySection';
import { ContactBookingSection } from '@/components/sections/ContactBookingSection';
import { DoctorsSection } from '@/components/sections/DoctorsSection';
import { HeroSection } from '@/components/sections/HeroSection';
import { QuickBookingSection } from '@/components/sections/QuickBookingSection';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { SymptomFaqSection } from '@/components/sections/SymptomFaqSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { VisitProcessSection } from '@/components/sections/VisitProcessSection';
import { ClinicJsonLd } from '@/components/seo/ClinicJsonLd';
import { getClinicPageData } from '@/sanity/queries';

export const revalidate = 3600;

export default async function HomePage() {
  const pageData = await getClinicPageData();

  return (
    <>
      <ClinicJsonLd data={pageData} />
      <Header settings={pageData.settings} />
      <main id="main-content" className="bg-[#FAFAF7] text-[#06231B]">
        <HeroSection settings={pageData.settings} />
        <QuickBookingSection
          settings={pageData.settings}
          services={pageData.services}
        />
        <VisitProcessSection />
        <ClinicGallerySection />
        <ServicesGrid services={pageData.services} />
        <DoctorsSection doctors={pageData.doctors} />
        <TestimonialsSection testimonials={pageData.testimonials} />
        <SymptomFaqSection faqs={pageData.faqs} settings={pageData.settings} />
        <ContactBookingSection
          settings={pageData.settings}
        />
      </main>
      <Footer settings={pageData.settings} />
      <FloatingContactBar settings={pageData.settings} />
    </>
  );
}
