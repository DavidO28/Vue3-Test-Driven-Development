<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form class="card" @submit.prevent="submit">
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
          <button class="btn btn-primary" :disabled="isDisabled">
            Sign Up
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
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

const submit = () => {
  const { passwordRepeat, ...body } = formState
  axios.post('/api/v1/users', body)
  // fetch(window.location.origin + '/api/v1/users', {
  //   method: 'POST',
  //   headers: {'Content-type' : 'application/json'},
  //   body: JSON.stringify(body)
  // })
}
</script>
