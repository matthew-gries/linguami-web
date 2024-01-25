import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./AuthProvider";
import NavMenu from "./components/NavMenu";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinguAmi",
  description: "Language learning buddy powered by ChatGPT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang="en">
        <body style={inter.style}>
          <NavMenu />
          <main className="container">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}
