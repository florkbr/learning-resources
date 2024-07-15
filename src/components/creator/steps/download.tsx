export const STEP_DOWNLOAD = 'step-download';

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
