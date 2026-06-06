"use client";

import { QRCodeSVG } from "qrcode.react";
import { getWavesRemaining, getProgressPercent, formatMemberSince, MAX_WAVES, type Customer } from "@/lib/loyalty";
import { BajaSunset } from "./baja-sunset";

type PunchCardProps = { customer: Customer };

export function PunchCard({ customer }: PunchCardProps) {
  const waves     = customer.waves ?? 0;
  const remaining = getWavesRemaining({ waves });
  const pct       = getProgressPercent({ waves });

  return (
    <section className="relative">
      <div
        className="vintage-card mx-auto max-w-sm overflow-hidden"
        style={{ background: "linear-gradient(to bottom, #d4b896 0%, #e8dcc4 100%)" }}
      >

        {/* ── Logo ── */}
        <div className="px-3 pt-0 pb-0 flex flex-col items-center">
          <div className="w-full max-w-[310px]">
            <img
              src="/logo-full.png"
              alt="El Burguer Shack"
              className="h-auto w-full object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
          <div className="text-center mt-0.5">
            <p className="font-oswald uppercase text-[#1a3a2f]/60 tracking-widest"
               style={{ fontSize: "clamp(0.72rem, 3.2vw, 0.8rem)" }}>
              Tus Olas
            </p>
            <p className="font-bebas text-[#d9472b] leading-none"
               style={{ fontSize: "clamp(2rem, 10vw, 2.5rem)" }}>
              {waves}
              <span className="text-[#d9472b]/50"
                    style={{ fontSize: "clamp(1rem, 5vw, 1.2rem)" }}>
                /{MAX_WAVES}
              </span>
            </p>
          </div>
        </div>

        {/* ── Member band ── */}
        <div className="px-4 py-1.5 text-center"
             style={{ background: "linear-gradient(to right, #1a3a2f, #2d5a52)" }}>
          <p className="font-oswald uppercase text-[#d4a574]/90 tracking-widest"
             style={{ fontSize: "clamp(0.68rem, 3vw, 0.78rem)" }}>
            {formatMemberSince(customer.memberSince ?? "")}
          </p>
          {customer.totalVisits > 0 && (
            <p className="font-oswald uppercase text-[#d4a574]/60 tracking-widest"
               style={{ fontSize: "clamp(0.6rem, 2.5vw, 0.68rem)" }}>
              {customer.totalVisits} visita{customer.totalVisits !== 1 ? "s" : ""} • {customer.redemptions ?? 0} gratis
            </p>
          )}
        </div>

        {/* ── Wave banner ── */}
        <div className="w-full overflow-hidden" style={{ height: "120px" }}>
          <img src="/wave-surfer.png" alt="Surf wave"
               className="w-full h-full object-cover"
               style={{ objectPosition: "center center" }} />
        </div>

        {/* ── Reward headline ── */}
        <div className="px-4 pt-2 pb-1 text-center">
          <p className="font-oswald uppercase text-[#d9472b]/70 tracking-widest"
             style={{ fontSize: "clamp(0.72rem, 3.2vw, 0.82rem)" }}>
            ★ Junta Olas ★
          </p>
          <h1 className="font-bebas text-[#1a3a2f] leading-none mt-0.5 whitespace-nowrap"
              style={{ fontSize: "clamp(1.7rem, 8.5vw, 2.2rem)", letterSpacing: "0.04em" }}>
            10 Olas = Combo Gratis
          </h1>
          <div className="vintage-divider mt-2 mb-0" />
        </div>

        {/* ── Stamp circles — 5 × 5 layout ── */}
        <div className="px-4 py-2">
          <div className="flex flex-col gap-1.5 items-center">
            {[0, 5].map((rowStart) => (
              <div key={rowStart} className="flex gap-[0.35rem]">
                {Array.from({ length: 5 }).map((_, j) => {
                  const i = rowStart + j;
                  const earned = i < waves;
                  return (
                    <div
                      key={i}
                      className="wave-stamp"
                      style={{
                        width: "2.85rem",
                        height: "2.85rem",
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
                      }}
                    >
                      {earned ? (
                        <img src="/wave-surfer.png" alt="Ola ganada"
                             style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }} />
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
            ))}
          </div>
        </div>

        {/* ── Progress / status ── */}
        <div className="px-4 pb-1.5">
          {customer.rewardReady ? (
            <div className="rounded-xl p-3.5 text-center"
                 style={{ background: "linear-gradient(135deg, #d9472b, #8b4513)", boxShadow: "0 4px 0 rgba(0,0,0,0.15)" }}>
              <p className="font-oswald uppercase text-[#f5ede0]/80 tracking-widest"
                 style={{ fontSize: "clamp(0.68rem, 3vw, 0.78rem)" }}>
                🎉 Uno de nosotros
              </p>
              <p className="font-bebas text-[#f5ede0] leading-tight mt-0.5"
                 style={{ fontSize: "clamp(1.2rem, 6vw, 1.5rem)" }}>
                Combo Gratis — Muéstrale al cajero
              </p>
            </div>
          ) : (
            <div className="rounded-xl px-4 py-3"
                 style={{ background: "rgba(245,237,224,0.7)" }}>
              <div className="flex items-center gap-3">
                <BajaSunset size={52} />
                <p className="font-boogaloo text-[#d9472b] leading-tight"
                   style={{ fontSize: "clamp(2.2rem, 10.5vw, 2.6rem)" }}>
                  ¡Hola {customer.firstName?.trim() || "Local"}!
                </p>
              </div>
              <p className="font-bebas text-[#1a3a2f] leading-tight mt-1.5"
                 style={{ fontSize: "clamp(1.2rem, 6vw, 1.45rem)" }}>
                {remaining === 1 ? "Ya casi — ¡una ola más!" : `Te faltan ${remaining} olas`}
              </p>
              <div className="mt-1.5 h-1.5 rounded-full overflow-hidden"
                   style={{ background: "rgba(26,58,47,0.12)" }}>
                <div className="h-full rounded-full transition-all duration-500"
                     style={{ width: `${pct}%`, background: "#d9472b" }} />
              </div>
            </div>
          )}
        </div>

        {/* ── QR — final element ── */}
        <div className="mx-4 mb-3 flex items-center gap-3 rounded-xl p-3"
             style={{ background: "linear-gradient(135deg, #1a3a2f, #2d5a52)" }}>
          <div className="flex-shrink-0 rounded-lg p-2" style={{ background: "#f5ede0" }}>
            <QRCodeSVG value={customer.qrToken ?? "ebs-guest"} size={70} />
          </div>
          <div className="min-w-0">
            <p className="font-oswald uppercase text-[#d4a574] tracking-widest"
               style={{ fontSize: "clamp(0.62rem, 2.8vw, 0.72rem)" }}>
              ★ Eres Local
            </p>
            <p className="font-bebas text-[#d4a574] leading-tight mt-0.5"
               style={{ fontSize: "clamp(1.15rem, 5.5vw, 1.35rem)", fontWeight: 700 }}>
              Muestra al cajero
            </p>
            {(customer.redemptions ?? 0) > 0 && (
              <p className="font-oswald mt-0.5 uppercase tracking-widest text-[#d4a574]"
                 style={{ fontSize: "clamp(0.62rem, 2.8vw, 0.72rem)" }}>
                🎉 {customer.redemptions} combo{customer.redemptions > 1 ? "s" : ""} gratis
              </p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
