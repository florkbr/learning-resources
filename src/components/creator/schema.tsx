import {
  ConditionProp,
  Field,
  FormSpy,
  Schema,
  componentTypes,
  dataTypes,
  validatorTypes,
} from '@data-driven-forms/react-form-renderer';
import {
  ALL_ITEM_KINDS,
  ALL_KIND_ENTRIES,
  ItemKind,
  ItemMeta,
  isItemKind,
  metaForKind,
} from './meta';
import { ChromeAPI } from '@redhat-cloud-services/types';
import {
  WizardButtonsProps,
  WizardField,
  WizardProps,
} from '@data-driven-forms/pf4-component-mapper';
import React from 'react';
import { Button, Title } from '@patternfly/react-core';
import {
  NAME_TASK_TITLES,
  TASK_STEP_PREFIX,
  makeTaskStep,
  taskFromStepName,
  taskStepName,
} from './steps/task';

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

const REQUIRED = {
  type: validatorTypes.REQUIRED,
} as const;

function kindMetaCondition(test: (meta: ItemMeta) => boolean): ConditionProp {
  return {
    when: NAME_KIND,
    is: (kind: string | undefined) => {
      return (
        typeof kind === 'string' && isItemKind(kind) && test(metaForKind(kind))
      );
    },
  };
}

type Bundles = ReturnType<ChromeAPI['getAvailableBundles']>;

const DETAILS_STEP_PREFIX = 'step-details-';

function detailsStepName(kind: ItemKind): string {
  return `${DETAILS_STEP_PREFIX}${kind}`;
}

export const NAME_KIND = 'kind';
export const NAME_TITLE = 'title';
export const NAME_BUNDLES = 'bundles';
export const NAME_DESCRIPTION = 'description';
export const NAME_DURATION = 'duration';
export const NAME_URL = 'url';

export const NAME_PANEL_INTRODUCTION = 'panel-overview';
export const NAME_PREREQUISITES = 'prerequisites';

const STEP_KIND = 'step-kind';
const STEP_DOWNLOAD = 'step-download';

const STEP_TITLE_PANEL_PARENT = 'Create panel';

function makeDetailsStep(kind: ItemKind, bundles: Bundles) {
  const meta = metaForKind(kind);

  const fields: Field[] = [];

  fields.push(
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'internal-text-details-description',
      label:
        'Share the details required to populate a card in the correct places.',
    },
    {
      component: componentTypes.SELECT,
      name: NAME_BUNDLES,
      label: 'Associated bundle(s)',
      simpleValue: true,
      isMulti: true,
      placeholder: 'Select all that apply',
      options: bundles.map((b) => ({
        value: b.id,
        label: `${b.title} (${b.id})`,
      })),
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: NAME_TITLE,
      label: 'Resource title',
      placeholder: 'Title to display on card',
      isRequired: true,
      validate: [REQUIRED],
    },
    {
      component: componentTypes.TEXTAREA,
      name: NAME_DESCRIPTION,
      label: 'Resource description',
      placeholder:
        "Short description of resource and will auto-truncate on card with '...' after 3 lines of text.",
      isRequired: true,
      validate: [REQUIRED],
      resizeOrientation: 'vertical',
    }
  );

  if (meta.fields.duration) {
    fields.push({
      component: 'lr-number-input',
      name: NAME_DURATION,
      label: 'Duration',
      unit: <span className="pf-v5-u-text-nowrap">minutes</span>,
      dataType: dataTypes.NUMBER,
      initialValue: 0,
      minValue: 0,
      isRequired: true,
      validate: [REQUIRED],
    });
  }

  if (meta.fields.url) {
    fields.push({
      component: componentTypes.TEXT_FIELD,
      name: NAME_URL,
      label: 'Endpoint URL',
      placeholder: 'http://url.redhat.com/docs-n-things',
      isRequired: true,
      validate: [
        REQUIRED,
        {
          type: validatorTypes.URL,
        },
      ],
      condition: kindMetaCondition((meta) => meta.fields.url === true),
    });
  }

  return {
    name: detailsStepName(kind),
    title: `${meta.displayName} details`,
    fields: fields,
    nextStep: meta.hasTasks ? panelOverviewStepName(kind) : STEP_DOWNLOAD,
    buttonLabels: {
      next: meta.hasTasks
        ? `Approve card and create ${meta.displayName} panel`
        : 'Approve card and generate files',
    },
  };
}

const MAX_TASKS = 10;

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

const PANEL_OVERVIEW_STEP_PREFIX = 'step-panel-overview-';

function panelOverviewStepName(kind: ItemKind): string {
  return `${PANEL_OVERVIEW_STEP_PREFIX}${kind}`;
}

function makePanelOverviewStep(kind: ItemKind) {
  const meta = metaForKind(kind);

  const step: WizardField & { buttonLabels: { [key: string]: string } } = {
    name: panelOverviewStepName(kind),
    title: 'Create overview',
    substepOf: STEP_TITLE_PANEL_PARENT,
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
      {
        name: STEP_KIND,
        title: 'Select content type',
        fields: [
          {
            component: componentTypes.PLAIN_TEXT,
            name: 'internal-text-kind-description',
            label: "Learning resources are grouped by their 'content type'.",
          },
          {
            component: componentTypes.RADIO,
            name: NAME_KIND,
            label: 'Select content type',
            simpleValue: true,
            options: ALL_KIND_ENTRIES.map(([name, value]) => ({
              value: name,
              label: value.displayName,
            })),
            isRequired: true,
            validate: [REQUIRED],
          },
        ],
        nextStep: {
          when: NAME_KIND,
          stepMapper: Object.fromEntries(
            ALL_ITEM_KINDS.map((kind) => [kind, detailsStepName(kind)])
          ),
        },
      },
      ...ALL_ITEM_KINDS.map((kind) => makeDetailsStep(kind, bundles)),
      ...ALL_ITEM_KINDS.filter((kind) => metaForKind(kind).hasTasks).map(
        (kind) => makePanelOverviewStep(kind)
      ),
      ...taskSteps,
      {
        name: STEP_DOWNLOAD,
        title: 'Download files',
        fields: [
          {
            component: 'lr-download-files',
            name: 'internal-download',
          },
        ],
      },
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
