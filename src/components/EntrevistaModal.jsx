import { useState, useEffect } from "react";
import api from "../services/api";
import axios from "axios";

export default function EntrevistaModal({ proyectoId, onClose }) {
  const [entrevistas, setEntrevistas] = useState([]);
  const [contenido, setContenido] = useState("");
  const [usuario, setUsuario] = useState("");
  const [loading, setLoading] = useState(false);

  const [reflexionId, setReflexionId] = useState(null);
  const [backlogSugerido, setBacklogSugerido] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
    if (proyectoId) {
      cargarEntrevistas();
      cargarReflexion();
    }
  }, [proyectoId]);

  const cargarEntrevistas = async () => {
    try {
      const res = await api.get(`/api/entrevistas/proyecto/${proyectoId}`);
      setEntrevistas(res.data);
    } catch (err) {
      console.error("Error cargando entrevistas:", err);
    }
  };

  const cargarReflexion = async () => {
    try {
      const res = await api.get(`/api/reflexiones/proyecto/${proyectoId}`);
      if (res.data.length > 0) {
        setReflexionId(res.data[0].id);
      }
    } catch (err) {
      console.error("Error cargando reflexión:", err);
    }
  };

  const guardarEntrevista = async () => {
    if (!contenido || !usuario) return;
    try {
      await api.post("/api/entrevistas", {
        resumen: contenido,
        usuario: usuario,
        proyecto: { id: proyectoId }
      });
      setContenido("");
      setUsuario("");
      cargarEntrevistas();
    } catch (err) {
      console.error("Error al guardar entrevista:", err);
    }
  };

  const analizarEntrevistas = async () => {
    const texto = entrevistas.map((e, i) => `Entrevista ${i + 1} - ${e.usuario}:\n${e.resumen}`).join("\n\n");
    const prompt = `Dado el siguiente resumen de entrevistas con usuarios:\n\n${texto}\n\nGenera una lista clara de ítems del backlog en formato: "Como usuario quiero... para..." (uno por línea).`;

    setLoading(true);
    try {
      const res = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      }, {
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json"
        }
      });

      const textoRespuesta = res.data.choices[0].message.content;
      const items = textoRespuesta.split("\n").filter(line => line.trim() !== "");
      setBacklogSugerido(items);
    } catch (err) {
      console.error("Error al analizar entrevistas:", err);
      alert("No se pudo analizar las entrevistas.");
    }
    setLoading(false);
  };

  const toggleSeleccion = (item) => {
    setSeleccionados(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const guardarItemsSeleccionados = async () => {
    if (!reflexionId) {
      alert("Error: Reflexión no encontrada.");
      return;
    }

    try {
      for (let descripcion of seleccionados) {
        await api.post("/api/backlog", {
          descripcion,
          proyecto: { id: proyectoId }
        });
      }

      // Preparar texto entrevistas para guardar
      const entrevistasTexto = entrevistas.map(e => `👤 ${e.usuario}: ${e.resumen}`).join("\n");

      // Actualizar reflexión con entrevistas
      await api.put(`/api/reflexiones/${reflexionId}`, {
        entrevistas: entrevistasTexto,
        proyecto: { id: proyectoId }
      });

      alert("✅ Ítems y entrevistas guardadas correctamente.");
      setBacklogSugerido([]);
      setSeleccionados([]);
    } catch (err) {
      console.error("Error al guardar ítems/entrevistas:", err);
      alert("❌ Error al guardar ítems o entrevistas");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-lg font-bold text-blue-700 mb-4">Entrevistas con usuarios</h2>

        <div className="space-y-2 mb-6">
          {entrevistas.map((e, i) => (
            <div key={i} className="border p-3 rounded bg-gray-100">
              <p className="text-sm text-gray-700">
                <strong>{e.usuario}:</strong> {e.resumen}
              </p>
            </div>
          ))}
        </div>

        <textarea
          className="w-full border p-2 rounded mb-2"
          rows={4}
          placeholder="Resumen de la entrevista"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre del usuario"
          className="w-full border p-2 rounded mb-4"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />

        <div className="flex justify-between items-center mb-6">
          <button
            onClick={guardarEntrevista}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar entrevista
          </button>

          {entrevistas.length > 0 && (
            <button
              onClick={analizarEntrevistas}
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              {loading ? "Analizando..." : "Analizar entrevistas"}
            </button>
          )}
        </div>

        {backlogSugerido.length > 0 && (
          <div className="bg-gray-100 p-4 rounded mb-4">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Ítems sugeridos por IA:</h3>
            <ul className="space-y-1">
              {backlogSugerido.map((item, idx) => (
                <li key={idx}>
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(item)}
                      onChange={() => toggleSeleccion(item)}
                    />
                    <span>{item}</span>
                  </label>
                </li>
              ))}
            </ul>

            <button
              onClick={guardarItemsSeleccionados}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Guardar ítems seleccionados
            </button>
          </div>
        )}

        <div className="text-right">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
