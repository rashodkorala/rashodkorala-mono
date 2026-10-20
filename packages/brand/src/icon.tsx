import { ImageResponse } from "next/og";
import { MARK_ASPECT, markDataUri } from "./index";

/**
 * A square app icon: the white R K. mark centred on near-black, used for favicons,
 * Apple touch icons and web-app manifest icons in every app.
 */
export function brandIcon(size: number): ImageResponse {
  const markWidth = Math.round(size * 0.76);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#141414",
          borderRadius: Math.round(size * 0.18),
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markDataUri("#ffffff")} width={markWidth} height={Math.round(markWidth / MARK_ASPECT)} alt="" />
      </div>
    ),
    { width: size, height: size }
  );
}
