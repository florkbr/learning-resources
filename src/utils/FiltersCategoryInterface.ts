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

export interface FiltersCategory {
  categoryId: string;
  categoryName: string;
  categoryData: CategoryGroup[];
}

export interface FilterData {
  categories: FiltersCategory[];
}
