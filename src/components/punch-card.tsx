"use client";

import { QRCodeSVG } from "qrcode.react";
import { getWavesRemaining, getProgressPercent, formatMemberSince, MAX_WAVES, type Customer } from "@/lib/loyalty";
import { BajaSunset } from "./baja-sunset";
import { PalapaIcon } from "./palapa-icon";

type PunchCardProps = { customer: Customer };

export function PunchCard({ customer }: PunchCardProps) {
  const waves    = customer.waves ?? 0;
  const remaining = getWavesRemaining({ waves });
  const pct       = getProgressPercent({ waves });

  return (
    <section className="relative">
      <div
        className="vintage-card mx-auto max-w-sm overflow-hidden"
        style={{ background: "linear-gradient(to bottom, #d4b896 0%, #e8dcc4 100%)" }}
      >

        {/* ── Logo ── */}
        <div className="px-3 pt-4 pb-2 flex flex-col items-center gap-1">
          <div className="w-full max-w-[320px]">
            <img
              src="/logo-full.png"
              alt="El Burguer Shack"
              className="h-auto w-full object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
          {/* Olas counter */}
          <div className="text-center mt-0.5">
            <p className="font-oswald uppercase text-[#1a3a2f]/50 tracking-widest"
               style={{ fontSize: "clamp(0.6rem, 2.8vw, 0.7rem)" }}>
              Tus Olas
            </p>
            <p className="font-bebas text-[#d9472b] leading-none"
               style={{ fontSize: "clamp(2.2rem, 11vw, 2.8rem)" }}>
              {waves}
              <span className="text-[#d9472b]/50"
                    style={{ fontSize: "clamp(1.1rem, 5.5vw, 1.3rem)" }}>
                /{MAX_WAVES}
              </span>
            </p>
          </div>
        </div>

        {/* ── Member band ── */}
        <div className="px-4 py-2 text-center"
             style={{ background: "linear-gradient(to right, #1a3a2f, #2d5a52)" }}>
          <p className="font-oswald uppercase text-[#d4a574]/90 tracking-widest"
             style={{ fontSize: "clamp(0.62rem, 2.8vw, 0.72rem)" }}>
            {formatMemberSince(customer.memberSince ?? "")}
          </p>
          {customer.totalVisits > 0 && (
            <p className="font-oswald uppercase text-[#d4a574]/60 tracking-widest mt-0.5"
               style={{ fontSize: "clamp(0.55rem, 2.5vw, 0.65rem)" }}>
              {customer.totalVisits} visita{customer.totalVisits !== 1 ? "s" : ""} • {customer.redemptions ?? 0} gratis
            </p>
          )}
        </div>

        {/* ── Wave banner ── */}
        <div className="w-full overflow-hidden" style={{ height: "150px" }}>
          <img
            src="/wave-surfer.png"
            alt="Surf wave"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center center" }}
          />
        </div>

        {/* ── Reward headline — one bold line ── */}
        <div className="px-4 pt-4 pb-2 text-center">
          <p className="font-oswald uppercase text-[#d9472b]/70 tracking-widest"
             style={{ fontSize: "clamp(0.7rem, 3.2vw, 0.8rem)" }}>
            ★ Junta Olas ★
          </p>
          <h1 className="font-bebas text-[#1a3a2f] leading-none mt-1 whitespace-nowrap"
              style={{ fontSize: "clamp(1.7rem, 8.5vw, 2.2rem)", letterSpacing: "0.04em" }}>
            10 Olas = Combo Gratis
          </h1>
          <div className="vintage-divider mt-3 mb-1" />
        </div>

        {/* ── Stamp circles ── */}
        <div className="px-4 pb-4">
          <div className="flex justify-center gap-[0.35rem] flex-wrap">
            {Array.from({ length: MAX_WAVES }).map((_, i) => {
              const earned = i < waves;
              return (
                <div
                  key={i}
                  className="wave-stamp"
                  style={{
                    width: "2.9rem",
                    height: "2.9rem",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: earned ? "2.5px solid #1a3a2f" : "2px dashed rgba(26,58,47,0.3)",
                    boxShadow: earned ? "0 3px 0 #1a3a2f, inset 0 1px 0 rgba(255,255,255,0.3)" : "none",
                    transform: earned ? "rotate(-6deg)" : "rotate(0deg)",
                    filter: earned ? "drop-shadow(1px 2px 3px rgba(0,0,0,0.2))" : "none",
                    background: earned ? "transparent" : "rgba(245,237,224,0.6)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    cursor: "default",
                    transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                >
                  {earned ? (
                    <img
                      src="/wave-surfer.png"
                      alt="Ola ganada"
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }}
                    />
                  ) : (
                    <span style={{
                      fontSize: "0.88rem",
                      fontWeight: 800,
                      color: "rgba(26,58,47,0.45)",
                      fontFamily: "Oswald, sans-serif",
                      letterSpacing: "0.02em",
                    }}>
                      {i + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Status ── */}
        <div className="px-4 pb-3">
          {customer.rewardReady ? (
            <div className="rounded-xl p-4 text-center"
                 style={{
                   background: "linear-gradient(135deg, #d9472b, #8b4513)",
                   boxShadow: "0 4px 0 rgba(0,0,0,0.15)",
                 }}>
              <p className="font-oswald uppercase text-[#f5ede0]/80 tracking-widest"
                 style={{ fontSize: "clamp(0.65rem, 3vw, 0.75rem)" }}>
                🎉 Uno de nosotros
              </p>
              <p className="font-bebas text-[#f5ede0] leading-tight mt-1"
                 style={{ fontSize: "clamp(1.2rem, 6vw, 1.5rem)" }}>
                Combo Gratis — Muéstrale al cajero
              </p>
            </div>
          ) : (
            <div className="rounded-xl p-4"
                 style={{ background: "rgba(245,237,224,0.7)" }}>
              <div className="flex items-center gap-2.5">
                <BajaSunset size={46} />
                <p className="font-pacifico text-[#d9472b]"
                   style={{ fontSize: "clamp(0.85rem, 4vw, 1rem)" }}>
                  ¡Hola {customer.firstName}!
                </p>
              </div>
              <p className="font-bebas text-[#1a3a2f] leading-tight mt-2"
                 style={{ fontSize: "clamp(1.05rem, 5.2vw, 1.25rem)" }}>
                {customer.rewardReady
                  ? "¡Combo gratis listo!"
                  : remaining === 1
                  ? "Ya casi — ¡una ola más!"
                  : `Te faltan ${remaining} olas`}
              </p>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden"
                   style={{ background: "rgba(26,58,47,0.12)" }}>
                <div className="h-full rounded-full transition-all duration-500"
                     style={{ width: `${pct}%`, background: "#d9472b" }} />
              </div>
            </div>
          )}
        </div>

        {/* ── QR ── */}
        <div className="mx-4 mb-4 flex items-center gap-3 rounded-xl p-3"
             style={{ background: "linear-gradient(135deg, #1a3a2f, #2d5a52)" }}>
          <div className="flex-shrink-0 rounded-lg p-2" style={{ background: "#f5ede0" }}>
            <QRCodeSVG value={customer.qrToken ?? "ebs-guest"} size={76} />
          </div>
          <div className="min-w-0">
            <p className="font-oswald uppercase text-[#d4a574] tracking-widest"
               style={{ fontSize: "clamp(0.6rem, 2.8vw, 0.7rem)" }}>
              ★ Eres Local
            </p>
            <p className="font-bebas text-[#d4a574] leading-tight mt-0.5"
               style={{ fontSize: "clamp(1rem, 5vw, 1.15rem)" }}>
              Muestra al cajero
            </p>
            <p className="font-pacifico mt-1.5 text-[#d4a574]/60"
               style={{ fontSize: "clamp(0.65rem, 3vw, 0.75rem)" }}>
              Hecho con pasión en Baja
            </p>
            {(customer.redemptions ?? 0) > 0 && (
              <p className="font-oswald mt-1 uppercase tracking-widest text-[#d4a574]"
                 style={{ fontSize: "clamp(0.6rem, 2.8vw, 0.7rem)" }}>
                🎉 {customer.redemptions} combo{customer.redemptions > 1 ? "s" : ""} gratis
              </p>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-4 pb-5 text-center">
          <span className="inline-flex items-center gap-2 justify-center">
            <p className="font-bebas text-[#1a3a2f]"
               style={{ fontSize: "clamp(1.3rem, 6vw, 1.6rem)", letterSpacing: "0.08em", textShadow: "0 1px 0 rgba(26,58,47,0.2)" }}>
              Ya eres de la casa
            </p>
            <PalapaIcon size={28} />
          </span>
          <p className="font-oswald uppercase text-[#1a3a2f]/40 tracking-widest mt-0.5"
             style={{ fontSize: "clamp(0.6rem, 2.5vw, 0.7rem)" }}>
            Hecho con pasión en Baja
          </p>
        </div>

      </div>
    </section>
  );
}
