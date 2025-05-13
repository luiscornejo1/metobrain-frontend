import { FaHeart, FaMicrophone, FaBrain } from "react-icons/fa";




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

export default function PhaseOneCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition border-t-4 border-blue-500"
        >
          <div className="flex items-center gap-4 mb-4">
            {card.icon}
            <h3 className="text-xl font-semibold text-gray-800">{card.title}</h3>
          </div>
          <p className="text-gray-600 text-sm">{card.description}</p>
        </div>
      ))}
    </div>
  );
}
