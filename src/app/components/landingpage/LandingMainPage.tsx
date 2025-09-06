
"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { StaticImageData } from "next/image";
import NextImage from "next/image";
import lemon from "../../../../public/images/lemon.png";
import orange from "../../../../public/images/orange.png";
import blast from "../../../../public/images/blast.png";
type Product = {
  id: string | number;
  name: string;
  image: string | StaticImageData;
  description?: string;
  price?: number;
};

type Props = {
  products?: Product[];
  height?: string | number;
};


const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, l];
};

const toHex = (r: number, g: number, b: number) =>
  `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;

const getVibrantColor = async (
  src: string,
  defaultColor = "#8edb55"
): Promise<string> => {
  try {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = () => rej("Image load failed");
    });

    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return defaultColor;

    ctx.drawImage(img, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);

    let bestScore = 0,
      bestColor: [number, number, number] | null = null;
    // let avg = [0, 0, 0],
    //   count = 0;
    const avg = [0, 0, 0];
let count = 0;


    for (let i = 0; i < data.length; i += 4) {
      const [r, g, b, a] = data.slice(i, i + 4);
      if (a < 128) continue;

      const [h, s, l] = rgbToHsl(r, g, b);
      if (l > 0.92 || l < 0.08) continue;

      const score = Math.pow(s, 1.6) * (1 - Math.abs(l - 0.5));
      if (score > bestScore) {
        bestScore = score;
        bestColor = [r, g, b];
      }

      avg[0] += r;
      avg[1] += g;
      avg[2] += b;
      count++;
    }

    if (bestColor) return toHex(...bestColor);
    if (count > 0)
      return toHex(
        Math.round(avg[0] / count),
        Math.round(avg[1] / count),
        Math.round(avg[2] / count)
      );

    return defaultColor;
  } catch {
    return defaultColor;
  }
};

const defaultProducts: Product[] = [
  {
    id: 1,
    name: "Primo Sublime Lime",
    image: orange,
    description: "Sip into freshness with vibrant lime flavor.",
    price: 25.5,
  },
  {
    id: 2,
    name: "Primo Caramel",
    image: lemon,
    description: "Smooth caramel indulgence.",
    price: 28.0,
  },
  {
    id: 3,
    name: "Primo Berry Blast",
    image: blast,
    description: "A burst of juicy berries.",
    price: 27.25,
  },
];


export default function ProductShowcase({ height = "100vh", products }: Props) {
  const items = useMemo<Product[]>(() => products ?? defaultProducts, [products]);

  const [index, setIndex] = useState(0);
  const [bg, setBg] = useState("#8edb55");
  const [dragY, setDragY] = useState(0);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(0);

  const active = items[index];

  // useEffect(() => {
  //   if (!active?.image) return;
  //   let cancelled = false;
  //   const src =
  //     typeof active.image === "string" ? active.image : active.image.src;

  //   getVibrantColor(src, bg).then((hex) => {
  //     if (!cancelled) setBg(hex);
  //   });

  //   return () => {
  //     cancelled = true;
  //   };
  // }, [active?.image]);
  useEffect(() => {
  if (!active?.image) return;
  let cancelled = false;
  const src =
    typeof active.image === "string" ? active.image : active.image.src;

  getVibrantColor(src, bg).then((hex) => {
    if (!cancelled) setBg(hex);
  });

  return () => {
    cancelled = true;
  };
}, [active?.image, bg]);


  const onWheel = useCallback(
    (e: WheelEvent) => {
      const now = Date.now();
      if (now - lockRef.current < 550) {
        setDragY((prev) => clamp(prev + e.deltaY * 0.08, -40, 40));
        return;
      }
      lockRef.current = now;

      const dir = e.deltaY > 0 ? 1 : -1;
      setDragY(dir * 60);
      setTimeout(() => setDragY(0), 250);

      setIndex((prev) => (prev + dir + items.length) % items.length);
    },
    [items.length]
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);


  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let startY = 0,
      moved = 0,
      dragging = false;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      startY = e.clientY;
      moved = 0;
      (e.target as Element).setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      moved = e.clientY - startY;
      setDragY(clamp(moved, -90, 90));
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      if (moved > 60) setIndex((i) => (i - 1 + items.length) % items.length);
      else if (moved < -60) setIndex((i) => (i + 1) % items.length);
      setDragY(0);
    };

    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [items.length]);


  const textColor = useMemo(() => {
    const [r, g, b] = [bg.slice(1, 3), bg.slice(3, 5), bg.slice(5, 7)].map((v) =>
      parseInt(v, 16)
    );
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "#1a1a1a" : "#ffffff";
  }, [bg]);


  return (
    <div
      ref={wrapRef}
      style={{
        height,
        width: "100%",
        overflow: "hidden",
        position: "relative",
        transition: "background 600ms ease",
        background: `radial-gradient(1100px 1100px at 50% 40%, rgba(255,255,255,0.9) 0%, ${bg} 20%)`,
      }}
    >


       

        
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        {items?.map((p, i) => {
          const isActive = i === index;
          const src = typeof p.image === "string" ? p.image : p.image.src;
          return (
            <div
              key={p.id}
              style={{
                position: "absolute",
                textAlign: "center",
                transform: `translateY(${isActive ? dragY : 0}px) scale(${isActive ? 1 : 0.86})`,
                opacity: isActive ? 1 : 0,
                transition: "opacity 420ms ease, transform 420ms cubic-bezier(.2,.7,.2,1)",
              }}
            >
              {/* glow */}
              <div
                style={{
                  position: "absolute",
                  width: 420,
                  height: 420,
                  borderRadius: "50%",
                  filter: "blur(60px)",
                  opacity: 0.3,
                  background: `radial-gradient(closest-side, #fff 0%, ${bg} 80%)`,
                  transform: "translateY(20px)",
                  zIndex: -1,
                }}
              />
              {/* image */}
              <NextImage
                src={src}
                alt={p.name}
                width={420}
                height={420}
                style={{ maxWidth: "80vw", height: "auto" }}
                draggable={false}
                priority={isActive}
              />
              {/* meta */}
              <div style={{ marginTop: 24, color: textColor }}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{p.name}</div>
                {p.description && (
                  <p style={{ maxWidth: 480, margin: "10px auto 0", opacity: 0.9, lineHeight: 1.5 }}>
                    {p.description}
                  </p>
                )}
                {typeof p.price === "number" && (
                  <div style={{ marginTop: 14, fontSize: 22, fontWeight: 700 }}>
                    ${p.price.toFixed(2)}
                  </div>
                )}
                <button
                  style={{
                    marginTop: 18,
                    padding: "10px 22px",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    background: "#fff",
                    color: "#1f2937",
                    fontWeight: 700,
                    boxShadow: "0 6px 18px rgba(0,0,0,.12), 0 0 0 1px rgba(255,255,255,.4) inset",
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* dots */}
      <div
        style={{
          position: "absolute",
          right: 18,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              background: i === index ? "#fff" : "rgba(255,255,255,.45)",
              outline: "2px solid rgba(255,255,255,.25)",
              transform: i === index ? "scale(1.2)" : "scale(1)",
              transition: "all 200ms ease",
            }}
            aria-label={`Go to product ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
