import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function PhaseTwoBacklog() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState("");

  const agregarTarea = () => {
    if (!nuevaTarea.trim()) return;
    setTareas([...tareas, { id: Date.now(), texto: nuevaTarea }]);
    setNuevaTarea("");
  };

  const eliminarTarea = (id) => {
    setTareas(tareas.filter((t) => t.id !== id));
  };

  return (
    <div className="mt-10 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">Product Backlog</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nueva historia de usuario..."
          className="flex-1 border px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
        />
        <button
          onClick={agregarTarea}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          <FaPlus />
        </button>
      </div>

      <ul className="space-y-3">
        {tareas.map((t) => (
          <li
            key={t.id}
            className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md border"
          >
            <span>{t.texto}</span>
            <button
              onClick={() => eliminarTarea(t.id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </li>
        ))}
        {tareas.length === 0 && (
          <p className="text-gray-500 text-sm">Aún no hay tareas en el backlog.</p>
        )}
      </ul>
    </div>
  );
}
