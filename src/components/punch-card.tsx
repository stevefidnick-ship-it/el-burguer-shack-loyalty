"use client";

import { QRCodeSVG } from "qrcode.react";
import { Sparkles } from "lucide-react";
import clsx from "clsx";
import { getPunchSlots, MAX_PUNCHES, type Customer } from "@/lib/loyalty";
import { BrandMark } from "./brand";
import { BurgerIcon } from "./burger-icon";

type PunchCardProps = { customer: Customer };

/** Five filled stars rendered as text */
function Stars({ count = 5 }: { count?: number }) {
  return (
    <span className="tracking-[0.05em] text-[#c8a032]" aria-label={`${count} stars`}>
      {"★".repeat(count)}
    </span>
  );
}

export function PunchCard({ customer }: PunchCardProps) {
  const slots = getPunchSlots(customer);
  const remaining = MAX_PUNCHES - customer.punches;
  const pct = Math.round((customer.punches / MAX_PUNCHES) * 100);

  return (
    <section
      className="relative overflow-hidden rounded-[22px]"
      style={{
        border: "4px solid #1e3a2f",
        background: "#ede0c2",
        boxShadow: "0 14px 0 #1e3a2f",
      }}
    >
      {/* ── Header band ── */}
      <div
        className="relative px-4 pt-3 pb-0"
        style={{ background: "#1e3a2f" }}
      >
        <div className="flex items-center justify-between gap-3">
          {/* Text-based brand mark — always crisp on dark green */}
          <div className="flex flex-col leading-none">
            <span
              className="font-bebas tracking-[0.06em] text-[#c8a032]"
              style={{ fontSize: "clamp(0.6rem,2.8vw,0.7rem)", letterSpacing: "0.22em" }}
            >
              el
            </span>
            <span
              className="font-bebas tracking-[0.06em] text-[#ede0c2] leading-none"
              style={{ fontSize: "clamp(1.05rem,5.2vw,1.25rem)" }}
            >
              BURGUER SHACK
            </span>
            <span
              className="font-oswald uppercase text-[#c8a032]/70 tracking-[0.18em]"
              style={{ fontSize: "clamp(0.55rem,2.5vw,0.65rem)" }}
            >
              Combo Rewards
            </span>
          </div>
          <div className="text-right">
            <p className="font-oswald text-[#ede0c2]/55 uppercase tracking-[0.14em]"
               style={{ fontSize: "clamp(0.65rem,3vw,0.75rem)" }}>
              Punches
            </p>
            <p
              className="font-bebas text-[#ede0c2] leading-none"
              style={{ fontSize: "clamp(2rem,10vw,2.5rem)" }}
            >
              {customer.punches}
              <span className="text-[#ede0c2]/40"
                    style={{ fontSize: "clamp(1rem,5vw,1.25rem)" }}>
                /{MAX_PUNCHES}
              </span>
            </p>
          </div>
        </div>

        {/* Tear-off notches + dashed line */}
        <div className="tear-line mt-3 -mx-1">
          <div className="tear-notch" />
          <div className="tear-notch" />
        </div>
      </div>

      {/* ── Hero copy ── */}
      <div className="px-4 pt-4 pb-0">
        <p className="font-oswald uppercase tracking-[0.18em] text-[#c1362a]"
           style={{ fontSize: "clamp(0.7rem,3.2vw,0.8rem)" }}>
          ★ Programa de Recompensas · Combo Rewards ★
        </p>
        <h1
          className="font-bebas leading-[0.9] text-[#1e3a2f] mt-1"
          style={{ fontSize: "clamp(2.25rem,11.5vw,2.75rem)" }}
        >
          Compra 9 combos
        </h1>
        {/* Brushstroke banner */}
        <div
          className="relative mt-1 inline-block px-3 py-1"
          style={{
            background: "#c1362a",
            clipPath: "polygon(0 8%, 2% 0, 98% 2%, 100% 10%, 99% 92%, 97% 100%, 3% 98%, 0 90%)",
          }}
        >
          <p
            className="font-bebas tracking-[0.06em] text-[#ede0c2]"
            style={{ fontSize: "clamp(1.5rem,8vw,1.875rem)" }}
          >
            ¡El 10° es GRATIS! · 10th FREE
          </p>
        </div>
      </div>

      {/* ── Punch grid ── */}
      <div
        className={clsx(
          "relative mx-4 mt-4 grid grid-cols-3 gap-[10px] rounded-[16px] p-3",
          customer.rewardReady ? "checker-red" : "checker-paper",
        )}
        style={{ border: "3px solid #1e3a2f" }}
      >
        {slots.map((slot, i) => (
          <div
            key={slot.id}
            className={clsx(
              "grid aspect-square place-items-center rounded-[12px] transition-all duration-150",
              slot.filled ? "stamp-filled" : "stamp-empty",
            )}
            aria-label={slot.filled ? "Punch earned" : "Empty slot"}
          >
            {slot.filled ? (
              <BurgerIcon className="burger-stamp" preferReal />
            ) : (
              <span
                className="font-bebas text-[#1e3a2f]/20"
                style={{ fontSize: "clamp(1.1rem,5.5vw,1.3rem)" }}
                aria-hidden
              >
                {i + 1}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ── Status ── */}
      {customer.rewardReady ? (
        <div
          className="shimmer relative mx-4 mt-4 overflow-hidden rounded-[16px] px-4 py-3"
          style={{
            background: "#c1362a",
            border: "3px solid #1e3a2f",
            boxShadow: "0 5px 0 #1e3a2f",
          }}
        >
          <div className="relative flex items-center gap-3">
            <Sparkles className="size-8 shrink-0 text-[#ede0c2]" strokeWidth={2} />
            <div>
              <p className="font-oswald uppercase tracking-[0.18em] text-[#ede0c2]/70"
                 style={{ fontSize: "clamp(0.65rem,3vw,0.75rem)" }}>
                ¡Recompensa desbloqueada! · Reward unlocked
              </p>
              <p className="font-bebas text-[#ede0c2] leading-none"
                 style={{ fontSize: "clamp(1.35rem,7vw,1.65rem)" }}>
                Combo gratis — muéstrale al cajero
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="mx-4 mt-4 flex items-center justify-between rounded-[16px] bg-[#fdf6e8] px-4 py-3"
          style={{ border: "2px solid rgba(30,58,47,0.15)" }}
        >
          <div>
            <p className="font-oswald uppercase tracking-[0.12em] text-[#0e6b60]"
               style={{ fontSize: "clamp(0.65rem,3vw,0.75rem)" }}>
              Hola {customer.firstName} 👋
            </p>
            <p className="font-oswald font-bold text-[#1e3a2f] leading-tight mt-0.5"
               style={{ fontSize: "clamp(1rem,4.8vw,1.2rem)" }}>
              {remaining === 1
                ? "¡Solo 1 combo más! · 1 more to go!"
                : `${remaining} combos más · ${remaining} to go`}
            </p>
          </div>
          <div>
            <Stars count={Math.min(5, customer.punches)} />
            <div
              className="mt-1 h-2 rounded-full overflow-hidden"
              style={{ width: "3.5rem", background: "rgba(30,58,47,0.12)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: "#0e6b60" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── QR / cashier section ── */}
      <div
        className="mx-4 mt-4 mb-4 flex items-center gap-4 rounded-[16px] px-4 py-4"
        style={{ background: "#1e3a2f" }}
      >
        <div
          className="rounded-[12px] bg-white p-2 shrink-0"
          style={{ boxShadow: "0 4px 0 rgba(0,0,0,0.35)" }}
        >
          <QRCodeSVG value={customer.qrToken} size={84} />
        </div>
        <div className="min-w-0">
          <p className="font-oswald uppercase tracking-[0.14em] text-[#ede0c2]/55"
             style={{ fontSize: "clamp(0.65rem,3vw,0.75rem)" }}>
            ★ Muéstrale al cajero · Show cashier
          </p>
          <p className="font-bebas text-[#c8a032] leading-tight mt-1"
             style={{ fontSize: "clamp(1rem,5vw,1.2rem)" }}>
            Escanear para punch o canjear
          </p>
          <p className="font-pacifico mt-1 text-[#ede0c2]/40"
             style={{ fontSize: "clamp(0.7rem,3.2vw,0.8rem)" }}>
            Hecho con pasión en Baja
          </p>
          {customer.redemptions > 0 && (
            <p className="font-oswald mt-2 uppercase tracking-[0.1em] text-[#0e6b60]"
               style={{ fontSize: "clamp(0.65rem,3vw,0.75rem)" }}>
              🎉 {customer.redemptions} combo{customer.redemptions > 1 ? "s" : ""} gratis canjeado{customer.redemptions > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
