<template>
  <div data-testid="activation-page">
    <Alert v-if="status === 'fail'" variant="danger">
      {{ error }}
    </Alert>
    <Alert v-if="status === 'success'">{{ data.message }}</Alert>
    <Alert v-if="status === 'loading'" variant="secondary" center>
      <Spinner />
    </Alert>
  </div>
</template>

<script setup>
import { activate } from './api'
import { Spinner, Alert } from '@/components'
import useRouteParamApiRequest from '@/composables/useRouteParamApiRequest'

const { data, error, status } = useRouteParamApiRequest(activate, 'token')
</script>
