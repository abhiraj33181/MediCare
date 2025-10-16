'use client'

import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import LandingHero from "@/components/landing/LandingHero";
import Testinomials from "@/components/landing/Testinomials";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const user = {
    type :'pa'
  }
  const router = useRouter();

  useEffect(() => {
    if(user.type === 'doctor'){
      router.replace('/doctor/dashboard')
    }
  },[user, router])

  if(user?.type === 'doctor') {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <Header showDahsboardNav={false}/>
      <main className="pt-16">
        <LandingHero/>
        <Testinomials/>
        <FAQ/>
        <Footer/>
      </main>
    </div>
  );
}
