import { ImageResponse } from "next/og";

/** Shared K-mark icon renderer used by the PWA manifest icon routes. */
export function generateAppIcon(pixelSize: number) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#7c5cff",
      }}
    >
      <div
        style={{
          color: "#ffffff",
          fontSize: Math.round(pixelSize * 0.55),
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        K
      </div>
    </div>,
    { width: pixelSize, height: pixelSize },
  );
}
