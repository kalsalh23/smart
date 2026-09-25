import type { Metadata, Viewport } from "next";
import { Cairo, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/StoreContext";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import { STORE } from "@/lib/types";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "VIOLET | فيوليت للعطور الأصلية - دمشق",
    template: "%s | VIOLET فيوليت للعطور",
  },
  description:
    "المكان الأول لبيع البرفيوم الأورجيال من أشهر الماركات العالمية. توصيل في دمشق وريفها. كل العطورات المكية الأورجيال بانتظارك.",
  openGraph: {
    title: "VIOLET | فيوليت للعطور الأصلية",
    description: "كل العطورات المكية الأورجيال من الماركات العالمية — توصيل لكل دمشق وريفها.",
    images: ["/brand/logo.jpg"],
    locale: "ar_SY",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#7B3FBE",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${display.variable} font-sans`}>
        <StoreProvider>
          <Header />
          <main className="min-h-[70vh] pb-24 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
          <a
            href={`https://wa.me/${STORE.phoneIntl}`}
            target="_blank"
            rel="noreferrer"
            aria-label="واتساب"
            className="fixed bottom-20 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition hover:scale-105 md:bottom-6 md:left-6"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5l-.4.6c-.2.2-.3.4-.2.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3 0 .1 0 .8-.3 1.4z" />
            </svg>
          </a>
        </StoreProvider>
      </body>
    </html>
  );
}
