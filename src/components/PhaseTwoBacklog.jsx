import { useEffect, useState } from "react";
import api from "../services/api";
import ResumenContextualModal from "./ResumenContextualModal";
import { FaTrash } from "react-icons/fa";
import ChartBacklogMetrics from "./ChartBacklogMetrics";
import LeadTimeChart from "./LeadTimeChart";

export default function PhaseTwoBacklog({ proyectoId }) {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [storyPoints, setStoryPoints] = useState("");
  const [responsable, setResponsable] = useState("");
  const [epica, setEpica] = useState("");
  const [estado, setEstado] = useState("Por hacer");
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [iaSugerencias, setIaSugerencias] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
    if (proyectoId) {
      api.get(`/backlog/proyecto/${proyectoId}`).then((res) => {
        setTareas(res.data);
      });
    }
  }, [proyectoId]);

  const agregarTarea = async () => {
    if (!nuevaTarea.trim() || !prioridad) return;
    try {
      await api.post("/backlog", {
        descripcion: nuevaTarea,
        prioridad,
        storyPoints: storyPoints ? parseInt(storyPoints) : null,
        responsable: responsable || null,
        epica: epica || null,
        estado,
        proyecto: { id: proyectoId },
      });

      const res = await api.get(`/backlog/proyecto/${proyectoId}`);
      setTareas(res.data);

      setNuevaTarea("");
      setPrioridad("");
      setStoryPoints("");
      setResponsable("");
      setEpica("");
      setEstado("Por hacer");
    } catch (err) {
      console.error("Error al guardar tarea:", err);
    }
  };

  const eliminarTarea = async (id) => {
    try {
      await api.delete(`/backlog/${id}`);
      setTareas(tareas.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
    }
  };

  const actualizarStoryPoints = async (id, puntos) => {
    try {
      await api.put(`/backlog/${id}`, { storyPoints: parseInt(puntos) });
      setTareas((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, storyPoints: parseInt(puntos) } : t
        )
      );
    } catch (err) {
      console.error("Error actualizando story points:", err);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      await api.put(`/backlog/${id}`, { estado: nuevoEstado });
      setTareas((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, estado: nuevoEstado } : t
        )
      );
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
  };

  const generarDesdeIA = async () => {
    try {
      const resumen = await api.get(`/reflexiones/proyecto/${proyectoId}`);
      const reflexion = resumen.data[0];
      const prompt = `
Ikigai:\n${reflexion.ikigai}\n
Entrevistas:\n${reflexion.entrevistas}\n
Mapa de empatía:\n${reflexion.mapaEmpatia}\n

Genera una lista de historias de usuario tipo "Como usuario quiero... para..." basadas en esta información.
`;
      const res = await api.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer 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`,
            "Content-Type": "application/json",
          },
        }
      );
      const texto = res.data.choices[0].message.content;
      const items = texto.split("\n").filter((l) => l.trim());
      setIaSugerencias(items);
    } catch (err) {
      console.error("Error generando IA:", err);
    }
  };

  const toggleSeleccion = (item) => {
    setSeleccionados((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  const guardarSeleccionados = async () => {
    try {
      for (const desc of seleccionados) {
        const res = await api.post("/backlog", {
          descripcion: desc,
          prioridad: "Media",
          epica: "General",
          estado: "Por hacer",
          proyecto: { id: proyectoId },
        });
        setTareas((prev) => [...prev, res.data]);
      }
      setIaSugerencias([]);
      setSeleccionados([]);
    } catch (err) {
      console.error("Error guardando ítems IA:", err);
    }
  };

  return (
    <div className="mt-10 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Product Backlog</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Nueva historia de usuario..."
          className="flex-1 border px-4 py-2 rounded-md"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
        />
        <select
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          className="border px-2 py-2 rounded-md"
        >
          <option value="">Prioridad</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
        <select
          value={storyPoints}
          onChange={(e) => setStoryPoints(e.target.value)}
          className="border px-2 py-2 rounded-md"
        >
          <option value="">Pts</option>
          {[1, 2, 3, 4, 5].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Responsable"
          className="border px-2 py-2 rounded-md"
          value={responsable}
          onChange={(e) => setResponsable(e.target.value)}
        />
        <input
          type="text"
          placeholder="Épica o Tema"
          className="border px-2 py-2 rounded-md"
          value={epica}
          onChange={(e) => setEpica(e.target.value)}
        />
        <button
          onClick={agregarTarea}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Añadir
        </button>
        <button
          onClick={() => setMostrarResumen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ver resumen
        </button>
      </div>

      <ul className="space-y-3 mb-6">
        {tareas.length === 0 ? (
          <p className="text-gray-500 text-sm">Aún no hay tareas en el backlog.</p>
        ) : (
          tareas.map((t, i) => (
            <li
              key={t.id}
              className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md border"
            >
              <div>
                <span className="block">{i + 1}. {t.descripcion}</span>
                <span className={
                  t.prioridad === "Alta" ? "text-red-500 text-xs" :
                  t.prioridad === "Media" ? "text-yellow-500 text-xs" :
                  "text-green-500 text-xs"
                }>
                  Prioridad: {t.prioridad}
                </span>
                <span className="block text-xs text-gray-500">
                  Puntos: {t.storyPoints || "Sin estimar"}
                </span>
                <span className="block text-xs text-blue-500">
                  Estado: {t.estado || "Por hacer"}
                </span>
                {t.epica && (
                  <span className="block text-xs text-purple-500">
                    Épica: {t.epica}
                  </span>
                )}
                {t.responsable && (
                  <span className="block text-xs text-purple-500">
                    Responsable: {t.responsable}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={t.estado || "Por hacer"}
                  onChange={(e) => actualizarEstado(t.id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {["Por hacer", "En progreso", "Hecho"].map((est) => (
                    <option key={est} value={est}>{est}</option>
                  ))}
                </select>
                <button
                  onClick={() => eliminarTarea(t.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Backlog sugerido con IA</h3>
        <button
          onClick={generarDesdeIA}
          className="mb-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Generar desde IA
        </button>
        {iaSugerencias.length > 0 && (
          <>
            <p className="text-sm mb-2">Selecciona los ítems que deseas guardar:</p>
            <ul className="space-y-1 mb-3">
              {iaSugerencias.map((item, idx) => (
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
              onClick={guardarSeleccionados}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Guardar ítems seleccionados
            </button>
          </>
        )}
      </div>

      {mostrarResumen && (
        <ResumenContextualModal
          proyectoId={proyectoId}
          onClose={() => setMostrarResumen(false)}
        />
      )}

      {/* 👉 Métricas de Lead Time y Cycle Time */}
      <LeadTimeChart proyectoId={proyectoId} />
      <ChartBacklogMetrics proyectoId={proyectoId} />
    </div>
  );
}
