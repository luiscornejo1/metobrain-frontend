import { useState } from "react";
import api from "../services/api";

export default function CrearProyecto({ onProyectoCreado }) {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/proyectos", { nombre });
      onProyectoCreado(res.data);  // ← devuelve el proyecto con ID
      setMensaje("✅ Proyecto creado exitosamente");
    } catch (err) {
      console.error("Error al crear proyecto:", err);
      setMensaje("❌ Error al crear el proyecto");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-2">Crear nuevo proyecto</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Nombre del proyecto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear Proyecto
        </button>
      </form>
      {mensaje && <p className="mt-2 text-sm text-gray-700">{mensaje}</p>}
    </div>
  );
}
