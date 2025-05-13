import { useState } from "react";
import { FaLightbulb, FaTrash } from "react-icons/fa";

export default function PhaseThreeIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [nuevaIdea, setNuevaIdea] = useState("");

  const agregarIdea = () => {
    if (!nuevaIdea.trim()) return;
    setIdeas([...ideas, { id: Date.now(), texto: nuevaIdea }]);
    setNuevaIdea("");
  };

  const eliminarIdea = (id) => {
    setIdeas(ideas.filter((i) => i.id !== id));
  };

  return (
    <div className="mt-10 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-purple-700">Ideación de Funcionalidades</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Agregar una idea de funcionalidad..."
          className="flex-1 border px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-purple-200"
          value={nuevaIdea}
          onChange={(e) => setNuevaIdea(e.target.value)}
        />
        <button
          onClick={agregarIdea}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
        >
          <FaLightbulb />
        </button>
      </div>

      <ul className="space-y-3">
        {ideas.map((i) => (
          <li
            key={i.id}
            className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md border"
          >
            <span>{i.texto}</span>
            <button
              onClick={() => eliminarIdea(i.id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </li>
        ))}
        {ideas.length === 0 && (
          <p className="text-gray-500 text-sm">Aún no se han registrado ideas.</p>
        )}
      </ul>
    </div>
  );
}
