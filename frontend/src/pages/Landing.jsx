import { useEffect } from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import ProblemSection from '../components/landing/ProblemSection';
import CapabilitiesSection from '../components/landing/CapabilitiesSection';
import HowItWorks from '../components/landing/HowItWorks';
import DashboardPreview from '../components/landing/DashboardPreview';
import InsightSection from '../components/landing/InsightSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

export default function Landing() {
  useEffect(() => {
    document.title = 'RiazAI — Personal Music Practice Intelligence';
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-primary-100 selection:text-primary-800">
      {/* 1. Navbar */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero */}
        <Hero />

        {/* 3. Problem */}
        <ProblemSection />

        {/* 4. Core Capabilities */}
        <CapabilitiesSection />

        {/* 5. How It Works */}
        <HowItWorks />

        {/* 6. Dashboard Preview */}
        <DashboardPreview />

        {/* 7. Progress / Insight Section */}
        <InsightSection />

        {/* 8. Call to Action */}
        <CTASection />
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
}