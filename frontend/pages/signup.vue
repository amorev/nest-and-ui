<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md4>
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-spacer />
          <v-toolbar-title>Sign up</v-toolbar-title>
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
          <v-text-field
            v-model="repeatPassword"
            outline
            label="Repeat Password"
            type="password"
          />
          <v-layout>
            <v-spacer />
            <v-btn
              @click="signup"
            >
              Войти
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
    let username, password = ''
    return {
      username,
      password,
      repeatPassword: '',
      errorMessage: ''
    }
  },
  methods: {
    signup (_) {
      if (this.password !== this.repeatPassword) {
        this.errorMessage = 'Passwords are not same'
      }
      return this.$core.api.signup(this.username, this.password)
    }
  }
}
</script>

<style scoped>

</style>
