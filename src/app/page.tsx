"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Phone, UserRound } from "lucide-react";
import { PunchCard } from "@/components/punch-card";
import { BrandMark } from "@/components/brand";
import { BurgerIcon } from "@/components/burger-icon";
import { getDemoCustomer, upsertCustomer } from "@/lib/demo-store";
import type { Customer } from "@/lib/loyalty";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCustomer(getDemoCustomer());
      setLoading(false);
    }, 1500);
    return () => window.clearTimeout(timer);
  }, []);

  function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "");
    const phone = String(formData.get("phone") ?? "");
    setCustomer(upsertCustomer({ firstName, phone }));
  }

  /* ── Splash screen ── */
  if (loading) {
    return (
      <main
        className="grid min-h-dvh place-items-center overflow-hidden"
        style={{ background: "linear-gradient(175deg, #1e3a2f 0%, #0f2018 100%)" }}
      >
        {/* Glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 38%, rgba(200,160,50,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative flex flex-col items-center gap-7 px-6 text-center">
          {/* Floating burger */}
          <div
            className="floaty grid place-items-center rounded-[2rem]"
            style={{
              width:  "clamp(7.5rem,35vw,9rem)",
              height: "clamp(7.5rem,35vw,9rem)",
              border: "3px solid rgba(200,160,50,0.35)",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))",
              boxShadow: "0 1rem 0 rgba(0,0,0,0.4), 0 0 50px rgba(193,54,42,0.2)",
            }}
          >
            <BurgerIcon
              className="h-[clamp(5rem,25vw,6rem)] w-[clamp(6rem,29vw,7rem)]"
              preferReal
            />
          </div>

          {/* Logo */}
          <div className="pop-in" style={{ animationDelay: "0.25s" }}>
            <BrandMark tone="white" />
          </div>

          {/* Tagline */}
          <div className="slide-up flex flex-col items-center gap-3" style={{ animationDelay: "0.45s" }}>
            <p
              className="font-bebas tracking-[0.12em] text-[#c8a032]"
              style={{ fontSize: "clamp(1.5rem,7.5vw,1.875rem)" }}
            >
              Combo Rewards
            </p>
            <p className="font-oswald text-[#ede0c2]/60 uppercase tracking-[0.2em]"
               style={{ fontSize: "clamp(0.75rem,3.5vw,0.875rem)" }}>
              Compra 9 · El 10° es GRATIS
            </p>
          </div>

          {/* Dots */}
          <div className="flex gap-2">
            {[0, 0.18, 0.36].map((delay, i) => (
              <span
                key={i}
                className="block size-2 rounded-full bg-[#c1362a]"
                style={{ animation: `floaty 1.1s ease-in-out ${delay}s infinite` }}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* ── Main card view ── */
  return (
    <main className="parchment min-h-dvh px-4 py-6">
      <div className="relative z-10 mx-auto flex w-full max-w-[430px] flex-col gap-5">

        {/* Header */}
        <header className="flex items-center justify-between px-1">
          <BrandMark compact tone="green" className="w-[clamp(9rem,44vw,10rem)]" />
          <div className="text-right">
            <p
              className="font-bebas tracking-[0.08em] text-[#c1362a] leading-none"
              style={{ fontSize: "clamp(1rem,5vw,1.2rem)" }}
            >
              Combo Rewards
            </p>
            <p className="font-oswald uppercase tracking-[0.15em] text-[#1e3a2f]/40"
               style={{ fontSize: "clamp(0.6rem,2.8vw,0.7rem)" }}>
              Tarjeta digital
            </p>
          </div>
        </header>

        {/* Punch card */}
        {customer ? <PunchCard customer={customer} /> : null}

        {/* Sign-up / recovery form */}
        <div
          className="rounded-[20px] p-[3px]"
          style={{
            background: "linear-gradient(135deg, #1e3a2f, #c1362a)",
            boxShadow: "0 8px 0 #1e3a2f",
          }}
        >
          <form
            onSubmit={handleSignup}
            className="rounded-[18px] bg-[#ede0c2] p-4"
          >
            {/* Bilingual header */}
            <p
              className="font-bebas tracking-[0.06em] text-[#1e3a2f] leading-none"
              style={{ fontSize: "clamp(1.5rem,7.5vw,1.875rem)" }}
            >
              Únete o recupera tu tarjeta
            </p>
            <p className="font-oswald mb-4 text-[#1e3a2f]/50 uppercase tracking-[0.12em]"
               style={{ fontSize: "clamp(0.7rem,3.2vw,0.8rem)" }}>
              Join or recover your card
            </p>

            <label className="mb-3 flex h-13 items-center gap-3 rounded-[14px] bg-[#fdf6e8] px-4"
                   style={{ border: "2px solid rgba(30,58,47,0.2)", boxShadow: "0 3px 0 rgba(30,58,47,0.15)" }}>
              <UserRound size={20} strokeWidth={2.5} className="shrink-0 text-[#0e6b60]" />
              <input
                name="firstName"
                required
                placeholder="Nombre / First name"
                className="w-full bg-transparent font-oswald font-semibold outline-none placeholder:text-[#a09070]"
                style={{ fontSize: "clamp(1rem,4.5vw,1.1rem)" }}
              />
            </label>

            <label className="mb-4 flex h-13 items-center gap-3 rounded-[14px] bg-[#fdf6e8] px-4"
                   style={{ border: "2px solid rgba(30,58,47,0.2)", boxShadow: "0 3px 0 rgba(30,58,47,0.15)" }}>
              <Phone size={20} strokeWidth={2.5} className="shrink-0 text-[#0e6b60]" />
              <input
                name="phone"
                required
                inputMode="tel"
                placeholder="Teléfono / Phone"
                className="w-full bg-transparent font-oswald font-semibold outline-none placeholder:text-[#a09070]"
                style={{ fontSize: "clamp(1rem,4.5vw,1.1rem)" }}
              />
            </label>

            <button
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[14px] font-bebas tracking-[0.08em] text-white transition-transform active:translate-y-1"
              style={{
                background: "#c1362a",
                boxShadow: "0 6px 0 #1e3a2f",
                fontSize: "clamp(1.1rem,5.5vw,1.35rem)",
              }}
            >
              Empezar a coleccionar · Start collecting
              <ArrowRight size={20} strokeWidth={2.5} />
            </button>
          </form>
        </div>

        {/* Footer */}
        <p
          className="font-pacifico text-center text-[#1e3a2f]/40"
          style={{ fontSize: "clamp(0.8rem,3.5vw,0.95rem)" }}
        >
          Hecho con pasión en Baja
        </p>
      </div>
    </main>
  );
}
