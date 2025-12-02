import { Link } from "react-router-dom";

const Sidebar = () => (
  <aside className="bg-acento-terciario text-texto-secundario w-50 min-h-screen p-5">
    <h2 className="text-lg font-bold mb-3">Veterinaria Luna</h2>
    <hr className="border-t border-(--color-card) mb-6" />
    <nav className="space-y-6 text-lg">
      <Link to="/admin" className="block hover:text-teal-300">Dashboard</Link>
      <Link to="/admin/servicios" className="block hover:text-teal-300">Servicios</Link>
      <Link to="/admin/productos" className="block hover:text-teal-300">Productos</Link>
      <Link to="/admin/configuracion" className="block hover:text-teal-300">Configuración</Link>
    </nav>
  </aside>
);

export default Sidebar;