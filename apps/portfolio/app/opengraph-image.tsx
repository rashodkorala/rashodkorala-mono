import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rashod Korala | Software Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const JAKARTA_SANS_WOFF2 =
  "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIbaomQNQcsA88c7O9yZ4KMCoOg4IA6-91aHEjcWuA_KU7N.woff2";

export default async function OGImage() {
  const jakartaSans = await fetch(JAKARTA_SANS_WOFF2).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          backgroundColor: "#000",
          padding: "80px",
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        }}
      >
        <p
          style={{
            fontSize: 14,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
            margin: 0,
            marginBottom: 16,
          }}
        >
          Portfolio
        </p>
        <h1
          style={{
            fontSize: 72,
            fontWeight: 300,
            color: "#fff",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Rashod Korala
        </h1>
        <p
          style={{
            fontSize: 28,
            fontWeight: 300,
            color: "rgba(255,255,255,0.5)",
            margin: 0,
            marginTop: 16,
          }}
        >
          Software Developer
        </p>
        <div
          style={{
            position: "absolute",
            top: 80,
            right: 80,
            width: 48,
            height: 4,
            backgroundColor: "#ea580c",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Plus Jakarta Sans",
          data: jakartaSans,
          style: "normal",
          weight: 300,
        },
      ],
    }
  );
}
