import { useEffect, useState } from "react";
import api from "../services/api";

export default function SeleccionarProyecto({ onSeleccionado }) {
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/proyectos")
      .then((res) => setProyectos(res.data))
      .catch((err) => {
        console.error("Error cargando proyectos:", err);
        setError("No se pudieron cargar los proyectos.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded max-w-md mx-auto mt-10">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Seleccionar Proyecto Existente</h2>

      {loading ? (
        <p className="text-gray-500">Cargando proyectos...</p>
      ) : error ? (
        <p className="text-red-500 text-sm">{error}</p>
      ) : (
        <ul className="space-y-2">
          {proyectos.map((proyecto) => (
            <li
              key={proyecto.id}
              className="border p-2 rounded hover:bg-blue-50 cursor-pointer"
              onClick={() => onSeleccionado(proyecto)}
            >
              <strong className="text-blue-700">{proyecto.nombre}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
