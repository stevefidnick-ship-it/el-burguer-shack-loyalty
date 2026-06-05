"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  Barcode,
  Camera,
  CheckCircle2,
  LockKeyhole,
  Search,
  Utensils,
  X,
} from "lucide-react";
import { addPunchForCustomer, findCustomer, redeemRewardForCustomer } from "@/lib/demo-store";
import { canAccessStaffMode, DEFAULT_STAFF_PIN } from "@/lib/staff-access";
import { MAX_WAVES, type Customer } from "@/lib/loyalty";

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
  const [message, setMessage] = useState("Ready");
  const [query, setQuery] = useState("");
  const [scannerOn, setScannerOn] = useState(false);
  const [scannerMessage, setScannerMessage] = useState("Point camera at QR");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const queryRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (unlocked) queryRef.current?.focus();
  }, [unlocked]);

  const runLookup = useCallback((value: string, successMessage: string) => {
    const result = findCustomer(value);
    setQuery(value);
    setCustomer(result);
    setMessage(result ? successMessage : "No match. Ask for phone.");
  }, []);

  useEffect(() => {
    if (!scannerOn || !videoRef.current) return;
    const video = videoRef.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const BarcodeDetector = (window as any).BarcodeDetector as BarcodeDetectorConstructor | undefined;
    if (!BarcodeDetector) {
      return;
    }
    const detector = new BarcodeDetector({ formats: ["qr_code"] });
    let animationId: number;
    const scan = async () => {
      try {
        const barcodes = await detector.detect(video);
        if (barcodes.length > 0) {
          const qrValue = barcodes[0].rawValue;
          setScannerOn(false);
          runLookup(qrValue, "Customer found");
        }
      } catch {
        // Silently continue scanning
      }
      animationId = requestAnimationFrame(scan);
    };
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        scan();
      })
      .catch(() => setScannerMessage("Camera access denied"));
    return () => {
      cancelAnimationFrame(animationId);
      if (video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, [scannerOn, runLookup]);

  function handleUnlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const pin = String(new FormData(event.currentTarget).get("pin") ?? "");
    if (!canAccessStaffMode(pin, configuredStaffPin)) {
      setMessage("Wrong PIN");
      return;
    }
    window.localStorage.setItem(STAFF_SESSION_KEY, "true");
    setUnlocked(true);
    setMessage("✓ Staff unlocked");
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    runLookup(query, "✓ Customer found");
  }

  function addPunch() {
    if (!customer) return;
    const next = addPunchForCustomer(customer);
    setCustomer(next);
    setMessage(next.rewardReady ? "✓ ¡Ya es local!" : "✓ Wave added!");
  }

  function redeem() {
    if (!customer) return;
    const next = redeemRewardForCustomer(customer);
    setCustomer(next);
    setMessage("✓ Burger gratis");
  }

  /* ── PIN gate ── */
  if (!unlocked) {
    return (
      <main
        className="flex min-h-dvh flex-col items-center justify-center px-3 py-4 gap-3"
        style={{ background: "linear-gradient(to bottom, #d4b896 0%, #e8dcc4 100%)" }}
      >
        {/* Brand */}
        <div className="text-center">
          <div className="mx-auto mb-2 w-full max-w-[180px]">
            <img
              src="/logo-full.png"
              alt="El Burguer Shack"
              className="h-auto w-full object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
          <p
            className="font-oswald uppercase text-[#2d5a52] tracking-widest"
            style={{ fontSize: "clamp(0.65rem,3vw,0.75rem)" }}
          >
            Staff Portal
          </p>
        </div>

        {/* PIN form */}
        <form
          onSubmit={handleUnlock}
          className="w-full max-w-[390px] overflow-hidden vintage-frame"
          style={{
            background: "linear-gradient(135deg, #f5ede0, #e8dcc4)",
            border: "3px solid #1a3a2f",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{ background: "linear-gradient(to right, #d9472b, #8b4513)" }}
          >
            <LockKeyhole size={18} strokeWidth={2.5} className="text-[#f5ede0] shrink-0" />
            <div>
              <p
                className="font-oswald uppercase text-[#f5ede0]/70 tracking-widest"
                style={{ fontSize: "clamp(0.65rem,3vw,0.75rem)" }}
              >
                Staff Only
              </p>
              <p
                className="font-bebas text-[#f5ede0] leading-none"
                style={{ fontSize: "clamp(1.25rem,6.5vw,1.5rem)" }}
              >
                Counter Mode
              </p>
            </div>
          </div>

          {/* PIN input */}
          <div className="px-3 pb-3 pt-2">
            <p
              className="font-oswald mb-2 text-center uppercase text-[#2d5a52] tracking-widest"
              style={{ fontSize: "clamp(0.65rem,3vw,0.75rem)" }}
            >
              Enter PIN
            </p>
            <input
              name="pin"
              inputMode="numeric"
              autoFocus
              placeholder="• • • •"
              className="h-12 w-full rounded-lg px-4 text-center font-bebas tracking-[0.35em] outline-none"
              style={{
                fontSize: "clamp(1.75rem,9vw,2.25rem)",
                background: "#f5ede0",
                border: "2px solid #1a3a2f",
                color: "#d9472b",
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            <button
              className="mt-2 h-12 w-full rounded-lg font-bebas tracking-widest text-[#f5ede0] transition-transform active:translate-y-1"
              style={{
                fontSize: "clamp(1.1rem,5.5vw,1.35rem)",
                background: "linear-gradient(135deg, #d9472b, #8b4513)",
                boxShadow: "0 5px 0 rgba(0,0,0,0.2)",
              }}
            >
              Unlock
            </button>
            <p
              className="font-oswald mt-3 text-center uppercase text-[#2d5a52] tracking-widest"
              style={{ fontSize: "clamp(0.72rem,3.5vw,0.875rem)" }}
            >
              {message}
            </p>
          </div>
        </form>
      </main>
    );
  }

  /* ── Cashier mode ── */
  return (
    <main
      className="min-h-dvh px-3 py-3"
      style={{ background: "linear-gradient(to bottom, #d4b896 0%, #e8dcc4 100%)" }}
    >
      <div className="mx-auto flex w-full max-w-[430px] flex-col gap-2">
        {/* Header */}
        <header
          className="vintage-border rounded-lg px-3 py-2"
          style={{
            background: "linear-gradient(135deg, #1a3a2f, #2d5a52)",
            border: "3px solid #1a3a2f",
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="w-24">
              <img
                src="/logo-full.png"
                alt="El Burguer Shack"
                className="h-auto w-full object-contain"
              />
            </div>
            <div className="text-right">
              <p
                className="font-oswald uppercase text-[#d4a574]/50 tracking-widest"
                style={{ fontSize: "clamp(0.62rem,2.8vw,0.72rem)" }}
              >
                Staff Mode
              </p>
              <p
                className="font-bebas text-[#d4a574] leading-none"
                style={{ fontSize: "clamp(1.1rem,5.5vw,1.35rem)" }}
              >
                Counter
              </p>
            </div>
          </div>
        </header>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="vintage-frame rounded-lg px-3 py-2"
          style={{
            background: "linear-gradient(135deg, #d4a574, #c4a876)",
            border: "3px solid #1a3a2f",
          }}
        >
          <p
            className="font-oswald mb-2 flex items-center gap-2 uppercase text-[#1a3a2f] tracking-widest"
            style={{ fontSize: "clamp(0.72rem,3.5vw,0.875rem)" }}
          >
            <Barcode size={18} strokeWidth={2.5} />
            Scan QR or Phone
          </p>
          <label
            className="flex h-11 items-center gap-2 rounded-lg px-3"
            style={{
              background: "#f5ede0",
              border: "2px solid #1a3a2f",
            }}
          >
            <Search size={18} strokeWidth={2.5} className="text-[#1a3a2f]" />
            <input
              ref={queryRef}
              name="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              inputMode="tel"
              placeholder="Phone or QR"
              className="w-full bg-transparent font-oswald font-semibold outline-none placeholder:text-[#c4a876]"
              style={{ fontSize: "clamp(1rem,4.8vw,1.15rem)", color: "#1a3a2f" }}
            />
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setScannerMessage("Point camera at QR");
                setScannerOn(true);
              }}
              className="flex h-11 items-center justify-center gap-2 rounded-lg font-bebas tracking-widest text-[#f5ede0] transition-transform active:translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #1a3a2f, #2d5a52)",
                boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
                fontSize: "clamp(1rem,5vw,1.2rem)",
              }}
            >
              <Camera size={20} strokeWidth={2.5} />
              Scan
            </button>
            <button
              className="flex h-11 items-center justify-center rounded-lg font-bebas tracking-widest text-[#f5ede0] transition-transform active:translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #2d5a52, #1a3a2f)",
                boxShadow: "0 4px 0 rgba(0,0,0,0.2)",
                fontSize: "clamp(1rem,5vw,1.2rem)",
              }}
            >
              Find
            </button>
          </div>
        </form>

        {/* QR Scanner */}
        {scannerOn && (
          <section className="rounded-lg bg-black p-3" style={{ border: "3px solid #1a3a2f" }}>
            <div className="mb-3 flex items-center justify-between">
              <p
                className="font-oswald uppercase text-[#d4a574] tracking-widest"
                style={{ fontSize: "clamp(0.65rem,3vw,0.75rem)" }}
              >
                {scannerMessage}
              </p>
              <button
                type="button"
                onClick={() => setScannerOn(false)}
                className="text-[#d4a574] transition-opacity hover:opacity-70"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            <video
              ref={videoRef}
              className="w-full rounded"
              style={{ aspectRatio: "1" }}
            />
          </section>
        )}

        {/* Customer card or empty state */}
        <section>
          {customer ? (
            <>
              {/* Customer info */}
              <div
                className="vintage-frame rounded-lg px-4 py-4 mb-4"
                style={{
                  background: "linear-gradient(135deg, #f5ede0, #e8dcc4)",
                  border: "3px solid #1a3a2f",
                }}
              >
                <p
                  className="font-bebas text-[#1a3a2f] leading-tight"
                  style={{ fontSize: "clamp(1.3rem,6.5vw,1.6rem)" }}
                >
                  {customer.firstName}
                </p>
                <p
                  className="font-oswald uppercase text-[#2d5a52] tracking-widest mt-1"
                  style={{ fontSize: "clamp(0.65rem,3vw,0.75rem)" }}
                >
                  {customer.waves}/{MAX_WAVES} Waves • {customer.totalVisits} visitas
                </p>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {Array.from({ length: MAX_WAVES }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: i < customer.waves ? "2px solid #1a3a2f" : "2px dashed #d4a574",
                        boxShadow: i < customer.waves ? "0 3px 0 #1a3a2f" : "none",
                        transform: i < customer.waves ? "rotate(-8deg)" : "rotate(0deg)",
                        background: i < customer.waves ? "transparent" : "linear-gradient(135deg, #f5ede0, #e8dcc4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {i < customer.waves ? (
                        <img
                          src="/wave-surfer.png"
                          alt="Wave"
                          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
                        />
                      ) : (
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#1a3a2f", fontFamily: "Oswald, sans-serif" }}>
                          {i + 1}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Sello */}
              <button
                onClick={addPunch}
                disabled={customer.rewardReady}
                className="mt-4 flex h-20 w-full items-center justify-center gap-3 rounded-lg font-bebas tracking-widest text-[#f5ede0] transition-transform active:translate-y-1 disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #d9472b, #8b4513)",
                  boxShadow: "0 6px 0 #1a3a2f",
                  fontSize: "clamp(1.35rem,6.5vw,1.625rem)",
                }}
              >
                <Utensils size={26} strokeWidth={2.5} />
                Add Wave
              </button>

              {/* Redeem */}
              <button
                onClick={redeem}
                disabled={!customer.rewardReady}
                className="mt-3 flex h-20 w-full items-center justify-center gap-3 rounded-lg font-bebas tracking-widest text-[#f5ede0] transition-transform active:translate-y-1 disabled:opacity-40"
                style={{
                  background: "linear-gradient(135deg, #2d5a52, #1a3a2f)",
                  boxShadow: "0 6px 0 rgba(0,0,0,0.2)",
                  fontSize: "clamp(1.35rem,6.5vw,1.625rem)",
                }}
              >
                <CheckCircle2 size={26} strokeWidth={2.5} />
                Burger Gratis
              </button>
            </>
          ) : (
            <div
              className="grid min-h-44 place-items-center rounded-lg text-center"
              style={{ border: "3px dashed rgba(26,58,47,0.25)" }}
            >
              <p
                className="font-bebas max-w-56 leading-tight text-[#8b4513]"
                style={{ fontSize: "clamp(1.25rem,6vw,1.5rem)" }}
              >
                Scan QR or enter phone
              </p>
            </div>
          )}
        </section>

        <Link
          href="/"
          className="font-pacifico text-center text-[#d9472b]"
          style={{ fontSize: "clamp(0.8rem,3.8vw,0.95rem)" }}
        >
          View Customer Card
        </Link>
      </div>
    </main>
  );
}
