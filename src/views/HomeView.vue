<template>
  <div v-if="currentUser">
    <p>Logged in as: {{ currentUser.username }}</p>
    <button @click="handleLogout" v-if="currentUser">Logout</button>

    <!-- <ul>
      <li v-for="(value, key) in currentUser.attributes" :key="key">{{ key }}: {{ value }}</li>
    </ul> -->
  </div>
</template>

<script setup>
import useAwsAuth from '@/aws'
import { useRouter } from 'vue-router'

const router = useRouter()
const { currentUser, logout } = useAwsAuth()

const handleLogout = () => {
  logout()
  router.push({ name: 'login' })
  console.log('Logout successful')
}
</script>
