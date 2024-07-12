import {
  FormGroup,
  FormHelperText,
  HelperText,
  HelperTextItem,
  NumberInput,
} from '@patternfly/react-core';
import React, { useId } from 'react';
import {
  UseFieldApiConfig,
  useFieldApi,
} from '@data-driven-forms/react-form-renderer';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/dynamic/icons/exclamation-circle-icon';

const DdfNumberInput = (props: UseFieldApiConfig) => {
  const { input, meta, ...rest } = useFieldApi(props);
  const reactId = useId();
  const effectiveId = rest.id || reactId;

  const showInvalid = meta.touched && meta.invalid;

  const focusProps = {
    onFocus: input.onFocus,
    onBlur: input.onBlur,
  };

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
        validated={showInvalid ? 'error' : 'default'}
        min={rest.minValue}
        unit={rest.unit}
        onPlus={() => input.onChange((input.value ?? 0) + 1)}
        onMinus={() => input.onChange((input.value ?? 0) - 1)}
        onChange={(e) => input.onChange(e.currentTarget.valueAsNumber)}
        {...focusProps}
        plusBtnProps={focusProps}
        minusBtnProps={focusProps}
      />

      {showInvalid ? (
        <FormHelperText>
          <HelperText>
            <HelperTextItem variant={'error'} icon={<ExclamationCircleIcon />}>
              {meta.error}
            </HelperTextItem>
          </HelperText>
        </FormHelperText>
      ) : null}
    </FormGroup>
  );
};

export default DdfNumberInput;
