import MetricCard from "../components/admin/MetricCard";
import QuickAction from "../components/admin/QuickAction";
import ActivityItem from "../components/admin/ActivityItem";
import DashboardChart from "../components/admin/DashboardChart"; // Importamos el nuevo componente
import { FaPlusCircle, FaBoxOpen, FaRedo } from "react-icons/fa";

// Importamos los JSON
import products from "../components/Data/products.json";
import services from "../components/Data/services.json";

export default function AdminLw() {
  // --- Métricas ---
  const totalServices = services.length;
  const activeServices = services.filter(s => s.estado === "activo").length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock <= p.bajoStock).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;

  // --- Datos para el Gráfico ---
  const inventoryStatusData = [
    { label: "En Stock", value: totalProducts - lowStockProducts - outOfStockProducts, color: "#10B981" },
    { label: "Bajo Stock", value: lowStockProducts, color: "#F59E0B" },
    { label: "Agotados", value: outOfStockProducts, color: "#EF4444" },
  ];

  // --- Actividad y Acciones (sin cambios) ---
  const actividadReciente = [
    {
      titulo: "Consulta general editado",
      descripcion: "Precio actualizado de $22.000 a $25.000",
      tiempo: "hace 2 h",
      tipo: "Servicio"
    },
    {
      titulo: "Baño y peluquería desactivado",
      descripcion: "Ahora no disponible para clientes",
      tiempo: "hace 4 h",
      tipo: "Servicio"
    },
    {
      titulo: "Alimento Premium 10kg activado",
      descripcion: "Reintegrado al catálogo",
      tiempo: "hace 6 h",
      tipo: "Producto"
    },
    {
      titulo: "Stock actualizado",
      descripcion: "3 productos con stock crítico revisados",
      tiempo: "ayer",
      tipo: "Inventario"
    }
  ];

  const acciones = [
  {
    label: "Crear nuevo servicio",
    description: "Configura nombre, precio, duración y estado.",
    icon: FaPlusCircle
  },
  {
    label: "Añadir producto al inventario",
    description: "Registra precio, stock y categoría.",
    icon: FaBoxOpen
  },
  {
    label: "Revisar servicios inactivos",
    description: "Decide qué servicios reactivar.",
    icon: FaRedo
  }
];


  return (
    <div className="space-y-8">
      {/* --- Saludo y Resumen --- */}
      <div>
        <h1 className="text-2xl font-bold text-texto dark:text-text-primary-dark">Bienvenido de vuelta, Admin! 👋</h1>
        <p className="text-texto/70 dark:text-text-secondary-dark mt-1">Aquí tienes un resumen de la actividad de tu negocio.</p>
      </div>

      {/* --- Métricas Principales --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Servicios Totales" value={totalServices} subtitle="Servicios configurados" />
        <MetricCard title="Servicios Activos" value={activeServices} subtitle="Disponibles para clientes" />
        <MetricCard title="Productos en Catálogo" value={totalProducts} subtitle="Variedad de inventario" />
        <MetricCard title="Productos Críticos" value={lowStockProducts + outOfStockProducts} subtitle="Bajo stock o agotados" />
      </div>

      {/* --- Contenido Principal (Gráfico y Actividad) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Columna Izquierda: Gráfico y Acciones Rápidas */}
        <div className="lg:col-span-1 space-y-8">
          <DashboardChart title="Estado del Inventario" data={inventoryStatusData} />
          
          <div className="bg-fondo dark:bg-card-dark shadow-xl rounded-lg p-4 flex flex-col gap-3 w-full">
            <h2 className="text-lg font-semibold mb-2 text-texto dark:text-text-primary-dark">Accesos Rápidos</h2>
            {acciones.map((a, i) => (
              <QuickAction key={i} {...a} />
            ))}
          </div>
        </div>

        {/* Columna Derecha: Actividad Reciente */}
        <div className="lg:col-span-2 bg-fondo dark:bg-card-dark shadow-xl rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold mb-4 text-texto dark:text-text-primary-dark">Actividad Reciente</h2>
          <ul className="space-y-5">
            {actividadReciente.map((item, i) => (
              <ActivityItem key={i} {...item} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
