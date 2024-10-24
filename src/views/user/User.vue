<template>
  <div data-testid="user-page">
    <Alert variant="danger" v-if="status === 'fail'">{{ error }}</Alert>
    <Alert variant="secondary" center v-if="status === 'loading'">
      <Spinner />
    </Alert>
    <ProfileCard v-if="status === 'success'" :user="data" />
  </div>
</template>

<script setup>
import ProfileCard from '@/components/ProfileCard.vue'
import { Alert, Spinner } from '@/components'
import { getUserById } from './api'
import useRouteParamApiRequest from '@/composables/useRouteParamApiRequest'

const { data, error, status } = useRouteParamApiRequest(getUserById, 'id')
</script>
