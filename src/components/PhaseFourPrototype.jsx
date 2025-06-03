import { useEffect, useState } from "react";
import api from "../services/api";
import { FaEye, FaEdit } from "react-icons/fa";
import PrototipoValidationCharts from "./PrototipoValidationCharts"; // Nuevo componente con gráficas

export default function PhaseFourPrototype({ proyectoId }) {
  const [prototipos, setPrototipos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEnlace, setNuevoEnlace] = useState("");
  const [historias, setHistorias] = useState([]);
  const [historiasSeleccionadas, setHistoriasSeleccionadas] = useState([]);

  useEffect(() => {
    if (!proyectoId) return;

    const cargarDatos = async () => {
      try {
        const resHistorias = await api.get(`/sprint-backlog/proyecto/${proyectoId}`);
        setHistorias(resHistorias.data);

        const resPrototipos = await api.get(`/prototipos/proyecto/${proyectoId}`);
        setPrototipos(resPrototipos.data);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    cargarDatos();
  }, [proyectoId]);

  const agregarPrototipo = async () => {
    if (!nuevoNombre.trim() || !nuevoEnlace.trim() || historiasSeleccionadas.length === 0) return;

    try {
      const res = await api.post("/prototipos", {
        nombre: nuevoNombre,
        enlace: nuevoEnlace,
        estadoValidacion: "Pendiente",
        historias: historiasSeleccionadas.map((id) => ({ id })),
        proyecto: { id: proyectoId },
      });

      setPrototipos([...prototipos, res.data]);
      setNuevoNombre("");
      setNuevoEnlace("");
      setHistoriasSeleccionadas([]);
    } catch (err) {
      console.error("Error guardando prototipo:", err);
    }
  };

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const res = await api.put(`/prototipos/${id}`, { estadoValidacion: nuevoEstado });
      setPrototipos((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, estadoValidacion: nuevoEstado } : p
        )
      );
    } catch (err) {
      console.error("Error actualizando estado:", err);
    }
  };

  return (
    <div className="mt-10 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-teal-700">Fase 4: Prototipos y Validación</h2>

      {/* Campos para crear nuevo prototipo */}
      <div className="grid gap-2 mb-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Nombre del prototipo"
          className="border px-3 py-2 rounded-md"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
        />
        <input
          type="url"
          placeholder="Enlace al prototipo (Figma, PDF, etc.)"
          className="border px-3 py-2 rounded-md"
          value={nuevoEnlace}
          onChange={(e) => setNuevoEnlace(e.target.value)}
        />
      </div>

      {/* Selección de historias de usuario */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-600 mb-1">Asociar historias de usuario:</p>
        <select
          multiple
          value={historiasSeleccionadas}
          onChange={(e) =>
            setHistoriasSeleccionadas(Array.from(e.target.selectedOptions, (opt) => opt.value))
          }
          className="border w-full px-2 py-2 rounded text-sm"
        >
          {historias.map((hu) => (
            <option key={hu.id} value={hu.id}>
              {hu.descripcion}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={agregarPrototipo}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
      >
        <FaEdit className="inline mr-2" /> Registrar Prototipo
      </button>

      {/* Lista de prototipos */}
      <ul className="mt-6 space-y-4">
        {prototipos.length === 0 && (
          <p className="text-gray-500 text-sm">Aún no hay prototipos registrados.</p>
        )}
        {prototipos.map((p) => (
          <li
            key={p.id}
            className="bg-gray-100 p-4 rounded-md border shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{p.nombre}</p>
                <a
                  href={p.enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 text-sm hover:underline"
                >
                  <FaEye className="inline mr-1" /> Ver prototipo
                </a>
                <p className="text-xs text-gray-500 mt-1">
                  Estado:{" "}
                  <span
                    className={
                      p.estadoValidacion === "Aprobado"
                        ? "text-green-600 font-semibold"
                        : p.estadoValidacion === "Rechazado"
                        ? "text-red-600 font-semibold"
                        : "text-yellow-600 font-semibold"
                    }
                  >
                    {p.estadoValidacion}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Historias asociadas:
                </p>
                <ul className="list-disc ml-4 text-xs text-gray-700">
                  {p.historias?.length > 0
                    ? p.historias.map((h) => <li key={h.id}>{h.descripcion}</li>)
                    : <li>Sin historias</li>}
                </ul>
              </div>

              <select
                value={p.estadoValidacion}
                onChange={(e) => actualizarEstado(p.id, e.target.value)}
                className="border rounded text-xs px-2 py-1"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>
          </li>
        ))}
      </ul>

      {/* Gráficas de indicadores de validación */}
      {proyectoId && (
        <div className="mt-10">
          <PrototipoValidationCharts proyectoId={proyectoId} />
        </div>
      )}
    </div>
  );
}
