export const exerciseTypes = [
  {
    id: 'substitution',
    titleKey: 'substitution',
    descriptionKey: 'substitutionDesc',
    icon: '🔄',
    variant: 'primary' as const,
    category: 'interactive'
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
    id: 'completion',
    titleKey: 'completion',
    descriptionKey: 'completionDesc',
    icon: '🧩',
    variant: 'accent' as const,
    category: 'memory'
  },
  // Comparison exercise hidden per user request
  // {
  //   id: 'comparison',
  //   titleKey: 'comparison',
  //   descriptionKey: 'comparisonDesc',
  //   icon: '⚖️',
  //   variant: 'primary' as const,
  //   category: 'analysis'
  // },
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
  // Thematic exercise hidden to keep total at 5
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
