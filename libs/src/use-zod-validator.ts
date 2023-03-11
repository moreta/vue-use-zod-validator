import type { ZodIssue, ZodTypeAny } from 'zod'
import type { UnwrapRef } from 'vue'
import { computed, ref } from 'vue'
import { watchDebounced } from '@vueuse/core'

interface ValidationResult<T> {
  values: UnwrapRef<T>
  errors: Record<keyof T, string>;
  isValid: boolean;
}

export const useZodValidator = <T>(schema: ZodTypeAny, initialValues: T) => {
  const values = ref<T>(initialValues)
  const errors = ref<Record<keyof T, string>>({} as Record<keyof T, string>)
  const isValid = computed(() => Object.keys(errors.value).length === 0)

  const validate = async (): Promise<ValidationResult<T>> => {
    const result = await schema.safeParseAsync(values.value)
    if (result.success) {
      errors.value = {} as Record<keyof T, string>
      return {
        values: values.value,
        errors: errors.value,
        isValid: true,
      }
    } else {
      errors.value = result.error.flatten((issue: ZodIssue) => ({
        message: issue.message,
        errorCode: issue.code,
      })).fieldErrors
      return {
        values: values.value,
        errors: errors.value,
        isValid: false,
      }
    }
  }

  watchDebounced(values, async () => {
    await validate()
  }, { deep: true, debounce: 300, maxWait: 500 })

  return {
    values,
    errors,
    isValid,
    validate,
  }
}
