import React, { useState } from 'react';
import {
  Checkbox,
  ExpandableSection,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import { FiltersCategory } from '../../utils/FiltersCategoryInterface';
import { Filter } from '../../utils/filtersInterface';

const GlobalLearningResourcesFiltersCategory: React.FC<FiltersCategory> = ({
  categoryId,
  categoryName,
  categoryData,
  loaderOptions,
  setLoaderOptions,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  const updateLoaderOptions = (filter: Filter, isChecked: boolean) => {
    const updatedCategory = isChecked
      ? [...(loaderOptions[categoryId] || []), filter.id]
      : (loaderOptions[categoryId] || []).filter((id) => id !== filter.id);

    setLoaderOptions({
      ...loaderOptions,
      [categoryId]: updatedCategory,
    });
  };

  const isFilterChecked = (filterId: string) => {
    return (loaderOptions[categoryId] || []).includes(filterId);
  };

  return (
    <ExpandableSection
      toggleText={categoryName}
      onToggle={onToggle}
      isExpanded={isExpanded}
    >
      {categoryData.map((subCategory, index) => (
        <Stack component="div" className="pf-v5-u-mt-md" key={index}>
          <TextContent>
            {subCategory.group ? (
              <Text component={TextVariants.small} className="pf-u-mb-0">
                {subCategory.group}
              </Text>
            ) : null}
            {subCategory.data.map((item) => (
              <StackItem key={categoryId} className="pf-v5-u-display-flex">
                <Checkbox
                  label={
                    <div className="lr-c-global-learning-resources-page__filters--checkbox">
                      {item.icon ? (
                        <img
                          className="lr-c-global-learning-resources-page__filters--checkbox-icon pf-v5-u-mr-sm"
                          src={
                            '/apps/frontend-assets/console-landing/ansible.svg'
                          }
                          alt={item.filterLabel}
                        />
                      ) : null}
                      {item.filterLabel}
                    </div>
                  }
                  id={item.id}
                  isChecked={isFilterChecked(item.id)}
                  onChange={(event: React.FormEvent<HTMLInputElement>) =>
                    updateLoaderOptions(item, event.currentTarget.checked)
                  }
                />
              </StackItem>
            ))}
          </TextContent>
        </Stack>
      ))}
    </ExpandableSection>
  );
};

export default GlobalLearningResourcesFiltersCategory;
