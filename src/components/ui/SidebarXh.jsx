import { Link } from "react-router-dom";

export default function SidebarXh({ user }) {
  return (
    <aside className="h-screen w-64 bg-[var(--color-fondo)] sombra-inferior border-r flex flex-col p-6">
      
      <div className="flex flex-col items-center gap-3 pb-6 border-b">
        <img 
          src={user?.imageUrl} 
          alt="profile" 
          className="w-20 h-20 rounded-full object-cover"
        />
        <h2 className="font-semibold text-lg text-[var(--color-texto)]">
          {user?.names} {user?.lastNames}
        </h2>
      </div>

      <nav className="flex flex-col mt-6 text-[var(--color-texto)] gap-4 font-medium">
        <Link className="styleLinks" to="/cuenta">Configuración</Link>
        <Link className="styleLinks" to="/mascotas">Mis mascotas</Link>
        <Link className="styleLinks" to="/pedidos">Historial de pedidos</Link>

        <button className="styleButton mt-6">
          Cerrar sesión
        </button>
      </nav>
    </aside>
  );
}