import { useEffect, useState } from "react";
import api from "../services/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaTrash } from "react-icons/fa";

export default function PhaseThreeIdeas({ proyectoId }) {
  const [historias, setHistorias] = useState([]);
  const [ideasIA, setIdeasIA] = useState([]);
  const [prioridades, setPrioridades] = useState({});
  const [seleccionados, setSeleccionados] = useState([]);
  const [sprintBacklog, setSprintBacklog] = useState([]);

  useEffect(() => {
    if (!proyectoId) return;

    const cargarDatos = async () => {
      try {
        const resHistorias = await api.get(`/backlog/proyecto/${proyectoId}`);
        setHistorias(resHistorias.data);

        const resSprint = await api.get(`/sprint-backlog/proyecto/${proyectoId}`);
        setSprintBacklog(resSprint.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };

    cargarDatos();
  }, [proyectoId]);

  const generarIdeas = async () => {
    if (!proyectoId) return;

    try {
      const resumen = await api.get(`/reflexiones/proyecto/${proyectoId}`);
      const reflexion = resumen.data[0];
      const prompt = `
Ikigai:\n${reflexion.ikigai}\n
Entrevistas:\n${reflexion.entrevistas}\n
Mapa de empatía:\n${reflexion.mapaEmpatia}\n
Historias de Usuario:\n${historias.map((h) => h.descripcion).join("\n")}\n

Genera una lista de ideas/funcionalidades para el Sprint Backlog, en formato: "Como usuario quiero... para..."`;

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
      const ideasGeneradas = texto.split("\n").filter((l) => l.trim());
      setIdeasIA(ideasGeneradas);

      const inicial = {};
      ideasGeneradas.forEach((idea, i) => {
        inicial[i] = "Must have";
      });
      setPrioridades(inicial);
      setSeleccionados([]);
    } catch (err) {
      console.error("Error generando IA:", err);
    }
  };

  const toggleSeleccion = (idx) => {
    setSeleccionados((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const actualizarPrioridad = (idx, nuevaPrioridad) => {
    setPrioridades((prev) => ({
      ...prev,
      [idx]: nuevaPrioridad,
    }));
  };

  const guardarSeleccionados = async () => {
    try {
      const nuevosSprintBacklog = [];

      for (const idx of seleccionados) {
        const descripcion = ideasIA[idx];
        const prioridadMoscow = prioridades[idx];

        const res = await api.post("/sprint-backlog", {
          descripcion,
          prioridadMoscow,
          estado: "Por hacer",
          proyecto: { id: proyectoId },
        });

        nuevosSprintBacklog.push(res.data);
      }

      setSprintBacklog((prev) => [...prev, ...nuevosSprintBacklog]);
      setIdeasIA([]);
      setPrioridades({});
      setSeleccionados([]);
    } catch (err) {
      console.error("Error guardando ideas:", err);
    }
  };

  const eliminarSprintItem = async (id) => {
    try {
      await api.delete(`/sprint-backlog/${id}`);
      setSprintBacklog((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error eliminando ítem:", err);
    }
  };

  // ✅ Agrupar no solo las seleccionadas actuales, sino también las del Sprint Backlog
  const ideasPorPrioridad = { "Must have": [], "Should have": [], "Could have": [], "Won't have": [] };

  // 1) Ideas seleccionadas pero no guardadas aún
  seleccionados.forEach((idx) => {
    const prioridad = prioridades[idx] || "Must have";
    ideasPorPrioridad[prioridad].push(ideasIA[idx]);
  });

  // 2) Ideas ya guardadas en el Sprint Backlog
  sprintBacklog.forEach((item) => {
    const prioridad = item.prioridadMoscow || "Must have";
    ideasPorPrioridad[prioridad].push(item.descripcion);
  });

  return (
    <div className="mt-10 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Fase 3: Ideación y Sprint Backlog</h2>

      {/* Historias */}
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2 text-gray-600">Historias de Usuario (Product Backlog)</p>
        {historias.length === 0 ? (
          <p className="text-xs text-gray-500">No hay historias de usuario.</p>
        ) : (
          <ul className="list-disc pl-4 text-sm text-gray-700">
            {historias.map((hu, idx) => (
              <li key={hu.id}>{idx + 1}. {hu.descripcion}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Botón generar */}
      <button
        onClick={generarIdeas}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-4"
      >
        Generar SprintBacklog a partir de Product Backlog
      </button>

      {/* Ideas generadas */}
      {ideasIA.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-blue-700">Ideas generadas:</h3>
          <div className="space-y-2">
            {ideasIA.map((idea, idx) => (
              <div key={idx} className="p-2 bg-gray-50 rounded border shadow flex flex-col">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(idx)}
                    onChange={() => toggleSeleccion(idx)}
                  />
                  <p className="text-sm flex-1">{idea}</p>
                </div>
                <select
                  value={prioridades[idx] || "Must have"}
                  onChange={(e) => actualizarPrioridad(idx, e.target.value)}
                  className="mt-1 border rounded px-2 py-1 text-xs"
                >
                  <option value="Must have">Must have</option>
                  <option value="Should have">Should have</option>
                  <option value="Could have">Could have</option>
                  <option value="Won't have">Won't have</option>
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={guardarSeleccionados}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar Sprint Backlog
          </button>
        </div>
      )}

      {/* ✅ Cuadro SIEMPRE VISIBLE con ideas por prioridad */}
      <div className="mt-6 p-4 bg-gray-100 rounded shadow">
        <h3 className="text-md font-semibold mb-2 text-blue-700">Backlog Priorization Moscow:</h3>
        {["Must have", "Should have", "Could have", "Won't have"].map((prio) => (
          <div key={prio} className="mb-2">
            <h4 className="font-semibold text-sm">{prio}:</h4>
            {ideasPorPrioridad[prio]?.length > 0 ? (
              <ul className="list-disc ml-4 text-xs text-gray-600">
                {ideasPorPrioridad[prio].map((idea, i) => (
                  <li key={i}>{idea}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400 ml-4">Sin ideas.</p>
            )}
          </div>
        ))}
      </div>

      {/* Sprint Backlog */}
      {sprintBacklog.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2 text-purple-700">Sprint Backlog</h3>
          <ul className="space-y-2 text-sm">
            {sprintBacklog.map((item, idx) => (
              <li key={item.id} className="p-2 border rounded bg-white shadow-sm flex justify-between items-start">
                <div>
                  <p className="font-semibold">{idx + 1}. {item.descripcion}</p>
                  <p className="text-xs text-gray-500">Prioridad: {item.prioridadMoscow}</p>
                  <p className="text-xs text-gray-500">Estado: {item.estado}</p>
                </div>
                <button
                  onClick={() => eliminarSprintItem(item.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}