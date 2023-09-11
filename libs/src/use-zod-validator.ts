import type { ZodIssue, ZodTypeAny } from 'zod'
import type { UnwrapRef } from 'vue'
import { ref } from 'vue'
import { watchDebounced } from '@vueuse/core'

type Errors<T> = Record<keyof T, { message: string, errorCode: string, path: (string | number)[] }[]>

type ValidationResult<T> = {
  values: UnwrapRef<T>
  errors: Errors<T>
  isValid: boolean
}

export const useZodValidator = <T>(schema: ZodTypeAny, initialValues: T) => {
  const values = ref<T>(initialValues)
  const errors = ref<Errors<T>>({} as Errors<T>)
  const isValid = ref<boolean>(true)

  const validate = async (): Promise<ValidationResult<T>> => {
    const result = await schema.safeParseAsync(values.value)

    if (result.success) {
      isValid.value = true
      // @ts-ignore
      errors.value = {} as Errors<T>

      return {
        values: values.value,
        // @ts-ignore
        errors: {},
        isValid: true,
      }
    } else {
      isValid.value = false

      // @ts-ignore
      errors.value = result.error.flatten((issue: ZodIssue) => ({
        message: issue.message,
        errorCode: issue.code,
        path: issue.path,
      })).fieldErrors

      return {
        values: values.value,
        // @ts-ignore
        errors: errors.value,
        isValid: false,
      }
    }
  }

  watchDebounced(values, async () => {
    await validate()
  }, { deep: true, debounce: 150, maxWait: 300 })

  return {
    values,
    errors,
    isValid,
    validate,
  }
}
