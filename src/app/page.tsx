'use client';

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import './globals.css'
import LandingPage from "@/components/landingPage";

export default function Home() {

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        <LandingPage />   
      </div>

      <Footer />
    </>
  );
}
