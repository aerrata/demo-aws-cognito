<template>
  <div>
    <div>
      <p v-if="error">{{ error }}</p>
      <input v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <button @click="handleLogin">Login</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useAwsAuth from '@/aws'
import { useRouter } from 'vue-router'

const router = useRouter()

const { error, currentUser, login, getCurrentUserDetails } = useAwsAuth()

const username = ref('')
const password = ref('')

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

onMounted(() => {
  getCurrentUserDetails()
})
</script>
