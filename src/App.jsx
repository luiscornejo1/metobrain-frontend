import { useState, useEffect } from "react";
import CrearProyecto from "./components/CrearProyecto";
import SeleccionarProyecto from "./components/SeleccionarProyecto";
import PhaseNav from "./components/PhaseNav";
import PhaseView from "./components/PhaseView";

export default function App() {
  const [activeStep, setActiveStep] = useState(0);
  const [proyecto, setProyecto] = useState(null);

  // ✅ Un solo efecto para recuperar datos al inicio
  useEffect(() => {
    const proyectoGuardado = localStorage.getItem("proyecto");
    const pasoGuardado = localStorage.getItem("activeStep");

    if (proyectoGuardado) {
      setProyecto(JSON.parse(proyectoGuardado));
    }

    if (pasoGuardado !== null) {
      setActiveStep(parseInt(pasoGuardado));
    }
  }, []);

  // ✅ Guarda el paso cada vez que cambia
  useEffect(() => {
    localStorage.setItem("activeStep", activeStep);
  }, [activeStep]);

  // ✅ Guarda el proyecto cada vez que cambia
  useEffect(() => {
    if (proyecto) {
      localStorage.setItem("proyecto", JSON.stringify(proyecto));
    } else {
      localStorage.removeItem("proyecto");
    }
  }, [proyecto]);

  const handleCambiarProyecto = () => {
    setProyecto(null);
    setActiveStep(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center px-6">
      <header className="py-12 text-center max-w-3xl">
        <h1 className="text-4xl font-extrabold text-blue-700 drop-shadow">
          Metobrain – Gestión Ágil
        </h1>
        <p className="text-gray-600 text-lg mt-4">
          Acompaña el desarrollo con metodología Agile visual y guiada
        </p>
      </header>

      <section className="w-full max-w-5xl">
        {!proyecto ? (
          <>
            <SeleccionarProyecto onSeleccionado={(p) => setProyecto(p)} />
            <CrearProyecto onProyectoCreado={(p) => setProyecto(p)} />
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                Proyecto actual: <strong>{proyecto.nombre}</strong>
              </span>
              <button
                onClick={handleCambiarProyecto}
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                Cambiar de proyecto
              </button>
            </div>
            <PhaseNav activeStep={activeStep} setActiveStep={setActiveStep} />
            <PhaseView activeStep={activeStep} proyectoId={proyecto.id} />
          </>
        )}
      </section>
    </div>
  );
}
