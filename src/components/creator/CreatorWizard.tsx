import {
  Button,
  ClipboardCopy,
  ClipboardCopyVariant,
  Stack,
  StackItem,
  Text,
  Title,
} from '@patternfly/react-core';
import DownloadIcon from '@patternfly/react-icons/dist/dynamic/icons/download-icon';
import React, { useContext, useEffect, useMemo } from 'react';
import { ItemKind, isItemKind, metaForKind } from './meta';
import { QuickStartSpec, QuickStartTask } from '@patternfly/quickstarts';
import {
  AnyObject,
  FormRenderer,
  FormSpy,
} from '@data-driven-forms/react-form-renderer';
import DdfWizardContext from '@data-driven-forms/react-form-renderer/wizard-context';
import pf4ComponentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import { CreatorWizardStage, makeSchema, stageFromStepName } from './schema';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { downloadFile } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import SimpleButton from '../SimpleButton';
import DdfNumberInput from '../DdfNumberInput';
import {
  NAME_BUNDLES,
  NAME_DESCRIPTION,
  NAME_DURATION,
  NAME_KIND,
  NAME_PANEL_INTRODUCTION,
  NAME_PREREQUISITES,
  NAME_TASKS_ARRAY,
  NAME_TASK_TITLES,
  NAME_TITLE,
  NAME_URL,
} from './steps/common';
import StringArrayInput from '../StringArrayInput';

type CreatorFiles = {
  name: string;
  content: string;
}[];

export type CreatorWizardProps = {
  onChangeKind: (newKind: ItemKind | null) => void;
  onChangeQuickStartSpec: (newValue: QuickStartSpec) => void;
  onChangeBundles: (newValue: string[]) => void;
  onChangeCurrentStage: (stage: CreatorWizardStage) => void;
  files: CreatorFiles;
};

type FormValue = AnyObject;

type UpdaterProps = {
  values: FormValue;
  onChangeKind: (newKind: ItemKind | null) => void;
  onChangeBundles: (bundles: string[]) => void;
  onChangeQuickStartSpec: (newValue: QuickStartSpec) => void;
};

const DEFAULT_TASK_TITLES: string[] = [''];

export const EMPTY_TASK: QuickStartTask = {};

type FormTaskValue = {
  description?: string;
  enable_work_check?: boolean;
  work_check_instructions?: string;
  work_check_help?: string;
};

const PropUpdater = ({
  values,
  onChangeKind,
  onChangeBundles,
  onChangeQuickStartSpec,
}: UpdaterProps) => {
  const bundles = values[NAME_BUNDLES];

  useEffect(() => {
    onChangeBundles(bundles ?? []);
  }, [bundles]);

  const rawKind: string | undefined = values[NAME_KIND];
  const title: string | undefined = values[NAME_TITLE];
  const description: string | undefined = values[NAME_DESCRIPTION];
  const url: string | undefined = values[NAME_URL];
  const duration: number | string | undefined = values[NAME_DURATION];
  const prerequisites: string[] | undefined = values[NAME_PREREQUISITES];
  const introduction: string | undefined = values[NAME_PANEL_INTRODUCTION];

  const taskTitles: string[] = values[NAME_TASK_TITLES] ?? DEFAULT_TASK_TITLES;
  const taskValues: FormTaskValue[] | undefined = values[NAME_TASKS_ARRAY];

  const kind =
    typeof rawKind === 'string' && isItemKind(rawKind) ? rawKind : null;

  const meta = kind !== null ? metaForKind(kind) : null;

  useEffect(() => {
    onChangeKind(kind);
  }, [kind]);

  const effectiveTasks = useMemo(() => {
    if (meta?.hasTasks !== true) return undefined;

    const out: QuickStartTask[] = [];

    // The task titles array determines how many tasks there should be.
    for (let i = 0; i < taskTitles.length; ++i) {
      const taskValue = taskValues?.[i];

      out.push({
        title: taskTitles[i],
        description: taskValue?.description ?? '',
        review: taskValue?.enable_work_check
          ? {
              instructions: taskValue?.work_check_instructions,
              failedTaskHelp: taskValue?.work_check_help,
            } ?? ''
          : undefined,
      });
    }

    return out;
  }, [meta, taskTitles, taskValues]);

  useEffect(() => {
    onChangeQuickStartSpec({
      type:
        meta !== null
          ? {
              text: meta.displayName,
              color: meta.tagColor,
            }
          : undefined,
      displayName: title ?? '',
      description: description ?? '',
      icon: null,
      link:
        meta?.fields?.url && url !== undefined
          ? {
              text: 'View documentation',
              href: url,
            }
          : undefined,
      durationMinutes:
        meta?.fields?.duration && typeof duration === 'number'
          ? duration
          : undefined,
      prerequisites: meta?.hasTasks === true ? prerequisites : undefined,
      introduction: meta?.hasTasks === true ? introduction : undefined,
      tasks: effectiveTasks,
    });

    onChangeKind(kind);
  }, [
    meta,
    rawKind,
    title,
    description,
    url,
    duration,
    prerequisites,
    introduction,
    effectiveTasks,
  ]);

  // Allow use as JSX component
  return undefined;
};

