<template>
  <li
    class="list-group-item list-group-item-action"
    @click="route.push('/user/' + user.id)"
  >
    <img
      src="@/assets/profile.jpg"
      alt="Profile"
      width="30"
      class="rounded-circle shadow-sm"
    />
    {{ user.username }}
  </li>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  user: Object,
})
const route = useRouter()
</script>

<style scoped>
li {
  cursor: pointer;
}
</style>
