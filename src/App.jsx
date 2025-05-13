import { useState } from 'react';
import PhaseNav from './components/PhaseNav';
import PhaseView from './components/PhaseView';

function App() {
  const [activeStep, setActiveStep] = useState(0);

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
        <PhaseNav activeStep={activeStep} setActiveStep={setActiveStep} />
        <PhaseView activeStep={activeStep} />
      </section>
    </div>
  );
}

export default App;
