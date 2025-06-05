import { useEffect, useState } from "react";
import api from "../services/api";

export default function PhaseOneResumen({ proyectoId }) {
  const [reflexion, setReflexion] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ ikigai: "", entrevistas: "", mapaEmpatia: "" });

  useEffect(() => {
    if (!proyectoId) return;
    api.get(`/api/reflexiones/proyecto/${proyectoId}`)
      .then((res) => {
        if (res.data.length > 0) {
          setReflexion(res.data[0]);
          setForm({
            ikigai: res.data[0].ikigai,
            entrevistas: res.data[0].entrevistas,
            mapaEmpatia: res.data[0].mapaEmpatia
          });
        }
      })
      .catch((err) => {
        console.error("Error al cargar reflexión:", err);
      });
  }, [proyectoId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const actualizarReflexion = async () => {
    try {
      const updated = {
        ...reflexion,
        ikigai: form.ikigai,
        entrevistas: form.entrevistas,
        mapaEmpatia: form.mapaEmpatia
      };
      await api.put(`/api/reflexiones/${reflexion.id}`, updated);
      setReflexion(updated);
      setEditando(false);
      alert("Reflexión actualizada ✅");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar reflexión ❌");
    }
  };

  if (!reflexion) {
    return <p className="text-gray-500 text-center mt-6">No se ha registrado reflexión inicial para este proyecto.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow mt-10">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Resumen de Reflexión Inicial</h2>

      {editando ? (
        <>
          <textarea
            name="ikigai"
            value={form.ikigai}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
            rows={3}
            placeholder="Ikigai"
          />
          <textarea
            name="entrevistas"
            value={form.entrevistas}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
            rows={3}
            placeholder="Entrevistas"
          />
          <textarea
            name="mapaEmpatia"
            value={form.mapaEmpatia}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
            rows={3}
            placeholder="Mapa de Empatía"
          />

          <button
            onClick={actualizarReflexion}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
          >
            Guardar cambios
          </button>
          <button
            onClick={() => setEditando(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
        </>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="font-medium text-gray-700">Ikigai</h3>
            <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{reflexion.ikigai}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-gray-700">Entrevistas</h3>
            <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{reflexion.entrevistas}</p>
          </div>

          <div className="mb-2">
            <h3 className="font-medium text-gray-700">Mapa de Empatía</h3>
            <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{reflexion.mapaEmpatia}</p>
          </div>

          <button
            onClick={() => setEditando(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Editar reflexión
          </button>
        </>
      )}
    </div>
  );
}
