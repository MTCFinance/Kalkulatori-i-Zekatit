import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
            border: "22px solid rgba(255, 255, 255, 0.22)",
            borderRadius: 112,
            display: "flex",
            height: 332,
            justifyContent: "center",
            position: "relative",
            width: 332,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 999,
              height: 204,
              position: "absolute",
              width: 204,
            }}
          />
          <div
            style={{
              background: "#166534",
              borderRadius: 999,
              height: 204,
              left: 176,
              position: "absolute",
              width: 204,
            }}
          />
          <div
            style={{
              color: "#ffffff",
              fontSize: 76,
              fontWeight: 800,
              left: 218,
              lineHeight: 1,
              position: "absolute",
              top: 122,
            }}
          >
            *
          </div>
          <div
            style={{
              background: "#ffffff",
              borderRadius: 999,
              bottom: 88,
              height: 24,
              position: "absolute",
              width: 148,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
