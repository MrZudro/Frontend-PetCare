import Sidebar from "./SideBar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function LayoutAdmin() {
  return (
    <div className="flex h-screen bg-[var(--color-fondo)] dark:bg-[var(--color-background)] text-[var(--color-texto)] dark:text-[var(--color-text-primary)] font-poppins overflow-hidden">
      {/* Sidebar fijo */}
      <aside className="w-64 h-screen bg-[var(--color-acento-terciario)] text-[var(--color-texto-secundario)] flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Contenido con scroll independiente */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}