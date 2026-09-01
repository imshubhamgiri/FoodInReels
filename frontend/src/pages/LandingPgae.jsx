import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import PromoBanner from '../components/landing/PromoBanner';
import ReelsTeaser from '../components/landing/ReelsTeaser';
import FoodFeed from '../components/landing/FoodFeed';
import StatsSection from '../components/landing/StatsSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Bangalore');

  const handleSearch = (query) => {
    setSearchQuery(query);
    const feedElement = document.getElementById('trending-feed');
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D11] text-[#F8FAFC] selection:bg-[#FF462D]/30 selection:text-white relative">
      {/* 1. Header & Navigation */}
      <Navbar 
        onSearch={handleSearch} 
        selectedCity={selectedCity} 
        onCityChange={setSelectedCity} 
      />

      {/* 2. Hero / Promo Banner with Coupon & Carousel */}
      <PromoBanner />

      {/* 3. 'Food in Reels' Discovery CTA */}
      <ReelsTeaser />

      {/* 4. Trending Food Grid with Category Tabs */}
      <FoodFeed searchQuery={searchQuery} />

      {/* 5. Live Stats & Social Proof Metrics */}
      <StatsSection />

      {/* 6. Feature Value Props Grid */}
      <FeaturesGrid />

      {/* 7. Modern Dark Footer with Newsletter */}
      <Footer />
    </div>
  );
};

export default LandingPage;

