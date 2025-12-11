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
          AI that helps anyone — professionals or individuals — craft calm, clear,
          and effective messages. Use it for workplace conversations or personal
          situations (with friends, partners, family, siblings and more).
        </p>

        <p className="mt-3 text-white/60 max-w-2xl mx-auto">
          Choose a tone, describe the situation, select how the person behaves,
          and get ready-to-send scripts for email, chat, Teams, or face-to-face.
        </p>

        <GradientButton
          className="mt-8"
          onClick={() => (window.location.href = "/generator")}
        >
          Generate Your First Script (3 free trials)
        </GradientButton>
      </section>

      <section className="mt-16 grid md:grid-cols-3 gap-6">
        <FeatureCard title="Personal & Professional">
          Works for corporate conversations <strong>and</strong> personal talks:
          friends, parents, partners, or siblings.
        </FeatureCard>

        <FeatureCard title="Tone Options">
          Get empathetic, direct, or clever variants so you can choose how bold
          you want to be.
        </FeatureCard>

        <FeatureCard title="Delivery Modes">
          Export or copy scripts for email, Teams, WhatsApp, Slack or face-to-face.
        </FeatureCard>
      </section>
    </div>
  );
}