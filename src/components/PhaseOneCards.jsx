import { useState } from "react";
import { FaHeart, FaMicrophone, FaBrain } from "react-icons/fa";
import IkigaiModal from "./IkigaiModal";
import EntrevistaModal from "./EntrevistaModal";
import MapaEmpatiaModal from "./MapaEmpatiaModal";

const cards = [
  {
    title: "Ikigai",
    icon: <FaHeart className="text-red-500 text-3xl" />,
    description: "Define el propósito del equipo o del producto alineando motivación con necesidad."
  },
  {
    title: "Entrevistas",
    icon: <FaMicrophone className="text-blue-500 text-3xl" />,
    description: "Recoge testimonios de usuarios clave para entender el contexto y definir mejor el backlog."
  },
  {
    title: "Mapa de Empatía",
    icon: <FaBrain className="text-purple-500 text-3xl" />,
    description: "Visualiza lo que el usuario piensa, siente, dice y hace para generar empatía profunda."
  }
];

export default function PhaseOneCards({ proyectoId }) {
  const [showIkigaiModal, setShowIkigaiModal] = useState(false);
  const [showEntrevistaModal, setShowEntrevistaModal] = useState(false);
  const [showMapaEmpatiaModal, setShowMapaEmpatiaModal] = useState(false);

  const handleCardClick = (title) => {
    if (title === "Ikigai") {
      setShowIkigaiModal(true);
    } else if (title === "Entrevistas") {
      setShowEntrevistaModal(true);
    }
    else if (title === "Mapa de Empatía") {
      setShowMapaEmpatiaModal(true);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
      {cards.map((card, index) => (
        <div
          key={index}
          onClick={() => handleCardClick(card.title)}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition border-t-4 border-blue-500 cursor-pointer"
        >
          <div className="flex items-center gap-4 mb-4">
            {card.icon}
            <h3 className="text-xl font-semibold text-gray-800">{card.title}</h3>
          </div>
          <p className="text-gray-600 text-sm">{card.description}</p>
        </div>
      ))}

      {showIkigaiModal && (
        <IkigaiModal
          proyectoId={proyectoId}
          onClose={() => setShowIkigaiModal(false)}
          onSaved={() => setShowIkigaiModal(false)}
        />
      )}

      {showEntrevistaModal && (
        <EntrevistaModal
          proyectoId={proyectoId}
          onClose={() => setShowEntrevistaModal(false)}
        />
      )}
      {showMapaEmpatiaModal && (
        <MapaEmpatiaModal
          proyectoId={proyectoId}
          onClose={() => setShowMapaEmpatiaModal(false)}
        />
      )}
    </div>
  );
}
