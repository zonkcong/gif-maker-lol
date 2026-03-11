import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

const EXAMPLE_PROMPTS = [
  "a cat aggressively typing on a keyboard",
  "pizza falling in slow motion",
  "a corgi running on the moon",
  "fire breathing dragon sneezing glitter",
  "astronaut vibing to music in space",
  "rubber duck racing through a bathtub storm",
  "tiny wizard casting a spell on a coffee cup",
  "dog wearing sunglasses at a beach party",
];

export default function Create() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | generating | done | error
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const intervalRef = useRef(null);
  const attemptRef = useRef(0);

  const randomPrompt = () => {
    const p = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    setPrompt(p);
  };

  const generate = async () => {
    if (!prompt.trim()) return;
    setPhase("generating");
    setProgress(10);
    setStatusMsg("Sending to Kling AI...");
    setErrorMsg("");
    setVideoUrl(null);
    attemptRef.current = 0;

    try {
      // Hit our own API route — keys stay server-side
      const createRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const createData = await createRes.json();

      if (!createRes.ok || !createData?.data?.task_id) {
        throw new Error(createData?.error || createData?.message || "Failed to start generation");
      }

      const taskId = createData.data.task_id;
      setProgress(25);
      setStatusMsg("Rendering your GIF...");

      // Poll every 5 seconds
      intervalRef.current = setInterval(async () => {
        attemptRef.current += 1;

        try {
          const pollRes = await fetch(`/api/generate?taskId=${taskId}`);
          const pollData = await pollRes.json();
          const status = pollData?.data?.task_status;

          if (status === "succeed") {
            clearInterval(intervalRef.current);
            const videos = pollData?.data?.task_result?.videos;
            if (videos?.length > 0) {
              setVideoUrl(videos[0].url);
              setPhase("done");
              setProgress(100);
            } else {
              throw new Error("Generation succeeded but no video returned");
            }
          } else if (status === "failed") {
            clearInterval(intervalRef.current);
            throw new Error(pollData?.data?.task_status_msg || "Generation failed on Kling's end");
          } else {
            // Still processing
            const p = Math.min(25 + attemptRef.current * 4, 92);
            setProgress(p);
            setStatusMsg(`Still rendering... (${attemptRef.current * 5}s)`);
          }

          if (attemptRef.current > 72) {
            clearInterval(intervalRef.current);
            throw new Error("Timed out after 6 minutes. Try a simpler prompt.");
          }
        } catch (pollErr) {
          clearInterval(intervalRef.current);
          setPhase("error");
          setErrorMsg(pollErr.message);
        }
      }, 5000);

    } catch (err) {
      clearInterval(intervalRef.current);
      setPhase("error");
      setErrorMsg(err.message);
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setPhase("idle");
    setProgress(0);
    setStatusMsg("");
    setVideoUrl(null);
    setErrorMsg("");
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <>
      <Head>
        <title>Create a GIF – gifmaker.lol</title>
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        color: "#fff",
        fontFamily: "'Space Mono', monospace",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Nav */}
        <nav style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <button onClick={() => router.push("/")} style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            fontSize: 20,
            color: "#00ff96",
            letterSpacing: -1,
            background: "none",
            border: "none",
            cursor: "pointer",
          }}>
            gifmaker.lol
          </button>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: 3 }}>
            AI GIF GENERATOR
          </div>
        </nav>

        {/* Grid bg */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 0,
          backgroundImage: "linear-gradient(rgba(0,255,150,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,150,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }} />

        {/* Main */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
          position: "relative",
          zIndex: 1,
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(32px, 5vw, 64px)",
              fontWeight: 900,
              margin: "0 0 12px",
              letterSpacing: -2,
              lineHeight: 1,
            }}>
              Type anything.<br />
              <span style={{ color: "#00ff96" }}>Get a GIF.</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, letterSpacing: 1 }}>
              Powered by Kling AI — real video generation, not templates
            </p>
          </div>

          {/* Card */}
          <div style={{ width: "100%", maxWidth: 620 }}>

            {/* IDLE */}
            {phase === "idle" && (
              <div>
                <div style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 16,
                  padding: 8,
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-end",
                  transition: "border-color 0.2s",
                }}>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="a tiny dragon cooking ramen..."
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); generate(); } }}
                    rows={2}
                    style={{
                      flex: 1,
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "#fff",
                      fontSize: 16,
                      fontFamily: "'Space Mono', monospace",
                      resize: "none",
                      padding: "14px 10px",
                      lineHeight: 1.6,
                    }}
                  />
                  <button
                    onClick={generate}
                    disabled={!prompt.trim()}
                    style={{
                      background: prompt.trim() ? "#00ff96" : "rgba(0,255,150,0.15)",
                      color: prompt.trim() ? "#0a0a0f" : "rgba(0,255,150,0.3)",
                      border: "none",
                      borderRadius: 10,
                      padding: "13px 22px",
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: prompt.trim() ? "pointer" : "default",
                      letterSpacing: 1,
                      whiteSpace: "nowrap",
                      transition: "all 0.2s",
                    }}
                  >
                    MAKE IT →
                  </button>
                </div>

                {/* Suggestions */}
                <div style={{ marginTop: 24 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 4, textTransform: "uppercase", marginBottom: 14 }}>
                    Need inspiration?
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {EXAMPLE_PROMPTS.slice(0, 6).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPrompt(p)}
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 100,
                          padding: "7px 16px",
                          color: "rgba(255,255,255,0.45)",
                          fontSize: 11,
                          cursor: "pointer",
                          fontFamily: "'Space Mono', monospace",
                          transition: "all 0.15s",
                          letterSpacing: 0,
                        }}
                        onMouseEnter={(e) => { e.target.style.borderColor = "rgba(0,255,150,0.4)"; e.target.style.color = "#00ff96"; }}
                        onMouseLeave={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.color = "rgba(255,255,255,0.45)"; }}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={randomPrompt}
                      style={{
                        background: "rgba(255,80,200,0.07)",
                        border: "1px solid rgba(255,80,200,0.2)",
                        borderRadius: 100,
                        padding: "7px 16px",
                        color: "rgba(255,80,200,0.6)",
                        fontSize: 11,
                        cursor: "pointer",
                        fontFamily: "'Space Mono', monospace",
                      }}
                    >
                      🎲 random
                    </button>
                  </div>
                </div>

                {/* Cost note */}
                <div style={{ marginTop: 28, fontSize: 10, color: "rgba(255,255,255,0.15)", letterSpacing: 1, textAlign: "center" }}>
                  Each generation uses ~1 Kling credit (≈$0.10) · Results in 30–90 seconds
                </div>
              </div>
            )}

            {/* GENERATING */}
            {phase === "generating" && (
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(0,255,150,0.15)",
                borderRadius: 16,
                padding: 48,
                textAlign: "center",
              }}>
                {/* Waveform animation */}
                <div style={{ display: "flex", gap: 5, justifyContent: "center", alignItems: "flex-end", height: 50, marginBottom: 32 }}>
                  {[...Array(14)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 4,
                        borderRadius: 2,
                        background: i % 3 === 0 ? "#ff50c8" : "#00ff96",
                        animation: `wave ${0.8 + i * 0.07}s ease-in-out ${i * 0.08}s infinite alternate`,
                      }}
                    />
                  ))}
                </div>
                <style>{`
                  @keyframes wave {
                    from { height: 6px; opacity: 0.4; }
                    to { height: ${Math.floor(Math.random() * 20) + 24}px; opacity: 1; }
                  }
                `}</style>

                <div style={{ color: "#00ff96", fontSize: 13, letterSpacing: 2, marginBottom: 10 }}>
                  {statusMsg}
                </div>
                <div style={{
                  color: "rgba(255,255,255,0.25)",
                  fontSize: 13,
                  fontStyle: "italic",
                  marginBottom: 32,
                  maxWidth: 400,
                  margin: "0 auto 32px",
                }}>
                  "{prompt}"
                </div>

                {/* Progress */}
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 100, height: 3, overflow: "hidden", maxWidth: 320, margin: "0 auto 10px" }}>
                  <div style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #00ff96, #00d4ff)",
                    borderRadius: 100,
                    transition: "width 0.6s ease",
                  }} />
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 2 }}>
                  USUALLY 30–90 SECONDS
                </div>
              </div>
            )}

            {/* DONE */}
            {phase === "done" && videoUrl && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#00ff96", letterSpacing: 5, marginBottom: 16 }}>
                  ✓ YOUR GIF IS READY
                </div>
                <div style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  border: "1px solid rgba(0,255,150,0.2)",
                  marginBottom: 16,
                  boxShadow: "0 0 60px rgba(0,255,150,0.08)",
                }}>
                  <video
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", display: "block" }}
                  />
                </div>
                <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, marginBottom: 24, fontStyle: "italic" }}>
                  "{prompt}"
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <a
                    href={videoUrl}
                    download="gifmaker-lol.mp4"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "#00ff96",
                      color: "#0a0a0f",
                      borderRadius: 10,
                      padding: "13px 32px",
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: 13,
                      textDecoration: "none",
                      letterSpacing: 1,
                      display: "inline-block",
                    }}
                  >
                    ↓ DOWNLOAD
                  </a>
                  <button
                    onClick={() => { reset(); }}
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 10,
                      padding: "13px 32px",
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "pointer",
                      letterSpacing: 1,
                    }}
                  >
                    MAKE ANOTHER
                  </button>
                </div>
              </div>
            )}

            {/* ERROR */}
            {phase === "error" && (
              <div style={{
                background: "rgba(255,50,50,0.04)",
                border: "1px solid rgba(255,80,80,0.2)",
                borderRadius: 16,
                padding: 40,
                textAlign: "center",
              }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>⚠️</div>
                <div style={{ color: "#ff7070", fontSize: 14, marginBottom: 10 }}>Something went wrong</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginBottom: 28, maxWidth: 380, margin: "0 auto 28px" }}>
                  {errorMsg}
                </div>
                <button
                  onClick={reset}
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    padding: "12px 28px",
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    cursor: "pointer",
                    letterSpacing: 1,
                  }}
                >
                  TRY AGAIN
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
