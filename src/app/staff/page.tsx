"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Barcode,
  Camera,
  CheckCircle2,
  Gift,
  LockKeyhole,
  Search,
  Utensils,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/brand";
import { addPunchForCustomer, findCustomer, redeemRewardForCustomer } from "@/lib/demo-store";
import { canAccessStaffMode, DEFAULT_STAFF_PIN } from "@/lib/staff-access";
import { MAX_PUNCHES, type Customer } from "@/lib/loyalty";

const STAFF_SESSION_KEY = "el-burguer-shack-staff-ok";
const configuredStaffPin = process.env.NEXT_PUBLIC_STAFF_PIN ?? DEFAULT_STAFF_PIN;

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => {
  detect(source: HTMLVideoElement): Promise<Array<{ rawValue: string }>>;
};

export default function StaffPage() {
  const [unlocked, setUnlocked] = useState(
    () => typeof window !== "undefined" && window.localStorage.getItem(STAFF_SESSION_KEY) === "true",
  );
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [message, setMessage] = useState("Listo · Ready");
  const [query, setQuery] = useState("");
  const [scannerOn, setScannerOn] = useState(false);
  const [scannerMessage, setScannerMessage] = useState("Apunta la cámara al QR del cliente");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const queryRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (unlocked) queryRef.current?.focus();
  }, [unlocked]);

  const runLookup = useCallback((value: string, successMessage: string) => {
    const result = findCustomer(value);
    setQuery(value);
    setCustomer(result);
    setMessage(result ? successMessage : "Sin resultado · No match. Ask for phone.");
  }, []);

  useEffect(() => {
    if (!scannerOn) return;
    let active = true;
    let stream: MediaStream | null = null;

    async function startScanner() {
      const BarcodeDetectorApi = (window as Window & { BarcodeDetector?: BarcodeDetectorConstructor })
        .BarcodeDetector;
      if (!BarcodeDetectorApi) {
        setScannerMessage("Cámara no compatible — escribe el teléfono");
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        const detector = new BarcodeDetectorApi({ formats: ["qr_code"] });
        async function scanFrame() {
          if (!active || !videoRef.current) return;
          const codes = await detector.detect(videoRef.current);
          const rawValue = codes[0]?.rawValue;
          if (rawValue) { setScannerOn(false); runLookup(rawValue, "✓ QR escaneado"); return; }
          window.setTimeout(scanFrame, 180);
        }
        scanFrame();
      } catch {
        setScannerMessage("Cámara bloqueada — busca por teléfono");
      }
    }
    startScanner();
    return () => { active = false; stream?.getTracks().forEach(t => t.stop()); };
  }, [runLookup, scannerOn]);

  function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const pin = String(new FormData(event.currentTarget).get("pin") ?? "");
    if (!canAccessStaffMode(pin, configuredStaffPin)) {
      setMessage("PIN incorrecto · Wrong PIN");
      return;
    }
    window.localStorage.setItem(STAFF_SESSION_KEY, "true");
    setUnlocked(true);
    setMessage("✓ Acceso concedido · Staff unlocked");
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runLookup(query, "✓ Cliente encontrado · Customer found");
  }

  function addPunch() {
    if (!customer) return;
    const next = addPunchForCustomer(customer);
    setCustomer(next);
    setMessage(next.rewardReady ? "¡9 combos! El 10° es gratis · Reward ready!" : "✓ Punch agregado · Punch added");
  }

  function redeem() {
    if (!customer) return;
    const next = redeemRewardForCustomer(customer);
    setCustomer(next);
    setMessage("✓ 10° combo canjeado · Free combo redeemed");
  }

  /* ── PIN gate ── */
  if (!unlocked) {
    return (
      <main className="shack-night flex min-h-dvh flex-col items-center justify-center px-4 py-8 gap-6">

        {/* Brand above card */}
        <div className="text-center">
          <BrandMark tone="white" className="mx-auto w-[clamp(11rem,52vw,13rem)]" />
          <p className="font-oswald mt-2 uppercase tracking-[0.22em] text-[#c8a032]/70"
             style={{ fontSize: "clamp(0.65rem,3vw,0.75rem)" }}>
            Panel de personal · Staff Portal
          </p>
        </div>

        <form
          onSubmit={handleUnlock}
          className="w-full max-w-[390px] overflow-hidden rounded-[24px]"
          style={{ border: "3px solid rgba(200,160,50,0.25)", boxShadow: "0 12px 40px rgba(0,0,0,0.6)" }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ background: "#c1362a" }}
          >
            <LockKeyhole size={22} strokeWidth={2.5} className="text-[#ede0c2] shrink-0" />
            <div>
              <p className="font-oswald uppercase tracking-[0.18em] text-[#ede0c2]/70"
                 style={{ fontSize: "clamp(0.65rem,3vw,0.75rem)" }}>
                Solo personal · Staff only
              </p>
              <p className="font-bebas text-[#ede0c2] leading-none"
                 style={{ fontSize: "clamp(1.25rem,6.5vw,1.5rem)" }}>
                Modo cajero · Cashier Mode
              </p>
            </div>
          </div>

          {/* PIN input */}
          <div className="bg-[#1e3a2f] px-5 pb-5 pt-4">
            <p className="font-oswald mb-2 text-center uppercase tracking-[0.18em] text-[#c8a032]/70"
               style={{ fontSize: "clamp(0.65rem,3vw,0.75rem)" }}>
              Ingresa tu PIN · Enter PIN
            </p>
            <input
              name="pin"
              inputMode="numeric"
              autoFocus
              placeholder="• • • •"
              className="h-16 w-full rounded-[14px] bg-[#0f2018] px-5 text-center font-bebas tracking-[0.35em] text-[#c8a032] outline-none placeholder:text-[#c8a032]/30"
              style={{
                fontSize: "clamp(1.75rem,9vw,2.25rem)",
                border: "2px solid rgba(200,160,50,0.25)",
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.4)",
              }}
            />
            <button
              className="mt-3 h-14 w-full rounded-[14px] font-bebas tracking-[0.08em] text-[#ede0c2] transition-transform active:translate-y-1"
              style={{
                fontSize: "clamp(1.1rem,5.5vw,1.35rem)",
                background: "#c1362a",
                boxShadow: "0 5px 0 rgba(0,0,0,0.4)",
              }}
            >
              Entrar · Enter
            </button>
            <p className="font-oswald mt-3 text-center uppercase tracking-[0.12em] text-[#c8a032]/60"
               style={{ fontSize: "clamp(0.72rem,3.5vw,0.875rem)" }}>
              {message}
            </p>
          </div>
        </form>
      </main>
    );
  }

  /* ── Cashier mode ── */
  return (
    <main className="shack-night min-h-dvh px-4 py-5">
      <div className="mx-auto flex w-full max-w-[430px] flex-col gap-4">

        {/* Header */}
        <header
          className="rounded-[20px] px-4 py-3"
          style={{ background: "#1e3a2f", border: "3px solid rgba(200,160,50,0.2)" }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col leading-none">
              <span className="font-bebas tracking-[0.22em] text-[#c8a032]"
                    style={{ fontSize: "clamp(0.6rem,2.8vw,0.7rem)" }}>el</span>
              <span className="font-bebas tracking-[0.06em] text-[#ede0c2] leading-none"
                    style={{ fontSize: "clamp(1.05rem,5.2vw,1.25rem)" }}>BURGUER SHACK</span>
              <span className="font-oswald uppercase text-[#c8a032]/70 tracking-[0.18em]"
                    style={{ fontSize: "clamp(0.55rem,2.5vw,0.65rem)" }}>Combo Rewards</span>
            </div>
            <div className="text-right">
              <p className="font-oswald uppercase tracking-[0.14em] text-[#ede0c2]/50"
                 style={{ fontSize: "clamp(0.62rem,2.8vw,0.72rem)" }}>
                Modo cajero
              </p>
              <p className="font-bebas text-[#c8a032] leading-none"
                 style={{ fontSize: "clamp(1.1rem,5.5vw,1.35rem)" }}>
                Cashier Mode
              </p>
            </div>
          </div>
        </header>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="rounded-[20px] px-4 py-4"
          style={{ background: "#c8a032", border: "3px solid #1e3a2f", boxShadow: "0 5px 0 #1e3a2f" }}
        >
          <p className="font-oswald mb-3 flex items-center gap-2 uppercase tracking-[0.14em] text-[#1e3a2f]"
             style={{ fontSize: "clamp(0.72rem,3.5vw,0.875rem)" }}>
            <Barcode size={18} strokeWidth={2.5} />
            Escanear QR o buscar por teléfono
          </p>
          <label
            className="flex h-14 items-center gap-3 rounded-[14px] bg-[#fdf6e8] px-4"
            style={{ border: "2px solid rgba(30,58,47,0.3)" }}
          >
            <Search size={22} strokeWidth={2.5} className="text-[#1e3a2f]" />
            <input
              ref={queryRef}
              name="query"
              value={query}
              onChange={e => setQuery(e.target.value)}
              inputMode="tel"
              placeholder="Teléfono o token QR"
              className="w-full bg-transparent font-oswald font-semibold outline-none placeholder:text-[#9a8060]"
              style={{ fontSize: "clamp(1rem,4.8vw,1.15rem)", color: "#1e3a2f" }}
            />
          </label>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setScannerMessage("Apunta la cámara al QR"); setScannerOn(true); }}
              className="flex h-14 items-center justify-center gap-2 rounded-[14px] font-bebas tracking-[0.08em] text-[#ede0c2] active:translate-y-0.5 transition-transform"
              style={{
                background: "#1e3a2f",
                boxShadow: "0 4px 0 #0a1a12",
                fontSize: "clamp(1rem,5vw,1.2rem)",
              }}
            >
              <Camera size={20} strokeWidth={2.5} />
              Escanear
            </button>
            <button
              className="flex h-14 items-center justify-center rounded-[14px] font-bebas tracking-[0.08em] text-[#ede0c2] active:translate-y-0.5 transition-transform"
              style={{
                background: "#0e6b60",
                boxShadow: "0 4px 0 #0a1a12",
                fontSize: "clamp(1rem,5vw,1.2rem)",
              }}
            >
              Buscar · Find
            </button>
          </div>
        </form>

        {/* QR Scanner */}
        {scannerOn && (
          <section className="rounded-[20px] bg-black p-3" style={{ border: "3px solid #1e3a2f" }}>
            <div className="mb-3 flex items-center justify-between">
              <p className="font-oswald uppercase tracking-[0.12em] text-[#c8a032]"
                 style={{ fontSize: "clamp(0.72rem,3.5vw,0.875rem)" }}>
                {scannerMessage}
              </p>
              <button
                onClick={() => setScannerOn(false)}
                className="grid size-10 place-items-center rounded-full bg-[#ede0c2] text-[#1e3a2f]"
                aria-label="Cerrar escáner"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
            <video
              ref={videoRef}
              className="aspect-[4/3] w-full rounded-[16px] bg-[#1e3a2f] object-cover"
              muted
              playsInline
            />
          </section>
        )}

        {/* Customer panel */}
        <section
          className="rounded-[20px] px-4 py-4"
          style={{ background: "#ede0c2", border: "3px solid #1e3a2f", boxShadow: "0 5px 0 #1e3a2f" }}
        >
          {/* Status message */}
          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="font-oswald uppercase tracking-[0.13em] text-[#0e6b60]"
               style={{ fontSize: "clamp(0.72rem,3.5vw,0.875rem)" }}>
              {message}
            </p>
            {customer?.rewardReady && <Gift size={22} className="shrink-0 text-[#c1362a]" strokeWidth={2.5} />}
          </div>

          {customer ? (
            <>
              <h1
                className="font-bebas text-[#1e3a2f] leading-none"
                style={{ fontSize: "clamp(2.25rem,11vw,2.75rem)" }}
              >
                {customer.firstName}
              </h1>
              <p className="font-oswald text-[#7d6040] mt-1"
                 style={{ fontSize: "clamp(0.9rem,4.5vw,1.1rem)" }}>
                {customer.phone}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[14px] bg-[#c8a032] p-3">
                  <p className="font-oswald uppercase tracking-[0.14em] text-[#1e3a2f]"
                     style={{ fontSize: "clamp(0.62rem,2.8vw,0.72rem)" }}>
                    Combos comprados
                  </p>
                  <p className="font-bebas text-[#1e3a2f] leading-none mt-0.5"
                     style={{ fontSize: "clamp(2.75rem,13vw,3.25rem)" }}>
                    {customer.punches}
                    <span style={{ fontSize: "clamp(1.1rem,5.5vw,1.35rem)" }}>
                      /{MAX_PUNCHES}
                    </span>
                  </p>
                </div>
                <div className="rounded-[14px] px-3 py-3"
                     style={{ background: "#1e3a2f" }}>
                  <p className="font-oswald uppercase tracking-[0.14em] text-[#ede0c2]/55"
                     style={{ fontSize: "clamp(0.62rem,2.8vw,0.72rem)" }}>
                    Recompensa
                  </p>
                  <p className="font-bebas text-[#ede0c2] leading-tight mt-1"
                     style={{ fontSize: "clamp(1rem,5vw,1.2rem)" }}>
                    {customer.rewardReady
                      ? "¡Gratis ahora! 🎉"
                      : `${MAX_PUNCHES - customer.punches} más`}
                  </p>
                </div>
              </div>

              {/* Add punch */}
              <button
                onClick={addPunch}
                disabled={customer.rewardReady}
                className="mt-4 flex h-20 w-full items-center justify-center gap-3 rounded-[16px] font-bebas tracking-[0.06em] text-[#ede0c2] transition-transform active:translate-y-1 disabled:opacity-40"
                style={{
                  background: "#c1362a",
                  boxShadow: "0 6px 0 #1e3a2f",
                  fontSize: "clamp(1.35rem,6.5vw,1.625rem)",
                }}
              >
                <Utensils size={26} strokeWidth={2.5} />
                Agregar Punch · Add Punch
              </button>

              {/* Redeem */}
              <button
                onClick={redeem}
                disabled={!customer.rewardReady}
                className="mt-3 flex h-20 w-full items-center justify-center gap-3 rounded-[16px] font-bebas tracking-[0.06em] text-[#ede0c2] transition-transform active:translate-y-1 disabled:opacity-40"
                style={{
                  background: "#0e6b60",
                  boxShadow: "0 6px 0 #1e3a2f",
                  fontSize: "clamp(1.35rem,6.5vw,1.625rem)",
                }}
              >
                <CheckCircle2 size={26} strokeWidth={2.5} />
                Canjear 10° Gratis · Redeem Free
              </button>
            </>
          ) : (
            <div
              className="grid min-h-44 place-items-center rounded-[16px] text-center"
              style={{ border: "3px dashed rgba(30,58,47,0.25)" }}
            >
              <p className="font-bebas max-w-56 leading-tight text-[#7d6040]"
                 style={{ fontSize: "clamp(1.25rem,6vw,1.5rem)" }}>
                Escanea el QR o ingresa el teléfono
              </p>
            </div>
          )}
        </section>

        <Link
          href="/"
          className="font-pacifico text-center text-[#c8a032]/80"
          style={{ fontSize: "clamp(0.8rem,3.8vw,0.95rem)" }}
        >
          Ver tarjeta del cliente
        </Link>
      </div>
    </main>
  );
}
