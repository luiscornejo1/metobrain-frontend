import { useState, useEffect } from "react";
import api from "../services/api";
import axios from "axios";

export default function GeneradorBacklogIA({ proyectoId }) {
  const [cargando, setCargando] = useState(false);
  const [itemsSugeridos, setItemsSugeridos] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  const analizar = async () => {
    setCargando(true);
    try {
      const res = await api.get(`/api/reflexiones/proyecto/${proyectoId}`);
      const datos = res.data[0];

      if (!datos) {
        alert("No se encontraron datos del proyecto.");
        return;
      }

      const prompt = `Dado el siguiente resumen de un proyecto ágil:

IKIGAI:
${datos.ikigai}

ENTREVISTAS:
${datos.entrevistas}

MAPA DE EMPATÍA:
${datos.mapaEmpatia}

Genera ítems del backlog en formato: "Como usuario quiero... para..."`;

      const respuesta = await axios.post("https://api.openai.com/v1/chat/completions", {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      }, {
        headers: {
          Authorization: `Bearer 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`,
          "Content-Type": "application/json"
        }
      });

      const texto = respuesta.data.choices[0].message.content;
      const sugerencias = texto.split("\n").filter(line => line.trim() !== "");
      setItemsSugeridos(sugerencias);
    } catch (err) {
      console.error("Error al generar ítems:", err);
      alert("Error al generar backlog con IA.");
    }
    setCargando(false);
  };

  const alternarSeleccion = (item) => {
    setSeleccionados((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const guardarSeleccionados = async () => {
    try {
      for (const descripcion of seleccionados) {
        await api.post("/api/backlog", {
          descripcion,
          proyecto: { id: proyectoId }
        });
      }
      alert("Ítems del backlog guardados ✅");
      setItemsSugeridos([]);
      setSeleccionados([]);
    } catch (err) {
      console.error("Error guardando ítems:", err);
      alert("Error al guardar los ítems seleccionados.");
    }
  };

  return (
    <div className="bg-white border p-6 rounded shadow-md">
      <h3 className="text-lg font-bold text-gray-800 mb-3">Backlog sugerido con IA</h3>
      <button
        onClick={analizar}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={cargando}
      >
        {cargando ? "Generando..." : "Generar desde IA"}
      </button>

      {itemsSugeridos.length > 0 && (
        <div className="mt-4">
          <p className="text-sm mb-2 text-gray-600">Selecciona los ítems que deseas guardar:</p>
          <ul className="space-y-1">
            {itemsSugeridos.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={seleccionados.includes(item)}
                  onChange={() => alternarSeleccion(item)}
                />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={guardarSeleccionados}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar ítems seleccionados
          </button>
        </div>
      )}
    </div>
  );
}
