// src/components/DashboardChart.jsx
import { useEffect, useState } from "react";

export default function DashboardChart({ data }) {
  const [animatedValues, setAnimatedValues] = useState(data.map(() => 0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues(data.map(item => item.value));
    }, 100); // pequeño delay para iniciar animación
    return () => clearTimeout(timer);
  }, [data]);

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <span className="w-24 text-sm font-medium">{item.label}</span>
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-lg h-6 overflow-hidden">
            <div
              style={{ width: `${animatedValues[index]}%`, transition: "width 1s ease-out" }}
              className="h-6 bg-primary"
              aria-label={`Barra de ${item.label} con valor ${item.value}%`}
            />
          </div>
          <span className="text-sm font-semibold">{item.value}%</span>
        </div>
      ))}
    </div>
  );
}