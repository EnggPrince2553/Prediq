import { useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveFeed from './components/LiveFeed';
import Features from './components/Features';
import ProofCam from './components/ProofCam';
import Communities from './components/Communities';
import Leaderboard from './components/Leaderboard';
import WaitlistForm from './components/WaitlistForm';
import Footer from './components/Footer';

function App() {
  // Scroll-triggered animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe all sections for scroll animation
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      section.classList.add('scroll-animate');
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Track page view with GA
  useEffect(() => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: 'Prediq Landing Page',
        page_location: window.location.href,
      });
    }
  }, []);

  // Track button clicks with GA
  useEffect(() => {
    const handleClick = (e) => {
      const btn = e.target.closest('a, button');
      if (!btn) return;

      const label =
        btn.textContent?.trim().substring(0, 50) ||
        btn.getAttribute('aria-label') ||
        'unknown';

      if (typeof gtag !== 'undefined') {
        gtag('event', 'click', {
          event_category: 'engagement',
          event_label: label,
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <LiveFeed />
        <Features />
        <ProofCam />
        <Communities />
        <Leaderboard />
        <WaitlistForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;
