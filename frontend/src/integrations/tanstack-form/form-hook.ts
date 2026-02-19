import { createFormHook } from '@tanstack/react-form';
import { fieldContext, formContext } from './form-context';
import FieldText from '@/components/common/tanstack-form/field-text';
import FieldPassword from '@/components/common/tanstack-form/field-password';
import FieldNumber from '@/components/common/tanstack-form/field-number';
import FieldSelect from '@/components/common/tanstack-form/field-select';
import FieldTextarea from '@/components/common/tanstack-form/field-textarea';

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FieldText,
    FieldPassword,
    FieldNumber,
    FieldSelect,
    FieldTextarea,
  },
  formComponents: {},
});
