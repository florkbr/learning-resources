import fetchFilters from './fetchFilters';
import fetchQuickstarts from './fetchQuickstarts';
import { ChromeAPI } from '@redhat-cloud-services/types';

export type FetchAllDataResponse = [
  Awaited<ReturnType<typeof fetchFilters>>,
  Awaited<ReturnType<typeof fetchQuickstarts>>
];

function fetchAllData(
  getUser: ChromeAPI['auth']['getUser'],
  bundle?: string
): Promise<FetchAllDataResponse> {
  return Promise.all([fetchFilters(), fetchQuickstarts(getUser, bundle)]);
}

export default fetchAllData;
