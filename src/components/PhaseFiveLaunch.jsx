// src/components/PhaseFiveLaunch.jsx
import { useState } from "react";
import { FaFlagCheckered, FaRocket } from "react-icons/fa";

export default function PhaseFiveLaunch() {
  const [entregables, setEntregables] = useState([]);
  const [nuevo, setNuevo] = useState("");

  const agregarEntregable = () => {
    if (!nuevo.trim()) return;
    setEntregables([...entregables, { id: Date.now(), texto: nuevo }]);
    setNuevo("");
  };

  return (
    <div className="mt-10 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-green-700 flex items-center gap-2">
        <FaFlagCheckered /> Lanzamiento y Cierre
      </h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Agrega un entregable o conclusión final..."
          className="flex-1 border px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-green-200"
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
        />
        <button
          onClick={agregarEntregable}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
        >
          <FaRocket />
        </button>
      </div>

      <ul className="space-y-3">
        {entregables.map((e) => (
          <li
            key={e.id}
            className="bg-gray-50 px-4 py-2 rounded-md border border-green-300"
          >
            {e.texto}
          </li>
        ))}
        {entregables.length === 0 && (
          <p className="text-gray-500 text-sm">No se han registrado entregables aún.</p>
        )}
      </ul>
    </div>
  );
}
