import { AppShell } from "@/components/layout/app-shell";

// Estas paginas leen datos en vivo de la base de datos (miembros, caja, inventario),
// no deben pre-renderizarse como estaticas en build time.
export const dynamic = "force-dynamic";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
