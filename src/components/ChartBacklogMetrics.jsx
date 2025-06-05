import { useEffect, useState } from "react";
import api from "../services/api";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export default function ChartBacklogMetrics({ proyectoId }) {
  const [dataChart, setDataChart] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/api/backlog/proyecto/${proyectoId}`);
      const tareas = res.data;

      const labels = tareas.map((t, index) => `HU ${index + 1}`);
      const leadTimes = tareas.map(t => {
        if (t.createdAt && t.completedAt) {
          const start = new Date(t.createdAt);
          const end = new Date(t.completedAt);
          const durationHours = (end - start) / (1000 * 60 * 60);
          return parseFloat(durationHours.toFixed(2));
        }
        return 0;
      });

      const cycleTimes = tareas.map(t => {
        if (t.startedAt && t.completedAt) {
          const start = new Date(t.startedAt);
          const end = new Date(t.completedAt);
          const durationHours = (end - start) / (1000 * 60 * 60);
          return parseFloat(durationHours.toFixed(2));
        }
        return 0;
      });

      setDataChart({
        labels,
        datasets: [
          {
            label: "Lead Time (h)",
            data: leadTimes,
            borderColor: "rgba(75,192,192,1)",
            backgroundColor: "rgba(75,192,192,0.2)",
          },
          {
            label: "Cycle Time (h)",
            data: cycleTimes,
            borderColor: "rgba(153,102,255,1)",
            backgroundColor: "rgba(153,102,255,0.2)",
          },
        ],
      });
    };

    if (proyectoId) fetchData();
  }, [proyectoId]);

  return (
    <div className="mt-6 p-4 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-2 text-blue-700">Lead Time y Cycle Time</h3>
      {dataChart.labels ? (
        <Line 
          data={dataChart}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
            },
            scales: {
              y: {
                title: { display: true, text: "Tiempo (h)" },
                ticks: {
                  callback: function(value) {
                    return `${value} h`;
                  }
                }
              }
            }
          }}
        />
      ) : (
        <p className="text-gray-500 text-sm">No hay datos para mostrar</p>
      )}
    </div>
  );
}
