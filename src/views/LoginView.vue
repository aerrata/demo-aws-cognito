<template>
  <div>
    <div v-if="currentUser">
      <p>Logged in as: {{ currentUser.username }}</p>
      <ul>
        <li v-for="(value, key) in currentUser.attributes" :key="key">{{ key }}: {{ value }}</li>
      </ul>
    </div>
    <div v-else>
      <p v-if="error">{{ error }}</p>
      <input v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <button @click="handleLogin">Login</button>
    </div>
    <button @click="handleLogout" v-if="currentUser">Logout</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useAwsAuth from '@/aws'
import { useRouter } from 'vue-router'

const router = useRouter()

const { error, currentUser, login, logout, getCurrentUserDetails } = useAwsAuth()

const username = ref('test2@codenv.me')
const password = ref('Saraeyka_96')

const handleLogin = async () => {
  try {
    await login(username.value, password.value)
    console.log('Login successful')
    getCurrentUserDetails()
    router.push({ name: 'home' })
  } catch (err) {
    console.error('Login failed:', err)
    error.value = err.message || 'Login failed'
  }
}

const handleLogout = () => {
  logout()
  console.log('Logout successful')
}

onMounted(() => {
  getCurrentUserDetails()
})
</script>
