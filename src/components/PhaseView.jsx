import PhaseOneCards from './PhaseOneCards';
import PhaseTwoBacklog from './PhaseTwoBacklog';
import PhaseThreeIdeas from './PhaseThreeIdeas';
import PhaseFourPrototype from './PhaseFourPrototype';
import PhaseFiveLaunch from './PhaseFiveLaunch';
import ResumenFinal from './ResumenFinal';

export default function PhaseView({ activeStep }) {
  return (
    <div className="mt-10">
      {activeStep === 0 && <PhaseOneCards />}
      {activeStep === 1 && <PhaseTwoBacklog />}
      {activeStep === 2 && <PhaseThreeIdeas />}
      {activeStep === 3 && <PhaseFourPrototype />}
      {activeStep === 4 && <PhaseFiveLaunch />}
      {activeStep === 5 && <ResumenFinal />}
    </div>
  );
}