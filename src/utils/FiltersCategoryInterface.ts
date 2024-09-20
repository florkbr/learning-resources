import { FetchQuickstartsOptions } from './fetchQuickstarts';

export interface FilterItem {
  id: string;
  filterLabel: string;
  cardLabel: string;
  color?: string;
  icon?: string;
}

export interface CategoryGroup {
  group: string;
  data: FilterItem[];
}

type CategoryID = keyof FetchQuickstartsOptions;

export interface FiltersCategory {
  categoryId: CategoryID;
  categoryName: string;
  categoryData: CategoryGroup[];
  loaderOptions: FetchQuickstartsOptions;
  setLoaderOptions: (options: FetchQuickstartsOptions) => void;
}

export interface FilterData {
  categories: FiltersCategory[];
}

export interface FiltersAPI {
  data: {
    categories: FiltersCategory[];
  };
}
