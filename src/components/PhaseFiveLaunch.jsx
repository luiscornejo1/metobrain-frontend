import { useState } from "react";
import api from "../services/api";

export default function PhaseFiveLaunch({ proyectoId }) {
  const [aceptacionCliente, setAceptacionCliente] = useState("Pendiente");
  const [comentariosCliente, setComentariosCliente] = useState("");
  const [leccionesAprendidas, setLeccionesAprendidas] = useState("");
  const [enviado, setEnviado] = useState(false);

  const registrarCierre = async () => {
    if (!proyectoId) return alert("No se ha definido el proyecto.");
    try {
      await api.post("/cierre", {
        proyecto: { id: proyectoId },
        aceptacionCliente,
        comentariosCliente,
        leccionesAprendidas,
      });
      setEnviado(true);
    } catch (err) {
      console.error("Error al registrar el cierre del proyecto:", err);
      alert("Ocurrió un error al registrar el cierre.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 mt-10 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-700">🏁 Lanzamiento y Cierre</h2>

      {enviado ? (
        <div className="text-green-700 font-semibold">
          ✅ El cierre del proyecto ha sido registrado correctamente.
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block font-medium mb-1">Aceptación del cliente/patrocinador:</label>
            <select
              value={aceptacionCliente}
              onChange={(e) => setAceptacionCliente(e.target.value)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Aceptado">Aceptado</option>
              <option value="Rechazado">Rechazado</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Comentarios del cliente:</label>
            <textarea
              value={comentariosCliente}
              onChange={(e) => setComentariosCliente(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              rows={3}
              placeholder="Comentarios del cliente o patrocinador..."
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium mb-1">Lecciones aprendidas:</label>
            <textarea
              value={leccionesAprendidas}
              onChange={(e) => setLeccionesAprendidas(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              rows={4}
              placeholder="¿Qué aprendió el equipo en este proyecto?"
            />
          </div>

          <button
            onClick={registrarCierre}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Finalizar Proyecto
          </button>
        </>
      )}
    </div>
  );
}
