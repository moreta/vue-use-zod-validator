# vue-use-zod-validator

Simple Zod Form validator composable for Vue 3

# This Repository

using pnpm workspace

* libs
    * vue-use-zod-validator package source
* docs
    * vitepress

# Dependencies

* vue3
* zod
* @vueuse/core
    * `watchDebounced` used.
    * https://vueuse.org/shared/watchDebounced/#watchdebounced

# Usage

## Install package

```
pnpm i zod @vueuse/core vue-use-zod-validator
```

## Example

```vue

<template>
  <div>
    <div class="field-email">
      <label>email</label>
      <input type="email" v-model.trim="values.email">
      <div v-if="errors.email">
        <p
          v-for="e in errors.email"
          :key="e.errorCode"
        >
          {{ e.message }}
        </p>
      </div>
    </div>
    <div class="field-password">
      <label>password</label>
      <input type="email" v-model.trim="values.password">
      <div v-if="errors.password">
        <p
          v-for="e in errors.password"
          :key="e.errorCode"
        >
          {{ e.message }}
        </p>
      </div>
    </div>
    <div>
      <button disabled="!isValid" @click="handleSubmit">
        Submit
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'
import { useZodValidator } from 'vue-use-zod-validator'

type SignInParams = {
  email: string
  password: string
}

const schema = z.object({
  email: z.string().required().email(),
  password: z.string().required().min(8),
})

const {
  values,
  errors,
  isValid,
  validate,
} = useZodValidator<SignInParams>(schema, {
  email: '',
  password: '',
})

const handleSubmit = async () => {
  const result = await validate()
  if (result.isValid) {
    // valid input data
    // emit('submit', result.values)
  } else {
    // invalid input data
    // show error message for form level
  }
}
</script>
```
