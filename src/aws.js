import { ref } from 'vue'
import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js'

const useAwsAuth = () => {
  const userPool = new CognitoUserPool({
    UserPoolId: import.meta.env.VITE_AWS_USERPOOL_ID,
    ClientId: import.meta.env.VITE_AWS_CLIENT_ID,
  })

  const error = ref(null)
  const currentUser = ref(userPool.getCurrentUser())

  const login = (username, password) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    })

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    })

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (session) => {
          currentUser.value = cognitoUser
          resolve(session)
        },
        onFailure: (err) => {
          error.value = err.message || 'Login failed'
          reject(err)
        },
      })
    })
  }

  const logout = () => {
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.signOut()
      currentUser.value = null
    }
  }

  const getCurrentUserDetails = () => {
    const cognitoUser = userPool.getCurrentUser()
    if (cognitoUser) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          error.value = err.message || 'Failed to get session'
          return
        }
        cognitoUser.getUserAttributes((err, attributes) => {
          if (err) {
            error.value = err.message || 'Failed to get user attributes'
            return
          }
          currentUser.value = {
            username: cognitoUser.getUsername(),
            attributes: attributes.reduce((acc, attr) => {
              acc[attr.getName()] = attr.getValue()
              return acc
            }, {}),
          }
        })
      })
    }
  }

  return {
    error,
    currentUser,
    login,
    logout,
    getCurrentUserDetails,
  }
}

export default useAwsAuth
