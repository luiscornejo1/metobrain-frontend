import { useState } from "react";
import { FaEye, FaEdit, FaCheckCircle } from "react-icons/fa";

export default function PhaseFourPrototype() {
  const [prototipos, setPrototipos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEnlace, setNuevoEnlace] = useState("");

  const agregarPrototipo = () => {
    if (!nuevoNombre.trim() || !nuevoEnlace.trim()) return;
    setPrototipos([
      ...prototipos,
      { id: Date.now(), nombre: nuevoNombre, enlace: nuevoEnlace }
    ]);
    setNuevoNombre("");
    setNuevoEnlace("");
  };

  return (
    <div className="mt-10 max-w-3xl mx-auto bg-white shadow p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-teal-700">Prototipos y Validación</h2>

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

      <button
        onClick={agregarPrototipo}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md"
      >
        <FaEdit className="inline mr-2" /> Registrar Prototipo
      </button>

      <ul className="mt-6 space-y-4">
        {prototipos.map((p) => (
          <li
            key={p.id}
            className="flex justify-between items-center bg-gray-100 px-4 py-3 rounded-md border"
          >
            <div>
              <p className="font-semibold">{p.nombre}</p>
              <a
                href={p.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 text-sm hover:underline"
              >
                Ver prototipo
              </a>
            </div>
            <FaCheckCircle className="text-green-500 text-xl" title="Validado" />
          </li>
        ))}
        {prototipos.length === 0 && (
          <p className="text-gray-500 text-sm">Aún no hay prototipos registrados.</p>
        )}
      </ul>
    </div>
  );
}
