import Sidebar from "./Sidebar"
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function LayoutAdmin() {
  return (
    <div className="flex min-h-screen bg-color-fondo text-color-texto font-poppins">
    <aside className="w-50 fixed top-0 left-0 bottom-0 z-20 min-h-screen bg-color-acento-terciario text-color-texto-secundario ">
        <Sidebar />
    </aside>
    
    <div className="ml-50 flex flex-col w-full min-h-screen">
        <Header />
        <main className="px-6 flex-1 overflow-y-auto">
        <Outlet />
        </main>
    </div>
    </div>
  );
}