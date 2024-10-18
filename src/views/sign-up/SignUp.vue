<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form
      class="card"
      @submit.prevent="submit"
      data-testid="form-sign-up"
      v-if="!successMessage"
    >
      <div class="card-header text-center">
        <h1>Sign Up</h1>
      </div>
      <div class="card-body">
        <AppInput
          id="username"
          label="Username"
          :help="errors.username"
          v-model="formState.username"
        />
        <AppInput
          id="email"
          label="E-mail"
          :help="errors.email"
          v-model="formState.email"
        />
        <AppInput
          id="password"
          label="Password"
          :help="errors.password"
          v-model="formState.password"
          type="password"
        />
        <AppInput
          id="passwordRepeat"
          label="Password Repeat"
          :help="passwordMismatchError"
          v-model="formState.passwordRepeat"
          type="password"
        />
        <div class="text-center">
          <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>
          <button class="btn btn-primary" :disabled="isDisabled || apiProgress">
            <span
              v-if="apiProgress"
              role="status"
              class="spinner-border spinner-border-sm"
            ></span>
            <span>Sign Up</span>
          </button>
        </div>
      </div>
    </form>
    <div v-else-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import axios from 'axios'
import { AppInput } from '@/components'

const formState = reactive({
  username: '',
  email: '',
  password: '',
  passwordRepeat: '',
})

const isDisabled = computed(() => {
  return formState.password || formState.passwordRepeat
    ? formState.password !== formState.passwordRepeat
    : true
})

const apiProgress = ref(false)
const successMessage = ref()
const errorMessage = ref()
const errors = ref({})

const submit = async () => {
  apiProgress.value = true
  errorMessage.value = ''
  const { passwordRepeat, ...body } = formState
  try {
    const response = await axios.post('/api/v1/users', body)
    successMessage.value = response.data.message
  } catch (apiError) {
    if (apiError.response?.status === 400) {
      errors.value = apiError.response.data.validationErrors
    } else {
      errorMessage.value = 'Unexpected error occurred, please try again'
    }
  } finally {
    apiProgress.value = false
  }
}

const passwordMismatchError = computed(() => {
  return formState.password !== formState.passwordRepeat
    ? 'Password mismatch'
    : undefined
})

watch(
  () => formState.username,
  () => {
    delete errors.value.username
  },
)
watch(
  () => formState.email,
  () => {
    delete errors.value.email
  },
)
watch(
  () => formState.password,
  () => {
    delete errors.value.password
  },
)
</script>
