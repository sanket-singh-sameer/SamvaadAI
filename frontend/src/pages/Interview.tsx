export default function Interview() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#F5F5F5",
      }}
    >
      <h1
        style={{
          fontFamily: '"Bricolage Grotesque", sans-serif',
          fontWeight: 800,
          fontSize: "clamp(2rem, 4vw, 3rem)",
          letterSpacing: "-0.03em",
          margin: 0,
        }}
      >
        Interview Session
      </h1>
      <p
        style={{
          fontFamily: '"Quicksand", sans-serif',
          fontSize: "1rem",
          color: "rgba(245,245,245,0.45)",
          marginTop: "0.8rem",
        }}
      >
        Your mock interview is starting…
      </p>
    </div>
  );
}
