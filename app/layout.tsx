import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { getCurrentUserProfile } from "@/app/actions/auth/get-user-info";
import { SWRConfig } from "swr";
import { Toaster } from "sonner";
import { FontLoader } from "@/components/font-loader";

export const metadata: Metadata = {
  title: "WaveSpeed",
  description: "AI-Friendly Tool Project Template",
};

export const viewport: Viewport = {
  maximumScale: 1,
};

const manrope = Manrope({ subsets: ["latin"] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const user = await getCurrentUserProfile();
  return (
    <html lang="en" className={`bg-white dark:bg-gray-950 text-black dark:text-white ${manrope.className} overflow-y-scroll`}>
      <body>
        <FontLoader className={manrope.className} />
        <Toaster richColors position="top-center" />
        <SWRConfig
          value={{
            fallback: {
              "current-user": user,
            },
          }}>
          {children}
        </SWRConfig>
      </body>
    </html>
  );
}
