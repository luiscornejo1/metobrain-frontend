import { useState, useEffect } from "react";
import api from "../services/api";

export default function MapaEmpatiaModal({ proyectoId, onClose }) {
  const [campos, setCampos] = useState({
    piensa: "",
    ve: "",
    dice: "",
    escucha: "",
    esfuerzos: "",
    resultados: ""
  });

  const [reflexionId, setReflexionId] = useState(null);
  const [textoPrevio, setTextoPrevio] = useState("");

  useEffect(() => {
    const cargarReflexion = async () => {
      try {
        const res = await api.get(`/reflexiones/proyecto/${proyectoId}`);
        const reflexion = res.data[0];
        if (reflexion) {
          setReflexionId(reflexion.id);
          if (reflexion.mapaEmpatia) {
            setTextoPrevio(reflexion.mapaEmpatia);
          }
        }
      } catch (err) {
        console.error("Error al obtener reflexión:", err);
      }
    };

    cargarReflexion();
  }, [proyectoId]);

  const handleChange = (e) => {
    setCampos({ ...campos, [e.target.name]: e.target.value });
  };

  const guardarMapa = async () => {
    if (!reflexionId) {
      alert("No se encontró una reflexión para este proyecto.");
      return;
    }

    const textoMapa = `
🧠 Piensa y siente: ${campos.piensa}
👀 Ve: ${campos.ve}
🗣 Dice y hace: ${campos.dice}
👂 Escucha: ${campos.escucha}
😓 Esfuerzos/Dolores: ${campos.esfuerzos}
🎯 Resultados/Beneficios: ${campos.resultados}
    `;

    try {
      const res = await api.put(`/reflexiones/${reflexionId}`, {
        mapaEmpatia: textoMapa
      });
      alert("🧠 Mapa de empatía guardado exitosamente.");
      setTextoPrevio(textoMapa);
      onClose();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("No se pudo guardar el mapa.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full shadow-lg space-y-4">
        <h2 className="text-xl font-bold text-blue-700">Mapa de Empatía</h2>

        {textoPrevio && (
          <div className="bg-gray-100 p-4 rounded text-sm border mb-4 max-h-64 overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap">
              <strong className="block mb-2">Versión actual:</strong>
              {textoPrevio}
            </p>
          </div>
        )}

        {[
          { label: "🧠 ¿Qué piensa y siente el usuario?", name: "piensa" },
          { label: "👀 ¿Qué ve a su alrededor?", name: "ve" },
          { label: "🗣 ¿Qué dice y hace?", name: "dice" },
          { label: "👂 ¿Qué escucha de otros?", name: "escucha" },
          { label: "😓 ¿Cuáles son sus miedos o frustraciones?", name: "esfuerzos" },
          { label: "🎯 ¿Qué quiere lograr o ganar?", name: "resultados" }
        ].map((item, idx) => (
          <div key={idx}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{item.label}</label>
            <textarea
              name={item.name}
              value={campos[item.name]}
              onChange={handleChange}
              rows={3}
              className="w-full border p-2 rounded text-sm"
            />
          </div>
        ))}

        <div className="flex justify-between mt-4">
          <button
            onClick={guardarMapa}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar mapa
          </button>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
