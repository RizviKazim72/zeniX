import type { Metadata } from "next";
import { Inter, Roboto, Poppins } from "next/font/google";
import { Plus_Jakarta_Sans } from "next/font/google";
import "../styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import PageLoaderWrapper from "@/components/ui/PageLoaderWrapper";

// Modern font stack optimized for streaming interfaces
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: 'swap',
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: 'swap',
});

// Netflix-inspired modern font
const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "zeniX. - Modern Movie Hub",
  description: "Discover, track, and manage your favorite movies and TV shows with zeniX. - a sleek, Netflix-inspired platform with personalized watchlists, favorites, and recommendations.",
  keywords: ["movies", "tv shows", "watchlist", "entertainment", "streaming", "favorites", "recommendations"],
  authors: [{ name: "Kazim Rizvi" }],
  creator: "Kazim Rizvi",
  publisher: "zeniX.",
  robots: "index, follow",
  openGraph: {
    title: "zeniX. - Modern Movie Hub",
    description: "Discover, track, and manage your favorite movies and TV shows with a sleek, Netflix-inspired interface.",
    type: "website",
    locale: "en_US",
    siteName: "zeniX.",
  },
  twitter: {
    card: "summary_large_image",
    title: "zeniX. - Modern Movie Hub",
    description: "Discover, track, and manage your favorite movies and TV shows",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${roboto.variable} ${poppins.variable} ${jakartaSans.variable} antialiased font-jakarta bg-bg-primary text-text-primary`}>
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              <PageLoaderWrapper />
              {children}
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
