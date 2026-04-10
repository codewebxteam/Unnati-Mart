import React from 'react';
// Sabhi components PascalCase mein import kiye gaye hain
import Hero from '../../components/foundation/home/hero';
import Story from '../../components/foundation/home/story';
import Root from '../../components/foundation/home/root';
import Events from '../../components/foundation/home/events';
import Testimonials from '../../components/foundation/home/testimonials';

const Home = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. First Impression */}
      <Hero />
      
      {/* 3. The Human Connection & Brand Story */}
      <Story />
      
      {/* 4. Scientific Proof & Methodology */}
      <Root />
      
      {/* 5. Community & Live Engagement */}
      <Events />
      
      {/* 6. Social Proof & Customer Trust */}
      <Testimonials />
    </main>
  );
};

export default Home;