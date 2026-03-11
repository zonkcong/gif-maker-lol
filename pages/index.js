import { useRouter } from "next/router";
import Head from "next/head";

const TRENDING = [
  { label: "Dancing Cat", views: "2.5M", likes: "125K", emoji: "🐱" },
  { label: "Mind Blown", views: "1.8M", likes: "98K", emoji: "🤯" },
  { label: "Facepalm", views: "3.2M", likes: "187K", emoji: "🤦" },
  { label: "Surprise Pikachu", views: "4.1M", likes: "245K", emoji: "😱" },
  { label: "Thumbs Up", views: "1.5M", likes: "72K", emoji: "👍" },
  { label: "Mic Drop", views: "2.9M", likes: "156K", emoji: "🎤" },
];

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>GIF Maker LOL – Create AI GIFs From Any Prompt</title>
        <meta name="description" content="Type anything, get a GIF. AI-powered GIF generation using Kling." />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#fff",
        fontFamily: "'Space Mono', monospace",
        overflowX: "hidden",
      }}>
        {/* Nav */}
        <nav style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20, color: "#00ff96", letterSpacing: -1 }}>
            gifmaker.lol
          </div>
          <div style={{ display: "flex", gap: 32, fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>
            <a href="#trending" style={{ color: "inherit", textDecoration: "none" }}>TRENDING</a>
            <a href="#features" style={{ color: "inherit", textDecoration: "none" }}>FEATURES</a>
            <a href="#about" style={{ color: "inherit", textDecoration: "none" }}>ABOUT</a>
          </div>
          <button
            onClick={() => router.push("/create")}
            style={{
              background: "#00ff96",
              color: "#0a0a0f",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
              letterSpacing: 1,
            }}
          >
            START CREATING →
          </button>
        </nav>

        {/* Hero */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 40px",
          textAlign: "center",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,255,150,0.07) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ fontSize: 12, letterSpacing: 5, color: "#00ff96", marginBottom: 24, opacity: 0.7 }}>
            AI-POWERED GIF CREATION
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(48px, 8vw, 96px)",
            fontWeight: 900,
            margin: "0 0 24px",
            letterSpacing: -3,
            lineHeight: 1,
          }}>
            Create Epic GIFs<br />
            <span style={{ color: "#00ff96" }}>That Make Everyone LOL</span>
          </h1>
          <p style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 16,
            maxWidth: 480,
            lineHeight: 1.7,
            marginBottom: 48,
          }}>
            Type anything you can imagine. Our AI generates a real video GIF — not a template, not a search result. Pure creation.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <button
              onClick={() => router.push("/create")}
              style={{
                background: "#00ff96",
                color: "#0a0a0f",
                border: "none",
                borderRadius: 10,
                padding: "16px 36px",
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
              START CREATING →
            </button>
            <button
              onClick={() => document.getElementById("trending").scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                padding: "16px 36px",
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
              BROWSE GIFS
            </button>
          </div>
        </div>

        {/* Trending */}
        <div id="trending" style={{ padding: "80px 40px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
              <span style={{ fontSize: 20 }}>🔥</span>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 900, margin: 0 }}>Trending Now</h2>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginLeft: 8 }}>COMMUNITY FAVORITES</span>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 16,
            }}>
              {TRENDING.map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 12,
                    padding: 20,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,255,150,0.3)"; e.currentTarget.style.background = "rgba(0,255,150,0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                >
                  <div style={{ fontSize: 36, marginBottom: 12 }}>{item.emoji}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>👁 {item.views}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>❤️ {item.likes}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" style={{ padding: "80px 40px", background: "rgba(255,255,255,0.01)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 900, marginBottom: 40, textAlign: "center" }}>
              Why You'll Love It
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
              {[
                { icon: "✨", title: "AI-Generated", desc: "Not a search engine. Type anything and our AI renders a real custom video — things that have never existed before." },
                { icon: "⚡", title: "Fast AF", desc: "Results in under 90 seconds. No account needed, no queues, no waiting around for your GIF to appear." },
                { icon: "🎨", title: "Totally Unique", desc: "Every GIF is one-of-a-kind. Your \"dog eating spaghetti on the moon\" will never look the same twice." },
              ].map((f) => (
                <div key={f.title} style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 16,
                  padding: 32,
                }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 900, marginBottom: 12 }}>{f.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontSize: 14, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "120px 40px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 900, marginBottom: 24, letterSpacing: -2 }}>
            Ready to make something <span style={{ color: "#00ff96" }}>weird?</span>
          </h2>
          <button
            onClick={() => router.push("/create")}
            style={{
              background: "#00ff96",
              color: "#0a0a0f",
              border: "none",
              borderRadius: 10,
              padding: "18px 48px",
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              letterSpacing: 1,
            }}
          >
            MAKE A GIF →
          </button>
        </div>

        {/* Footer */}
        <footer style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "32px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 12,
          color: "rgba(255,255,255,0.2)",
        }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, color: "#00ff96", opacity: 0.5 }}>gifmaker.lol</div>
          <div>© 2025 GIF Maker LOL. Made with ❤️ and lots of LOLs</div>
          <div style={{ display: "flex", gap: 24 }}>
            {["About", "Terms", "Privacy", "Contact"].map((l) => (
              <a key={l} href="#" style={{ color: "inherit", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
