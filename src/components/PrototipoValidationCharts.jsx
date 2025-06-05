import { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import api from "../services/api";
import 'chart.js/auto';

export default function PrototipoValidationCharts({ proyectoId }) {
  const [prototipos, setPrototipos] = useState([]);

  useEffect(() => {
    if (!proyectoId) return;

    const fetchData = async () => {
      try {
        const res = await api.get(`/api/prototipos/proyecto/${proyectoId}`);
        setPrototipos(res.data);
      } catch (err) {
        console.error("Error obteniendo datos:", err);
      }
    };

    fetchData();
  }, [proyectoId]);

  // 📊 Calcular datos
  const estados = { Pendiente: 0, Aprobado: 0, Rechazado: 0 };
  let tiempoTotalValidacion = 0;
  let validados = 0;

  prototipos.forEach((p) => {
    estados[p.estadoValidacion]++;
    if (p.estadoValidacion === "Aprobado") {
      validados++;
      if (p.createdAt && p.updatedAt) {
        const start = new Date(p.createdAt);
        const end = new Date(p.updatedAt);
        tiempoTotalValidacion += (end - start) / (1000 * 60 * 60); // horas
      }
    }
  });

  const porcentajeValidados = (validados / prototipos.length) * 100 || 0;
  const tiempoPromedio = validados > 0 ? (tiempoTotalValidacion / validados).toFixed(2) : 0;

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-3">
      {/* Gráfico 1: Total por estado */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Prototipos por estado</h3>
        <Bar
          data={{
            labels: ["Pendiente", "Aprobado", "Rechazado"],
            datasets: [
              {
                label: "Cantidad",
                data: [estados.Pendiente, estados.Aprobado, estados.Rechazado],
                backgroundColor: ["#fbbf24", "#10b981", "#ef4444"],
              },
            ],
          }}
        />
      </div>

      {/* Gráfico 2: % Validados */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">% de Prototipos Validados</h3>
        <Doughnut
          data={{
            labels: ["Validados", "No validados"],
            datasets: [
              {
                data: [porcentajeValidados, 100 - porcentajeValidados],
                backgroundColor: ["#10b981", "#d1d5db"],
              },
            ],
          }}
        />
      </div>

      {/* Gráfico 3: Tiempo promedio de validación */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Tiempo promedio (horas)</h3>
        <Line
          data={{
            labels: ["Tiempo promedio"],
            datasets: [
              {
                label: "Horas",
                data: [tiempoPromedio],
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.5)",
                tension: 0.4,
              },
            ],
          }}
        />
        <p className="text-xs text-gray-500 mt-1">
          Basado en prototipos aprobados.
        </p>
      </div>
    </div>
  );
}
