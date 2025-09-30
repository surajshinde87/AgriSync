
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorks from "../components/landing/HowItWorks";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import WhyAgriSync from "../components/landing/WhyAgriSync";
import AboutUs from "../components/landing/AboutUs";
import JoinSection from "../components/landing/JoinSection";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <JoinSection/>
      <WhyAgriSync/>
      <AboutUs/>
      <Footer />
    </>
  );
}
