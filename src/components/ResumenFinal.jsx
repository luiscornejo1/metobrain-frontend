import { FaCheckCircle, FaProjectDiagram, FaClipboardList, FaLightbulb, FaCubes, FaFlag, FaDownload } from "react-icons/fa";
import html2pdf from "html2pdf.js";

export default function ResumenFinal() {
  const fases = [
    {
      nombre: "Fase 1: Alineación",
      icono: <FaProjectDiagram className="text-blue-500 text-xl" />,
      resumen: "Se definieron propósito (Ikigai), entrevistas y empatía del usuario."
    },
    {
      nombre: "Fase 2: Backlog",
      icono: <FaClipboardList className="text-blue-700 text-xl" />,
      resumen: "Se construyó el Product Backlog con prioridades para el desarrollo."
    },
    {
      nombre: "Fase 3: Ideación",
      icono: <FaLightbulb className="text-yellow-500 text-xl" />,
      resumen: "Se propusieron funcionalidades clave a partir del análisis previo."
    },
    {
      nombre: "Fase 4: Prototipado",
      icono: <FaCubes className="text-teal-500 text-xl" />,
      resumen: "Se crearon y validaron prototipos interactivos con enlaces."
    },
    {
      nombre: "Fase 5: Lanzamiento",
      icono: <FaFlag className="text-green-600 text-xl" />,
      resumen: "Se documentaron entregables finales y cierre del proyecto."
    }
  ];

  const exportarPDF = () => {
    const element = document.getElementById("resumen-pdf");
    html2pdf().set({
      margin: 0.5,
      filename: "Resumen_Metobrain.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    }).from(element).save();
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">Resumen Final del Proyecto</h2>
        <button
          onClick={exportarPDF}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <FaDownload /> Exportar PDF
        </button>
      </div>

      <div id="resumen-pdf">
        <ul className="space-y-6">
          {fases.map((fase, index) => (
            <li
              key={index}
              className="flex gap-4 items-start border-l-4 border-blue-400 pl-4 py-2 bg-gray-50 rounded"
            >
              <div className="mt-1">{fase.icono}</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  {fase.nombre} <FaCheckCircle className="text-green-500" />
                </h3>
                <p className="text-gray-600 text-sm mt-1">{fase.resumen}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
