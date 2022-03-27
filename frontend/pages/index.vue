<template>
  <v-row justify="center" align="center">
    This is just an index page {{ data }}
  </v-row>
</template>

<script>
export default {
  name: 'IndexPage',
  async asyncData ({ app }) {
    const { data } = await app.$core.api.service.get('/checkAuth')
    return {
      data
    }
  }
}
</script>
