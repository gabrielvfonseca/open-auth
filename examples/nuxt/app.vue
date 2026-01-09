<script setup lang="ts">
const { data } = await useFetch("/api/user");
</script>

<template>
  <div>
    <h1>Welcome to Open Auth Nuxt Example</h1>
    <p v-if="data?.user">Logged in as {{ data.user.username || data.user.email }}</p>
    <p v-else>Not logged in</p>
  </div>
</template>
