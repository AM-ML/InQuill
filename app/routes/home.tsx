"use client"

import React from 'react';
import Hero from '../components/hero';
import FeaturedArticles from '../components/featured-articles';
import Categories from '../components/categories';
import Newsletter from '../components/newsletter';
import { useAuth } from '../lib/contexts/AuthContext';

export default function HomeRoute() {
  const { user } = useAuth();

  return (
    <>
      <Hero />
      <FeaturedArticles />
      <Categories />
      <Newsletter />
    </>
  );
}
