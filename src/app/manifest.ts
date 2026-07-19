import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/kalkulo",
    name: "Zekat — Kalkulator i Zekatit",
    short_name: "Zekat",
    description: "Kalkulator i plotë i zekatit për web dhe telefon.",
    start_url: "/kalkulo",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#f7f2e8",
    theme_color: "#075b4b",
    lang: "sq",
    categories: ["finance", "utilities", "lifestyle"],
    shortcuts: [
      {
        name: "Fillo kalkulimin",
        short_name: "Kalkulo",
        description: "Hap kalkulatorin e zekatit",
        url: "/kalkulo",
        icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
      },
    ],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
