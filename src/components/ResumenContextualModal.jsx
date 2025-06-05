import { useEffect, useState } from "react";
import api from "../services/api";

export default function ResumenContextualModal({ proyectoId, onClose }) {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    const cargarResumen = async () => {
      try {
        const res = await api.get(`/api/reflexiones/proyecto/${proyectoId}`);
        setDatos(res.data[0]); // asumimos una sola reflexión por proyecto
      } catch (err) {
        console.error("Error al cargar datos de resumen:", err);
      }
    };
    cargarResumen();
  }, [proyectoId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4 text-blue-600">Resumen del proyecto</h2>

        {!datos ? (
          <p>Cargando datos...</p>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-1">🎯 Ikigai</h3>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{datos.ikigai || "Aun no se ha definido un ikigai para este proyecto."}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-1">🧠 Historias desde entrevistas</h3>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{datos.entrevistas || "Aun no se ha definido entrevistas para este proyecto."}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-1">💬 Mapa de empatía</h3>
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{datos.mapaEmpatia || "Aun no se ha definido un mapa de empatia para este proyecto."}</p>
            </div>
          </>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
