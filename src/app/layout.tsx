import type { Metadata, Viewport } from "next";
import { Cairo, Cormorant_Garamond, Amiri } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/components/StoreContext";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import Footer from "@/components/Footer";
import Icon from "@/components/Icon";
import { STORE } from "@/lib/types";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://violet-zeta.vercel.app"),
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
  themeColor: "#201833",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${display.variable} ${amiri.variable} font-sans`}>
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
            className="fixed bottom-20 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#1FA855] text-white shadow-soft transition hover:scale-105 md:bottom-6 md:left-6"
          >
            <Icon name="whatsapp" className="h-6 w-6" />
          </a>
        </StoreProvider>
      </body>
    </html>
  );
}
