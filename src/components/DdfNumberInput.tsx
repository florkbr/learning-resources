import { FormGroup, NumberInput } from '@patternfly/react-core';
import React, { useId } from 'react';
import {
  UseFieldApiConfig,
  useFieldApi,
} from '@data-driven-forms/react-form-renderer';

const DdfNumberInput = (props: UseFieldApiConfig) => {
  const { input, ...rest } = useFieldApi(props);
  const reactId = useId();
  const effectiveId = rest.id || reactId;

  return (
    <FormGroup
      label={rest.label}
      isRequired={rest.isRequired}
      fieldId={effectiveId}
    >
      <NumberInput
        id={effectiveId}
        inputName={input.name}
        value={input.value}
        min={rest.minValue}
        onPlus={() => input.onChange((input.value ?? 0) + 1)}
        onMinus={() => input.onChange((input.value ?? 0) - 1)}
        onChange={(e) => input.onChange(e.currentTarget.valueAsNumber)}
        unit={rest.unit}
      />
    </FormGroup>
  );
};

export default DdfNumberInput;
