"use client";

import HeroSection from "@/components/home/hero-section";
import FeaturedProducts from "@/components/home/featured-products";
import Categories from "@/components/home/categories";
import Testimonials from "@/components/home/testimonials";
import Newsletter from "@/components/home/newsletter";
import { SignedOut } from "@clerk/nextjs";


export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      <HeroSection />
      <FeaturedProducts />
      <Testimonials />
      <SignedOut>
        <Newsletter />
      </SignedOut>
    </div>
  );
}
