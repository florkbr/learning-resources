export const STEP_DOWNLOAD = 'step-download';

export function isDownloadStep(name: string) {
  return name === STEP_DOWNLOAD;
}

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
  };
}
