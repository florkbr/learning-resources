import React, { useContext } from 'react';
import { WizardButtonsProps } from '@data-driven-forms/pf4-component-mapper';
import { Button } from '@patternfly/react-core';
import { CreatorWizardContext } from '../context';
import PlusCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/plus-circle-icon';

export const STEP_DOWNLOAD = 'step-download';

export function isDownloadStep(name: string) {
  return name === STEP_DOWNLOAD;
}

const DownloadStepButtons = (props: WizardButtonsProps) => {
  const { resetCreator } = useContext(CreatorWizardContext);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        isDisabled={props.disableBack}
        onClick={() => props.handlePrev()}
      >
        Back
      </Button>

      <Button
        type="button"
        variant="secondary"
        icon={<PlusCircleIcon />}
        onClick={resetCreator}
      >
        Add another learning resource
      </Button>
    </>
  );
};

export function makeDownloadStep() {
  return {
    name: STEP_DOWNLOAD,
    title: 'Download files',
    fields: [
      {
        component: 'lr-download-files',
        name: 'internal-download',
      },
    ],
    buttons: DownloadStepButtons,
  };
}
