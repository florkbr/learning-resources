import React, { useMemo } from 'react';
import useFieldApi, {
  UseFieldApiConfig,
} from '@data-driven-forms/react-form-renderer/use-field-api';
import {
  Divider,
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectGroup,
  SelectList,
  SelectOption,
} from '@patternfly/react-core';

import { FilterData } from '../../utils/FiltersCategoryInterface';

type SelectedValue = {
  [kind: string]: string[];
};

const TagsSelector = ({
  filterData,
  label,
  isRequired,
  ...props
}: UseFieldApiConfig & { filterData: FilterData; label: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onToggleClick = () => {
    input.onBlur();
    setIsOpen(!isOpen);
  };

  const { input, meta } = useFieldApi<SelectedValue | undefined>(props);

  const onSelect = (
    _event: unknown,
    value: { kind: string; value: string }
  ) => {
    const newValue = { ...input.value };
    if (!newValue[value.kind]) {
      newValue[value.kind] = [];
    }
    if (newValue[value.kind].includes(value.value)) {
      newValue[value.kind] = newValue[value.kind].filter(
        (item) => item !== value.value
      );
    } else {
      newValue[value.kind].push(value.value);
    }
    input.onChange(newValue);
  };

  const checkSelected = (kind: string, value: string) => {
    if (!input.value) {
      return false;
    }
    return input.value[kind] && input.value[kind].includes(value);
  };

  const selected = useMemo(() => {
    return Object.values(input.value || ({} as SelectedValue)).reduce<number>(
      (acc, curr) => {
        return acc + curr.length;
      },
      0
    );
  }, [input.value]);
  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      style={
        {
          width: '100%',
        } as React.CSSProperties
      }
    >
      {selected > 0 ? `Selected: ${selected}` : 'Select tags'}
    </MenuToggle>
  );
  return (
    <FormGroup label={label} isRequired={isRequired}>
      <Select
        onBlur={input.onBlur}
        onFocus={input.onFocus}
        id={input.name}
        isOpen={isOpen}
        toggle={toggle}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onSelect={onSelect as any}
        onOpenChange={setIsOpen}
        maxMenuHeight="400px"
      >
        {filterData.categories.map((category, index) =>
          category.categoryData.map((group) => (
            <>
              <SelectGroup
                key={group.group}
                label={`${category.categoryName}${
                  group.group ? ` (${group.group})` : ''
                }`}
              >
                <SelectList>
                  {group.data.map((item) => (
                    <SelectOption
                      hasCheckbox
                      isSelected={checkSelected(category.categoryId, item.id)}
                      value={{
                        value: item.id,
                        kind: category.categoryId,
                      }}
                      key={item.id}
                    >
                      {item.filterLabel}
                    </SelectOption>
                  ))}
                </SelectList>
              </SelectGroup>
              {index < filterData.categories.length - 1 && (
                <Divider key={`divider-${index}`} />
              )}
            </>
          ))
        )}
      </Select>
      {meta.touched && meta.error && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem variant="error">{meta.error}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormGroup>
  );
};

export default TagsSelector;
