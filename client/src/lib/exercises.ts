export const exerciseTypes = [
  {
    id: 'daily_contextual',
    titleKey: 'dailyContextual',
    descriptionKey: 'dailyContextualDesc',
    icon: '🌟',
    variant: 'primary' as const,
    category: 'practical'
  },
  {
    id: 'conversation',
    titleKey: 'conversation',
    descriptionKey: 'conversationDesc',
    icon: '💬',
    variant: 'secondary' as const,
    category: 'practical'
  },
  {
    id: 'roleplay',
    titleKey: 'roleplay',
    descriptionKey: 'roleplayDesc',
    icon: '🎭',
    variant: 'secondary' as const,
    category: 'practical'
  },
  {
    id: 'transformation',
    titleKey: 'transformation',
    descriptionKey: 'transformationDesc',
    icon: '💎',
    variant: 'accent' as const,
    category: 'wisdom'
  },
  // Thematic exercise hidden per user request
  // {
  //   id: 'thematic',
  //   titleKey: 'thematic',
  //   descriptionKey: 'thematicDesc',
  //   icon: '🎯',
  //   variant: 'primary' as const,
  //   category: 'wisdom'
  // }
];

export function getExerciseType(id: string) {
  return exerciseTypes.find(type => type.id === id);
}

export function getRandomExerciseType() {
  return exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
}
