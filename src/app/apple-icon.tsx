import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#166534",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            border: "8px solid rgba(255, 255, 255, 0.24)",
            borderRadius: 38,
            display: "flex",
            height: 118,
            justifyContent: "center",
            position: "relative",
            width: 118,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 999,
              height: 72,
              position: "absolute",
              width: 72,
            }}
          />
          <div
            style={{
              background: "#166534",
              borderRadius: 999,
              height: 72,
              left: 62,
              position: "absolute",
              width: 72,
            }}
          />
          <div
            style={{
              color: "#ffffff",
              fontSize: 28,
              fontWeight: 800,
              left: 76,
              lineHeight: 1,
              position: "absolute",
              top: 38,
            }}
          >
            *
          </div>
          <div
            style={{
              background: "#ffffff",
              borderRadius: 999,
              bottom: 30,
              height: 9,
              position: "absolute",
              width: 52,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
