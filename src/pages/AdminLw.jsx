import MetricCard from "../components/admin/MetricCard";
import QuickAction from "../components/admin/QuickAction";
import ActivityItem from "../components/admin/ActivityItem";
import { FaPlusCircle, FaBoxOpen, FaRedo } from "react-icons/fa";

// Importamos los JSON
import products from "../components/Data/products.json";
import services from "../components/Data/services.json";

export default function AdminLw() {
  // === Métricas dinámicas ===
  const metrics = [
    { title: "Servicios", value: services.length, subtitle: "Servicios generales" },
    { title: "Servicios activos", value: services.filter(s => s.estado === "activo").length, subtitle: "Con disponibilidad" },
    { title: "Productos", value: products.length, subtitle: "Productos en inventario" },
    { title: "Inventario bajo", value: products.filter(p => p.stock <= p.bajoStock).length, subtitle: "Productos críticos" }
  ];

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
    <>
      {/* Métricas */}
      <div className="flex gap-6 overflow-x-auto whitespace-nowrap pb-4 mt-3">
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>

      {/* Actividad reciente + Acceso rápidas */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Actividad reciente */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 space-y-4 w-full lg:max-w-[995px]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Actividad reciente</h2>
          <ul className="space-y-6">
            {actividadReciente.map((item, i) => (
              <ActivityItem key={i} {...item} />
            ))}
          </ul>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 flex flex-col gap-3 w-full lg:flex-1">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Accesos rápidos</h2>
          {acciones.map((a, i) => (
            <QuickAction key={i} {... a} />
          ))}
        </div>
      </div>
    </>
  );
}
