import axios from 'axios';
import { API_BASE, FILTERS, QUICKSTARTS } from '../hooks/useQuickStarts';
import { FilterData } from './FiltersCategoryInterface';

async function fetchFilters() {
  const response = await axios.get<{ data: FilterData }>(
    `${API_BASE}${QUICKSTARTS}${FILTERS}`
  );
  return response.data;
}

export default fetchFilters;
