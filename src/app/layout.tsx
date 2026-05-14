import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProviderWrapper } from "@/components/auth-provider";
import { ToastProvider } from "@/components/toast";
import { PageTransition } from "@/components/page-transition";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevSync AI - Build, Audit, Collaborate",
  description: "AI-powered collaborative platform for student developers to showcase projects, receive code audits, and form teams.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#050505] text-[#fafafa]">
        <div className="fixed inset-0 bg-grid pointer-events-none z-0" />
        <div className="fixed inset-0 bg-glow pointer-events-none z-0" />
        <div className="relative z-10">
          <AuthProviderWrapper>
            <ToastProvider>
              <PageTransition>{children}</PageTransition>
            </ToastProvider>
          </AuthProviderWrapper>
        </div>
      </body>
    </html>
  );
}
