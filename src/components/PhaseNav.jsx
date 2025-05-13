const steps = [
  "Alineación",
  "Definición",
  "Ideación",
  "Prototipado",
  "Lanzamiento",
  "Resumen",
];

export default function PhaseNav({ activeStep, setActiveStep }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 shadow-md rounded-xl bg-white p-4">
      {steps.map((step, index) => (
        <button
          key={index}
          onClick={() => setActiveStep(index)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border
            ${
              activeStep === index
                ? "bg-blue-600 text-white shadow"
                : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
            }`}
        >
          {step}
        </button>
      ))}
    </div>
  );
}
