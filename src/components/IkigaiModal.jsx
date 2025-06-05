import { useState, useEffect } from "react";
import api from "../services/api";
import axios from "axios";

export default function IkigaiModal({ proyectoId, onClose, onSaved }) {
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    console.log("🧩 Proyecto ID recibido:", proyectoId);
  }, [proyectoId]);

  const generarIkigai = async () => {
    setLoading(true);
    setResultado(null);
    try {
      const prompt = `Dada esta descripción personal: \"${descripcion}\"
Resume en 4 áreas:
- Pasión
- Profesión
- Vocación
- Misión
Y luego genera una frase de Ikigai inspiradora.`;

      const res = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8
      }, {
        headers: {
          Authorization: `Bearer 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
`,
          "Content-Type": "application/json"
        }
      });

      const texto = res.data.choices[0].message.content;
      setResultado(texto);
    } catch (err) {
      console.error("Error generando Ikigai:", err);
      alert("Hubo un problema al generar tu Ikigai");
    }
    setLoading(false);
  };

  const guardarIkigai = async () => {
  if (!resultado) return;

  if (!proyectoId) {
    alert("Error: No se ha definido un ID de proyecto.");
    console.error("🚫 proyectoId es null o undefined");
    return;
  }

  const payload = {
    ikigai: resultado,
    entrevistas: "",
    mapaEmpatia: "",
    proyecto: {
      id: proyectoId
    }
  };

  console.log("📤 Enviando reflexión:", payload);

  try {
    await api.post("/api/reflexiones", payload);
    setGuardado(true);
    onSaved();
  } catch (error) {
    console.error("❌ Error guardando Ikigai:", error);
    alert("Ocurrió un error al guardar tu Ikigai. Revisa la consola.");
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-xl w-full shadow-lg">
        <h2 className="text-xl font-bold text-blue-600 mb-4">Genera tu Ikigai con ayuda de IA 🤖</h2>

        {!resultado && !guardado && (
          <>
            <textarea
              className="w-full border p-2 rounded mb-4"
              rows={4}
              placeholder="Describe tu experiencia, talentos, pasiones y propósito"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />

            <button
              onClick={generarIkigai}
              disabled={loading || descripcion.length < 10}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Generando..." : "Sugerir Ikigai"}
            </button>
          </>
        )}

        {resultado && !guardado && (
          <div className="mt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Tu Ikigai sugerido ✨</h4>
            <p className="text-sm whitespace-pre-wrap bg-gray-100 p-3 rounded border text-gray-700">{resultado}</p>

            <button
              onClick={guardarIkigai}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Guardar Ikigai y continuar 📝
            </button>
          </div>
        )}

        {guardado && (
          <div className="mt-4 text-green-600 font-semibold">
            ✅ ¡Ikigai guardado exitosamente! Puedes continuar con las entrevistas.
          </div>
        )}

        <div className="mt-6 text-right">
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
