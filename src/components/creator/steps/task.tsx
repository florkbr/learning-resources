import {
  FormSpy,
  componentTypes,
} from '@data-driven-forms/react-form-renderer';
import { WizardNextStepFunctionArgument } from '@data-driven-forms/pf4-component-mapper/wizard/wizard';
import React from 'react';

export const MAX_TASKS = 10;

export const TASK_STEP_PREFIX = 'step-task-detail-';

export const NAME_TASKS_ARRAY = 'tasks';
export const NAME_TASK_TITLES = 'task-titles';

export const NAME_TASK_DESCRIPTION = 'description';
export const NAME_TASK_ENABLE_WORK_CHECK = 'enable_work_check';
export const NAME_TASK_WORK_CHECK_INSTRUCTIONS = 'work_check_instructions';
export const NAME_TASK_WORK_CHECK_HELP = 'work_check_help';

export function taskStepName(index: number): string {
  return `${TASK_STEP_PREFIX}${index}`;
}

export function taskFromStepName(name: string): number | null {
  if (name.startsWith(TASK_STEP_PREFIX)) {
    return parseInt(name.substring(TASK_STEP_PREFIX.length));
  }

  return null;
}

export function makeTaskStep({
  index,
  panelStepTitle,
  downloadStep,
}: {
  index: number;
  panelStepTitle: string;
  downloadStep: string;
}) {
  const taskName = `${NAME_TASKS_ARRAY}[${index}]`;

  const workCheckEnabledCondition = {
    when: `${taskName}.${NAME_TASK_ENABLE_WORK_CHECK}`,
    is: true,
  };

  return {
    name: taskStepName(index),
    title: `Task ${index + 1}`,
    substepOf: panelStepTitle,
    fields: [
      {
        component: 'lr-task-title-preview',
        name: `internal-task-title-preview[${index}]`,
        index: index,
      },
      {
        component: componentTypes.PLAIN_TEXT,
        name: `internal-text-task-step-description`,
        label: 'Add the content for this step of the panel.',
      },
      {
        component: componentTypes.TEXTAREA,
        name: `${taskName}.${NAME_TASK_DESCRIPTION}`,
        label: 'Description',
        resizeOrientation: 'vertical',
      },
      {
        component: componentTypes.CHECKBOX,
        name: `${taskName}.${NAME_TASK_ENABLE_WORK_CHECK}`,
        label: "Show 'Work check' section",
      },
      {
        component: componentTypes.PLAIN_TEXT,
        name: `internal-text-check-work-explanation`,
        condition: workCheckEnabledCondition,
        label: "Add the content to display in the 'Check your work box.",
      },
      {
        component: componentTypes.TEXTAREA,
        name: `${taskName}.${NAME_TASK_WORK_CHECK_INSTRUCTIONS}`,
        condition: workCheckEnabledCondition,
        label: 'Work check instructions',
        resizeOrientation: 'vertical',
      },
      {
        component: componentTypes.TEXT_FIELD,
        name: `${taskName}.${NAME_TASK_WORK_CHECK_HELP}`,
        condition: workCheckEnabledCondition,
        label: 'Optional failure message',
        placeholder: 'Try completing the task again',
      },
    ],
    nextStep: ({ values }: WizardNextStepFunctionArgument) => {
      if (index + 1 < (values?.[NAME_TASK_TITLES]?.length ?? 0)) {
        return taskStepName(index + 1);
      }

      return downloadStep;
    },
    buttonLabels: {
      next: (
        <FormSpy subscription={{ values: true }}>
          {(state) => {
            return index + 1 < state.values[NAME_TASK_TITLES].length
              ? `Create task ${index + 2} content`
              : 'Approve and generate files';
          }}
        </FormSpy>
      ),
    },
  };
}
