import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Usamos una fuente de Google
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/toaster";

// Configuración de la fuente Inter (se descarga sola)
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FarmaSystem",
  description: "Sistema Profesional de Gestión de Farmacia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* Aplicamos la clase de la fuente al body */}
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}