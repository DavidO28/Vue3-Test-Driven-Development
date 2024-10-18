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
        <div class="mb-3">
          <label class="form-label" for="username">Username</label>
          <input
            type="text"
            class="form-control"
            id="username"
            v-model="formState.username"
          />
          <span>{{ errors.username }}</span>
        </div>
        <div class="mb-3">
          <label class="form-label" for="email">E-mail</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="formState.email"
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="password">Password</label>
          <input
            class="form-control"
            id="password"
            type="password"
            v-model="formState.password"
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="passwordRepeat">Password Repeat</label>
          <input
            class="form-control"
            id="passwordRepeat"
            type="password"
            v-model="formState.passwordRepeat"
          />
        </div>
        <div class="text-center">
          <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
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
import { ref, reactive, computed } from 'vue'
import axios from 'axios'

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
  try{
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
</script>
