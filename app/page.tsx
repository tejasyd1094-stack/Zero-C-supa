"use client";

import Image from "next/image";
import GradientButton from "@/components/GradientButton";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  return (
    <div className="py-16">
      <section className="text-center">
        <Image
          src="/logo.png"
          alt="logo"
          width={160}
          height={160}
          className="mx-auto rounded-2xl shadow-lg"
        />
        <h1 className="mt-8 text-4xl font-bold">Zero Conflict</h1>
        <p className="mt-3 text-white/70 max-w-2xl mx-auto">
          AI that helps corporate professionals navigate difficult workplace
          conversations with clarity and empathy.
        </p>

        <GradientButton
          className="mt-8"
          onClick={() => (window.location.href = "/generator")}
        >
          Start Generating Scripts
        </GradientButton>
      </section>

      <section className="mt-16 grid md:grid-cols-3 gap-6">
        <FeatureCard title="Conflict Scripts">
          Get AI-generated messages for tough workplace situations.
        </FeatureCard>

        <FeatureCard title="Role-Based Tones">
          Manager, Peer, Direct-report — tailored communication.
        </FeatureCard>

        <FeatureCard title="One-Click Delivery">
          Export messages instantly as Email, Teams, or WhatsApp text.
        </FeatureCard>
      </section>
    </div>
  );
}
