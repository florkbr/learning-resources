export interface FiltersSubCategory {
  group: string;
  data: string[];
}

export interface FiltersCategory {
  categoryName: string;
  categoryData: FiltersSubCategory[];
}
