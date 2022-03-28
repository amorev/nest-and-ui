<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-spacer />
          <v-toolbar-title>Login</v-toolbar-title>
          <v-spacer />
          <v-tooltip bottom />
          <v-tooltip right />
        </v-toolbar>
        <v-card-text>
          <v-text-field
            v-model="username"
            outline
            label="Username"
          />
          <v-text-field
            v-model="password"
            outline
            label="Password"
            type="password"
          />
          <v-layout>
            <v-btn
              @click="$router.push('/signup')"
            >
              Sign up
            </v-btn>
            <v-spacer />
            <v-btn
              @click="login"
            >
              Sign in
            </v-btn>
          </v-layout>
          <span class="error_message">{{ errorMessage }}</span>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Login',
  layout: 'centered',
  data () {
    let username, password
    if (process.env.NODE_ENV === 'development') {
      username = password = 'manager'
    }
    return {
      username,
      password,
      errorMessage: null
    }
  },
  methods: {
    login (_) {
      return this.$core.api.authenticate(this.username, this.password)
    }
  }
}
</script>

<style scoped>

</style>
