import React from 'react';
import { CreatorWizardStage } from './schema';
import { CreatorFiles } from './types';

export const CreatorWizardContext = React.createContext<{
  files: CreatorFiles;
  onChangeCurrentStage: (stage: CreatorWizardStage) => void;
  resetCreator: () => void;
}>({
  files: [],
  onChangeCurrentStage: () => {},
  resetCreator: () => {},
});
