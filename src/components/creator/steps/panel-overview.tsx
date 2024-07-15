import { ItemKind, metaForKind } from '../meta';
import { WizardField } from '@data-driven-forms/pf4-component-mapper';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { Title } from '@patternfly/react-core';
import { taskStepName } from './task';
import React from 'react';
import {
  MAX_TASKS,
  NAME_PANEL_INTRODUCTION,
  NAME_PREREQUISITES,
  NAME_TASK_TITLES,
} from './common';

export const PANEL_OVERVIEW_STEP_PREFIX = 'step-panel-overview-';

export function panelOverviewStepName(kind: ItemKind): string {
  return `${PANEL_OVERVIEW_STEP_PREFIX}${kind}`;
}

export function makePanelOverviewStep({
  kind,
  panelStepTitle,
}: {
  kind: ItemKind;
  panelStepTitle: string;
}) {
  const meta = metaForKind(kind);

  const step: WizardField & { buttonLabels: { [key: string]: string } } = {
    name: panelOverviewStepName(kind),
    title: 'Create overview',
    substepOf: panelStepTitle,
    fields: [
      {
        component: componentTypes.PLAIN_TEXT,
        name: 'internal-text-overview-instructions',
        label: `Share the required details to show on the introduction (first view) in the ${meta.displayName}. Details that you entered in the previous steps have been brought in automatically.`,
      },
      {
        component: componentTypes.PLAIN_TEXT,
        name: 'internal-text-overview-header',
        label: <Title headingLevel="h3">{meta.displayName} overview</Title>,
      },
      {
        component: componentTypes.TEXTAREA,
        name: NAME_PANEL_INTRODUCTION,
        label: 'Introduction (Markdown)',
        resizeOrientation: 'vertical',
      },
      {
        component: componentTypes.FIELD_ARRAY,
        name: NAME_PREREQUISITES,
        label: 'Prerequisites',
        noItemsMessage: 'No prerequisites have been added.',
        fields: [
          {
            component: componentTypes.TEXT_FIELD,
            label: 'Prerequisite',
          },
        ],
      },
      {
        component: componentTypes.FIELD_ARRAY,
        name: NAME_TASK_TITLES,
        label: 'Tasks',
        minItems: 1,
        maxItems: MAX_TASKS,
        noItemsMessage: 'No tasks have been added.',
        initialValue: [''],
        fields: [
          {
            component: componentTypes.TEXT_FIELD,
            label: 'Title',
          },
        ],
      },
    ],
    nextStep: taskStepName(0),
    buttonLabels: {
      next: 'Create task 1 content',
    },
  };

  return step;
}
