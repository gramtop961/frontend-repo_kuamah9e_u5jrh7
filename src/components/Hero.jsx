import { useEffect } from "react";

export default function Hero() {
  useEffect(() => {
    // Dynamically load Spline viewer web component
    const id = "spline-viewer-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.type = "module";
      s.src = "https://unpkg.com/@splinetool/viewer@1.9.81/build/spline-viewer.js";
      document.head.appendChild(s);
    }
  }, []);

  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        {/* Full-bleed Spline background */}
        <spline-viewer
          url="https://prod.spline.design/atN3lqky4IzF-KEP/scene.splinecode"
          class="h-full w-full block"
        ></spline-viewer>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.4)]">
          Create Characters. Chat. Generate Images.
        </h1>
        <p className="mt-4 md:mt-6 text-base md:text-lg text-blue-100/90 max-w-2xl mx-auto">
          Design unique personalities, talk to them in real-time, and turn moments into visuals.
          Trust-based gates keep sensitive content protected.
        </p>
      </div>
    </section>
  );
}
