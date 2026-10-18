import Hero from "../components/Hero";

export default function Page() {
  return (
    <main>
      <Hero />
      <section className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <h2 className="text-3xl sm:text-5xl font-light tracking-widest">Arrived.</h2>
          <p className="mt-4" style={{ color: "var(--muted)" }}>
            The animation was driven by your scroll position.
          </p>
        </div>
      </section>
    </main>
  );
}