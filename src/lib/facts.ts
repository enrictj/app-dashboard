export const CURIOSITIES = [
  "Honey never spoils — archaeologists have found 3,000-year-old honey still edible.",
  "Octopuses have three hearts and blue blood.",
  "Your brain uses about 20% of your body's total energy.",
  "Bananas are berries, but strawberries aren't.",
  "A day on Venus is longer than a year on Venus.",
  "Sharks existed before trees.",
  "The Eiffel Tower can grow over 6 inches taller in summer heat.",
  "Wombat poop is cube-shaped.",
  "There are more possible chess games than atoms in the observable universe.",
  "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.",
  "Hot water can freeze faster than cold water under certain conditions (Mpemba effect).",
  "A group of flamingos is called a flamboyance.",
  "The shortest war in history lasted 38 to 45 minutes.",
  "Sloths can hold their breath longer than dolphins.",
];

export function getDailyFact(date = new Date()): string {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      86400000
  );
  return CURIOSITIES[dayOfYear % CURIOSITIES.length];
}
