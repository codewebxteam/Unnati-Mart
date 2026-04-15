import React from 'react';
import Hero from '../../components/foundation/home/hero';
import HomeCategories from '../category/Categories';
import Story from '../../components/foundation/home/story';
import Events from '../../components/foundation/home/events';
import Testimonials from '../../components/foundation/home/testimonials';

const Home = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. First Impression */}
      <Hero />

      {/* 2. Shop by Category */}
      <HomeCategories />

      {/* 3. The Human Connection & Brand Story */}
      <Story />

      {/* 5. Community & Live Engagement */}
      <Events />

      {/* 6. Social Proof & Customer Trust */}
      <Testimonials />
    </main>
  );
};

export default Home;