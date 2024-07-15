import {
  FormSpy,
  Schema,
  componentTypes,
} from '@data-driven-forms/react-form-renderer';
import { ALL_ITEM_KINDS, metaForKind } from './meta';
import { ChromeAPI } from '@redhat-cloud-services/types';
import {
  WizardButtonsProps,
  WizardProps,
} from '@data-driven-forms/pf4-component-mapper';
import React from 'react';
import { Button } from '@patternfly/react-core';
import { TASK_STEP_PREFIX, makeTaskStep, taskFromStepName } from './steps/task';
import { DETAILS_STEP_PREFIX, makeDetailsStep } from './steps/details';
import {
  PANEL_OVERVIEW_STEP_PREFIX,
  makePanelOverviewStep,
} from './steps/panel-overview';
import { STEP_KIND, makeKindStep } from './steps/kind';
import { STEP_DOWNLOAD, makeDownloadStep } from './steps/download';
import { MAX_TASKS, NAME_KIND, NAME_TASK_TITLES } from './steps/common';

const CustomButtons = (props: WizardButtonsProps) => {
  return (
    <FormSpy
      subscription={{
        pristine: true,
        valid: true,
        validating: true,
        values: true, // The next step can depend on values.
      }}
    >
      {(state) => {
        // Ensure that the form never says "Submit", and hide the button on the
        // last step.

        const computedNext = props.nextStep
          ? props.selectNext(props.nextStep, () => state)
          : undefined;

        return (
          <>
            {computedNext !== undefined
              ? props.renderNextButton({ submitLabel: 'Next' })
              : null}
            <Button
              type="button"
              variant="secondary"
              isDisabled={props.disableBack}
              onClick={() => props.handlePrev()}
            >
              Back
            </Button>
          </>
        );
      }}
    </FormSpy>
  );
};

export const NAME_PANEL_INTRODUCTION = 'panel-overview';
export const NAME_PREREQUISITES = 'prerequisites';

const STEP_TITLE_PANEL_PARENT = 'Create panel';

export type CreatorWizardStage =
  | { type: 'card' }
  | { type: 'panel-overview' }
  | {
      type: 'task';
      index: number;
    }
  | { type: 'download' };

export function stageFromStepName(name: string): CreatorWizardStage {
  if (name === STEP_KIND || name.startsWith(DETAILS_STEP_PREFIX))
    return { type: 'card' };

  if (name.startsWith(PANEL_OVERVIEW_STEP_PREFIX))
    return { type: 'panel-overview' };

  if (name.startsWith(TASK_STEP_PREFIX)) {
    return {
      type: 'task',
      index: (() => {
        const index = taskFromStepName(name);
        if (index === null) throw new Error('unable to parse task index');

        return index;
      })(),
    };
  }

  if (name === STEP_DOWNLOAD) return { type: 'download' };

  throw new Error('unable to parse step name: ' + name);
}

export function makeSchema(chrome: ChromeAPI): Schema {
  const bundles = chrome.getAvailableBundles();

  const taskSteps = [];

  for (let i = 0; i < MAX_TASKS; ++i) {
    taskSteps.push(
      makeTaskStep({
        index: i,
        panelStepTitle: STEP_TITLE_PANEL_PARENT,
        downloadStep: STEP_DOWNLOAD,
      })
    );
  }

  const wizardProps: WizardProps & {
    component: string;
    name: string;
  } = {
    component: componentTypes.WIZARD,
    name: 'wizard-learning-resource',
    isDynamic: true,
    crossroads: [NAME_KIND, NAME_TASK_TITLES],
    fields: [
      makeKindStep(),
      ...ALL_ITEM_KINDS.map((kind) =>
        makeDetailsStep({ kind, bundles, downloadStep: STEP_DOWNLOAD })
      ),
      ...ALL_ITEM_KINDS.filter((kind) => metaForKind(kind).hasTasks).map(
        (kind) =>
          makePanelOverviewStep({
            kind,
            panelStepTitle: STEP_TITLE_PANEL_PARENT,
          })
      ),
      ...taskSteps,
      makeDownloadStep(),
    ],
  };

  const schema = {
    fields: [wizardProps],
  };

  for (const step of schema.fields) {
    if (step.component === componentTypes.WIZARD) {
      for (const rawPage of step.fields) {
        const page: typeof rawPage & {
          buttonLabels?: { [key: string]: string };
        } = rawPage;

        // Add an lr-wizard-spy component to all wizard steps. It must be here (rather
        // than at the top level of the schema) so that it is inside the WizardContext.
        page.fields.push({
          component: 'lr-wizard-spy',
          name: `internal-wizard-spies.${page.name}`,
        });

        // Use custom buttons for each step.
        if (page.buttons === undefined) {
          page.buttons = CustomButtons;
        }

        if (page.buttonLabels !== undefined) {
          // Fix missing prop errors for button labels by adding defaults.
          page.buttonLabels = {
            next: 'Next',
            cancel: 'Cancel',
            back: 'Back',
            ...page.buttonLabels,
          };

          // Don't show "Submit" as a label, since this form is never submitted.
          if (page.buttonLabels.submit === undefined) {
            page.buttonLabels.submit = page.buttonLabels.next;
          }
        }
      }
    }
  }

  return schema;
}
