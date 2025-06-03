import PhaseOneCards from './PhaseOneCards';
import PhaseTwoBacklog from './PhaseTwoBacklog';
import PhaseThreeIdeas from './PhaseThreeIdeas';
import PhaseFourPrototype from './PhaseFourPrototype';
import PhaseFiveLaunch from './PhaseFiveLaunch';
import ResumenFinal from './ResumenFinal';

export default function PhaseView({ activeStep, proyectoId }) {
  return (
    <div className="mt-10">
      {activeStep === 0 && <PhaseOneCards proyectoId={proyectoId} />}
      {activeStep === 1 && <PhaseTwoBacklog proyectoId={proyectoId} />}
      {activeStep === 2 && <PhaseThreeIdeas proyectoId={proyectoId}/>}
      {activeStep === 3 && <PhaseFourPrototype proyectoId={proyectoId}/>}
      {activeStep === 4 && <PhaseFiveLaunch />}
      {activeStep === 5 && <ResumenFinal />}
    </div>
  );
}
