export const CURIOSITIES = [
  "La mel no s'espatlla mai — s'han trobat pots de mel comestible de fa 3.000 anys.",
  "Els popets tenen tres cors i sang blava.",
  "El teu cervell consumeix uns 20% de l'energia total del cos.",
  "Els plàtans són baies, però les maduixes no.",
  "Un dia a Venus dura més que un any a Venus.",
  "Els taurons existien abans que els arbres.",
  "La Torre Eiffel pot créixer més de 15 cm d'alçada a l'estiu per la calor.",
  "Les fems dels wombats tenen forma de cub.",
  "Hi ha més partides possibles d'escacs que àtoms a l'univers observable.",
  "Cleopatra va viure més a prop de l'allunatge que de la construcció de la Gran Piràmide.",
  "L'aigua calenta pot congelar-se abans que la freda en certes condicions (efecte Mpemba).",
  "Un grup de flamencs rosa es diu flamencada.",
  "La guerra més curta de la història va durar entre 38 i 45 minuts.",
  "Els peresosos poden aguantar la respiració més temps que els dofins.",
];

export function getDailyFact(date = new Date()): string {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      86400000
  );
  return CURIOSITIES[dayOfYear % CURIOSITIES.length];
}
