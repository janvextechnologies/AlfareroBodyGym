import type { Metadata, Viewport } from "next";
import { Inter, Oswald, Bebas_Neue } from "next/font/google";
import { gym } from "@/data/gym";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(gym.siteUrl),
  title: {
    default: `${gym.name} | Gimnasio de fuerza y musculación`,
    template: `%s | ${gym.name}`,
  },
  description: gym.description,
  applicationName: gym.name,
  keywords: [
    "Alfarero Body Gym",
    "gimnasio",
    "musculación",
    "entrenamiento funcional",
    "fuerza",
    "powerlifting",
    "Nicaragua",
    "gimnasio en Nicaragua",
  ],
  authors: [{ name: gym.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_NI",
    url: gym.siteUrl,
    siteName: gym.name,
    title: `${gym.name} | Transforma tu cuerpo. Fortalece tu mente.`,
    description: gym.description,
    images: [
      {
        url: gym.hero.image,
        width: 1200,
        height: 630,
        alt: gym.hero.imageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${gym.name} | Transforma tu cuerpo. Fortalece tu mente.`,
    description: gym.description,
    images: [gym.hero.image],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`dark ${inter.variable} ${oswald.variable} ${bebasNeue.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <a
          href="#inicio"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}
