<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { LanguageSelector, NavBar } from './components'
</script>

<template>
  <main class="container">
    <NavBar />
    <LanguageSelector />
    <RouterView />
  </main>
</template>
