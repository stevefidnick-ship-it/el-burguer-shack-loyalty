"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, UserRound } from "lucide-react";
import { PunchCard } from "@/components/punch-card";

import { getDemoCustomer, upsertCustomer } from "@/lib/demo-store";
import type { Customer } from "@/lib/loyalty";

export default function Home() {
  const [customer, setCustomer] = useState<Customer | null>(() => getDemoCustomer());

  function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstName = String(formData.get("firstName") ?? "");
    const phone = String(formData.get("phone") ?? "");
    if (firstName && phone) {
      setCustomer(upsertCustomer({ firstName, phone }));
    }
  }

  /* ── Main card view ── */
  return (
    <main className="parchment min-h-dvh px-3 py-3 relative z-10">
      <div className="mx-auto flex max-w-sm flex-col gap-3">

        {/* Splash intro — shown when customer is loaded */}
        {customer && (
          <div className="text-center">
            <div className="mb-2 flex justify-center">
              <img
                src="/logo-full.png"
                alt="El Burguer Shack"
                className="h-auto w-full max-w-[200px] object-contain"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>
            <p
              className="boutique-heading text-[#1a3a2f] leading-tight"
              style={{ fontSize: "clamp(1.8rem, 8vw, 2.2rem)" }}
            >
              Hazte Local
            </p>
            <p
              className="boutique-subheading text-[#d9472b] mt-2"
              style={{ fontSize: "clamp(0.7rem, 3.2vw, 0.8rem)" }}
            >
              Junta Olas · Burgers Gratis
            </p>
            <p
              className="font-pacifico mt-2"
              style={{
                fontSize: "clamp(1.2rem, 5.5vw, 1.5rem)",
                color: "#d9472b",
                textShadow: "0 1px 0 rgba(0,0,0,0.15)",
                fontWeight: 700,
              }}
            >
              Ya eres de la casa 🏠
            </p>
          </div>
        )}

        {/* Punch card */}
        {customer && <PunchCard customer={customer} />}

        {/* Signup form — shown when no customer */}
        {!customer && (
          <div className="flex flex-col gap-6">
            {/* Intro section */}
            <div className="text-center">
              <p
                className="boutique-heading text-[#1a3a2f] leading-tight"
                style={{ fontSize: "clamp(1.8rem, 8vw, 2.2rem)" }}
              >
                Hazte Local
              </p>
              <p
                className="boutique-subheading text-[#d9472b] mt-2"
                style={{ fontSize: "clamp(0.7rem, 3.2vw, 0.8rem)" }}
              >
                Junta Olas · Burgers Gratis
              </p>
              <p
                className="font-pacifico mt-2"
                style={{
                  fontSize: "clamp(1.2rem, 5.5vw, 1.5rem)",
                  color: "#d9472b",
                  textShadow: "0 1px 0 rgba(0,0,0,0.15)",
                  fontWeight: 700,
                }}
              >
                Ya eres de la casa 🏠
              </p>
            </div>

            {/* Signup form */}
            <form
              onSubmit={handleSignup}
              className="vintage-frame"
              style={{
                background: "linear-gradient(135deg, #f5ede0 0%, #e8dcc4 100%)",
                border: "3px solid #1a3a2f",
              }}
            >
              <p
                className="boutique-heading text-[#1a3a2f] leading-tight mb-4"
                style={{ fontSize: "clamp(1.3rem, 6.5vw, 1.6rem)" }}
              >
                Únete a Nosotros
              </p>
              <p
                className="boutique-subheading text-[#d9472b] mb-4"
                style={{ fontSize: "clamp(0.65rem, 3vw, 0.75rem)" }}
              >
                Olas para locales · Burgers para amigos
              </p>

              <label
                className="mb-3 flex h-13 items-center gap-3 rounded-lg px-4"
                style={{
                  background: "#f5ede0",
                  border: "2px solid #1a3a2f",
                  boxShadow: "0 3px 0 rgba(26,58,47,0.15)",
                }}
              >
                <UserRound size={20} strokeWidth={2.5} className="shrink-0 text-[#2d5a52]" />
                <input
                  name="firstName"
                  required
                  placeholder="Tu nombre · Your name"
                  className="w-full bg-transparent font-oswald font-semibold outline-none placeholder:text-[#c4a876]"
                  style={{ fontSize: "clamp(1rem,4.5vw,1.1rem)", color: "#1a3a2f" }}
                />
              </label>

              <label
                className="mb-4 flex h-13 items-center gap-3 rounded-lg px-4"
                style={{
                  background: "#f5ede0",
                  border: "2px solid #1a3a2f",
                  boxShadow: "0 3px 0 rgba(26,58,47,0.15)",
                }}
              >
                <span className="shrink-0 font-oswald font-semibold text-[#2d5a52]">📱</span>
                <input
                  name="phone"
                  required
                  inputMode="tel"
                  placeholder="Tu teléfono · Your phone"
                  className="w-full bg-transparent font-oswald font-semibold outline-none placeholder:text-[#c4a876]"
                  style={{ fontSize: "clamp(1rem,4.5vw,1.1rem)", color: "#1a3a2f" }}
                />
              </label>

              <button
                className="flex h-14 w-full items-center justify-center gap-2 rounded-lg font-bebas tracking-widest text-[#f5ede0] transition-transform active:translate-y-1"
                style={{
                  background: "linear-gradient(135deg, #d9472b, #8b4513)",
                  boxShadow: "0 6px 0 #1a3a2f",
                  fontSize: "clamp(1.1rem,5.5vw,1.35rem)",
                }}
              >
                Únete Ahora
                <ArrowRight size={20} strokeWidth={2.5} />
              </button>
            </form>

            {/* Footer message */}
            <p
              className="font-pacifico text-center text-[#d9472b]"
              style={{ fontSize: "clamp(0.8rem, 3.8vw, 0.95rem)" }}
            >
              Hecho con pasión en Baja
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
