"use client";

import HeroSection from "@/components/home/hero-section";
import FeaturedProducts from "@/components/home/featured-products";
import Categories from "@/components/home/categories";
import NewArrivals from "@/components/home/new-arrivals";
import Testimonials from "@/components/home/testimonials";
import Newsletter from "@/components/home/newsletter";
import { SignedIn, SignedOut } from "@clerk/nextjs";


export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      <HeroSection />
      <Categories />
      <FeaturedProducts />
      <Testimonials />
      <SignedOut>
        <Newsletter />
      </SignedOut>
    </div>
  );
}
