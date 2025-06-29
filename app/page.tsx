"use client";

import NavBar from "@/components/common/NavBar";
import BannerSlider from "@/components/shared/BannerSlider";
import Slider from "@/components/shared/Slider";
import Footer from "@/components/common/Footer";
import { homeSliders } from "@/constants/config";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary page-transition font-netflix">
      <NavBar />
      <BannerSlider category="movie" />
      
      <div className="space-y-12 pb-16">
        {homeSliders.map((slider) => (
            <Slider
              key={slider.id}
              title={slider.title}
              endpoint={slider.endpoint}
              category={slider.category}
              autoScroll={slider.autoScroll}
              type={slider.type}
              cardWidth={slider.cardWidth}
            />
        ))}
      </div>

      <Footer />
    </main>
  );
}
