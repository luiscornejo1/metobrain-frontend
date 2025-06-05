import { useEffect, useState } from "react";
import api from "../services/api";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function LeadTimeChart({ proyectoId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get(`/api/backlog/proyecto/${proyectoId}/fechas`).then((res) => {
      console.log("Datos recibidos:", res.data); // ✅ Verifica datos
      setData(res.data);
    });
  }, [proyectoId]);

  const chartData = {
    labels: data.map((_, idx) => `HU ${idx + 1}`),
    datasets: [
      {
        label: "Lead Time (h)",
        data: data.map((item) => {
          if (item.createdAt && item.completedAt) {
            const start = new Date(item.createdAt);
            const end = new Date(item.completedAt);
            return (end - start) / (1000 * 60 * 60); // en horas
          }
          return 0;
        }),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2 text-blue-700">
        Lead Time y Cycle Time
      </h3>
      <Line data={chartData} />

      {/* ✅ Tabla de detalles */}
      <div className="mt-4 bg-white shadow rounded-lg overflow-hidden">
        <h3 className="text-sm font-semibold bg-blue-600 text-white p-2">
          Detalles de Historias
        </h3>
        <table className="min-w-full text-xs text-left text-gray-500">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2">HU</th>
              <th className="px-4 py-2">Inicio</th>
              <th className="px-4 py-2">Fin</th>
              <th className="px-4 py-2">Duración</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2 font-medium text-gray-800">
                  HU {idx + 1}
                </td>
                <td className="px-4 py-2">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {new Date(item.completedAt).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {(() => {
                    const start = new Date(item.createdAt);
                    const end = new Date(item.completedAt);
                    const diffMs = end - start;
                    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                    const diffMins = Math.floor(
                      (diffMs % (1000 * 60 * 60)) / (1000 * 60)
                    );
                    const diffDays = Math.floor(diffHrs / 24);
                    const hoursLeft = diffHrs % 24;
                    return `${diffDays}d ${hoursLeft}h ${diffMins}m`;
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
