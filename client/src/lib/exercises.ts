export const exerciseTypes = [
  {
    id: 'substitution',
    title: 'Substitution Drill',
    description: 'Replace words in phrases',
    icon: '🔄',
    variant: 'primary' as const,
    category: 'interactive'
  },
  {
    id: 'conversation',
    title: 'Daily Conversation',
    description: 'English prompt → Arabic response',
    icon: '💬',
    variant: 'secondary' as const,
    category: 'practical'
  },
  {
    id: 'completion',
    title: 'Completion Drill',
    description: 'Finish the verse',
    icon: '🧩',
    variant: 'accent' as const,
    category: 'memory'
  },
  {
    id: 'comparison',
    title: 'Comparison',
    description: 'Compare similar verses',
    icon: '⚖️',
    variant: 'primary' as const,
    category: 'analysis'
  },
  {
    id: 'roleplay',
    title: 'Role Play',
    description: 'Apply Quran in real situations',
    icon: '🎭',
    variant: 'secondary' as const,
    category: 'practical'
  },
  {
    id: 'transformation',
    title: 'Transformation',
    description: 'Convert statements to questions',
    icon: '🔄',
    variant: 'accent' as const,
    category: 'grammar'
  }
];

export function getExerciseType(id: string) {
  return exerciseTypes.find(type => type.id === id);
}

export function getRandomExerciseType() {
  return exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
}
