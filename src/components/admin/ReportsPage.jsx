import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  // Datos inventario con colores en hex (igual que DashboardChart)
  const inventarioData = [
    { categoria: "Productos", cantidad: 120, color: "#3B82F6" }, // azul
    { categoria: "Vacunas", cantidad: 90, color: "#10B981" },   // verde
    // Servicios se muestran aparte
  ];

  const totalInventario = inventarioData.reduce((acc, item) => acc + item.cantidad, 0);

  // Animación progresiva
  const [animado, setAnimado] = useState(false);
  useEffect(() => {
    setTimeout(() => setAnimado(true), 300);
  }, []);

  const inventarioConPorcentaje = inventarioData.map(item => {
    const porcentaje = ((item.cantidad / totalInventario) * 100).toFixed(1);
    let estado = "Stock alto";
    let badgeColor = "bg-green-100 text-green-700";
    let icon = <FaCheckCircle className="inline mr-1" />;
    if (porcentaje < 10) {
      estado = "Crítico";
      badgeColor = "bg-red-100 text-red-700";
      icon = <FaTimesCircle className="inline mr-1" />;
    } else if (porcentaje < 25) {
      estado = "Stock bajo";
      badgeColor = "bg-yellow-100 text-yellow-700";
      icon = <FaExclamationTriangle className="inline mr-1" />;
    }
    return { ...item, porcentaje, estado, badgeColor, icon };
  });

  // Datos financieros
  const finanzasData = [
    { mes: "Enero", ingresos: 1500 },
    { mes: "Febrero", ingresos: 1700 },
    { mes: "Marzo", ingresos: 1600 },
    { mes: "Abril", ingresos: 2100 },
    { mes: "Mayo", ingresos: 3200 },
    { mes: "Junio", ingresos: 2500 },
    { mes: "Julio", ingresos: 2300 },
    { mes: "Agosto", ingresos: 2800 },
    { mes: "Septiembre", ingresos: 2400 },
    { mes: "Octubre", ingresos: 2600 },
    { mes: "Noviembre", ingresos: 3500 },
    { mes: "Diciembre", ingresos: 4000 },
  ];

  // KPIs
  const totalIngresos = finanzasData.reduce((acc, item) => acc + item.ingresos, 0);
  const mesMaxIngresos = finanzasData.reduce((max, item) =>
    item.ingresos > max.ingresos ? item : max
  );
  const mesMinIngresos = finanzasData.reduce((min, item) =>
    item.ingresos < min.ingresos ? item : min
  );
  const categoriaMenorStock = inventarioData.reduce((min, item) =>
    item.cantidad < min.cantidad ? item : min
  );
  const promedioMensual = (totalIngresos / finanzasData.length).toFixed(0);

  // Simulación de descarga en CSV
  const descargarReporte = () => {
    let contenido = "KPI,Valor\n";
    contenido += `Total ingresos del año,$${totalIngresos}\n`;
    contenido += `Mes con más ingresos,${mesMaxIngresos.mes} $${mesMaxIngresos.ingresos}\n`;
    contenido += `Mes con menos ingresos,${mesMinIngresos.mes} $${mesMinIngresos.ingresos}\n`;
    contenido += `Categoría con menos stock,${categoriaMenorStock.categoria} ${categoriaMenorStock.cantidad} unidades\n\n`;
    contenido += "Mes,Ingresos\n";
    finanzasData.forEach(item => {
      contenido += `${item.mes},${item.ingresos}\n`;
    });

    const blob = new Blob([contenido], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ReporteGeneral.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-2xl font-bold text-texto dark:text-text-primary-dark">
        Reportes Generales
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-card-dark rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Total ingresos del año</h3>
          <p className="text-2xl font-bold text-primary">${totalIngresos.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-card-dark rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Mes con más ingresos</h3>
          <p className="text-xl font-bold text-primary">{mesMaxIngresos.mes}</p>
          <p className="text-lg text-texto dark:text-text-primary-dark">${mesMaxIngresos.ingresos.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-card-dark rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Mes con menos ingresos</h3>
          <p className="text-xl font-bold text-primary">{mesMinIngresos.mes}</p>
          <p className="text-lg text-texto dark:text-text-primary-dark">${mesMinIngresos.ingresos.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-card-dark rounded-xl shadow-lg p-6 text-center">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Categoría con menos stock</h3>
          <p className="text-xl font-bold text-primary">{categoriaMenorStock.categoria}</p>
          <p className="text-lg text-texto dark:text-text-primary-dark">{categoriaMenorStock.cantidad} unidades</p>
        </div>
      </div>

      {/* Estado del Inventario */}
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold">Estado del Inventario</h2>
        {inventarioConPorcentaje.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between items-center text-sm font-medium text-texto dark:text-text-primary-dark">
              <span>{item.categoria}</span>
              <span>{item.cantidad} unidades ({item.porcentaje}%)</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${item.badgeColor}`}
              >
                {item.icon} {item.estado}
              </span>
            </div>
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg h-6 overflow-hidden">
              <div
                style={{
                  width: animado ? `${Math.max(item.porcentaje, 4)}%` : "0%",
                  transition: "width 1s ease-out",
                  backgroundColor: item.color, // 👈 igual que DashboardChart
                }}
                className="h-6"
                aria-label={`${item.categoria} ${item.porcentaje}%`}
              />
            </div>
          </div>
        ))}

        {/* Servicios → sin barra de stock */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-sm font-medium text-texto dark:text-text-primary-dark">
            <span>Servicios</span>
            <span>45 realizados este mes</span>
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              📊 Demanda
            </span>
          </div>
        </div>
      </div>

      {/* Reporte Financiero */}
      <div className="bg-white dark:bg-card-dark rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Ingresos Mensuales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={finanzasData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            {/* Línea principal de ingresos */}
            <Line
              type="monotone"
              dataKey="ingresos"
              stroke="#E10600"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
              name="Ingresos"
              animationDuration={1500}
            />
            {/* Línea de referencia: promedio mensual */}
            <ReferenceLine
              y={promedioMensual}
              stroke="#3B82F6"
              strokeDasharray="4 4"
              label={{
                value: `Promedio: $${promedioMensual}`,
                position: "right",
                fill: "#3B82F6"
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Botón de descarga al final */}
      <div className="flex justify-center mt-6">
        <button
          onClick={descargarReporte}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          ⬇️ Descargar Reporte
        </button>
      </div>
    </div>
  );
}