const CreatorWizardContext = React.createContext<{
  files: CreatorFiles;
  onChangeCurrentStage: (stage: CreatorWizardStage) => void;
}>({
  files: [],
  onChangeCurrentStage: () => {},
});

const FileDownload = () => {
  const { files } = useContext(CreatorWizardContext);

  function doDownload(file: { content: string; name: string }) {
    const dotIndex = file.name.lastIndexOf('.');
    const baseName =
      dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;
    const extension =
      dotIndex !== -1 ? file.name.substring(dotIndex + 1) : 'txt';

    downloadFile(file.content, baseName, extension);
  }

  return (
    <div>
      <Stack hasGutter>
        <StackItem>
          <Text>
            Download these files and use them to create the learning resource PR
            in the{' '}
            <a
              href="https://github.com/RedHatInsights/quickstarts/tree/main/docs/quickstarts"
              target="_blank"
              rel="noreferrer"
            >
              {' '}
              correct repo
            </a>
            .
          </Text>
        </StackItem>

        <StackItem>
          <Button
            variant="primary"
            icon={<DownloadIcon />}
            onClick={() => files.forEach((file) => doDownload(file))}
          >
            Download all ({files.length}) files
          </Button>
        </StackItem>

        {files.map((file) => (
          <StackItem key={file.name}>
            <SimpleButton
              icon={<DownloadIcon />}
              className="pf-v5-u-mb-sm"
              onClick={() => doDownload(file)}
            >
              {file.name}
            </SimpleButton>

            <ClipboardCopy
              isCode
              isReadOnly
              variant={ClipboardCopyVariant.expansion}
              hoverTip="Copy"
              clickTip="Copied"
            >
              {file.content}
            </ClipboardCopy>
          </StackItem>
        ))}
      </Stack>
    </div>
  );
};

// Watches for changes in the current step, then calls onChangeCurrentTask so
// that Creator can update the live preview.
const WizardSpy = () => {
  const wizardContext = useContext(DdfWizardContext);
  const creatorContext = useContext(CreatorWizardContext);

  useEffect(() => {
    creatorContext.onChangeCurrentStage(
      stageFromStepName(wizardContext.currentStep.name)
    );
  }, [wizardContext.currentStep.name]);

  return undefined;
};

const TaskTitlePreview = ({ index }: { index: number }) => {
  return (
    <FormSpy subscription={{ values: true }}>
      {(state) => (
        <Title headingLevel="h3">
          {state.values?.[NAME_TASK_TITLES]?.[index] ?? ''}
        </Title>
      )}
    </FormSpy>
  );
};

const CreatorWizard = ({
  onChangeKind,
  onChangeQuickStartSpec,
  onChangeBundles,
  onChangeCurrentStage,
  files,
}: CreatorWizardProps) => {
  const chrome = useChrome();
  const schema = useMemo(() => makeSchema(chrome), []);

  const context = useMemo(
    () => ({
      files,
      onChangeCurrentStage,
    }),
    [files, onChangeCurrentStage]
  );

  const componentMapper = {
    ...pf4ComponentMapper,
    'lr-number-input': DdfNumberInput,
    'lr-download-files': FileDownload,
    'lr-wizard-spy': WizardSpy,
    'lr-task-title-preview': TaskTitlePreview,
    'lr-string-array': StringArrayInput,
  };

  return (
    <CreatorWizardContext.Provider value={context}>
      <FormRenderer
        onSubmit={() => {}}
        schema={schema}
        componentMapper={componentMapper}
      >
        {({ formFields }) => (
          <form onSubmit={(e) => e.preventDefault()} className="pf-v5-c-form">
            <FormSpy subscription={{ values: true }}>
              {/*
            In order to display the live preview, we need to update the parent
            whenever the form state changes. Unfortunately, as best as I can
            tell, there is no way to pass FormRenderer a callback that's called
            whenever a value changes.

            The example at [0] shows using a custom component in the schema to
            watch the values, but it seems clearer to just add it once here
            (and it avoids introducing another custom component name).

            [0]: https://github.com/data-driven-forms/react-forms/blob/master/packages/react-renderer-demo/src/examples/components/examples/value-listener.js
             */}
              {(props) => (
                <PropUpdater
                  values={props.values}
                  onChangeKind={onChangeKind}
                  onChangeBundles={onChangeBundles}
                  onChangeQuickStartSpec={onChangeQuickStartSpec}
                />
              )}
            </FormSpy>
            <>{formFields}</>
          </form>
        )}
      </FormRenderer>
    </CreatorWizardContext.Provider>
  );
};

export default CreatorWizard;
