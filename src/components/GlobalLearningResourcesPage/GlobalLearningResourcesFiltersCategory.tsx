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

const GlobalLearningResourcesFiltersCategory: React.FC<FiltersCategory> = ({
  categoryName,
  categoryData,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
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
            <Text component={TextVariants.small} className="pf-u-mb-0">
              {subCategory.group}
            </Text>
            {subCategory.data.map((item, itemIndex) => (
              <StackItem key={itemIndex} className="pf-v5-u-display-flex">
                <Checkbox
                  label={
                    <div className="lr-c-global-learning-resources-page__filters--checkbox">
                      <img
                        className="lr-c-global-learning-resources-page__filters--checkbox-icon pf-v5-u-mr-sm"
                        src="/apps/frontend-assets/console-landing/ansible.svg"
                        alt={item}
                      />
                      {item}
                    </div>
                  }
                  id={item.toLowerCase().replace(/ /g, '-')}
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
