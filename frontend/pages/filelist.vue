<template>
  <v-data-table
    :headers="headers"
    :items="fileList"
    :items-per-page="5"
    class="elevation-1"
  >
    <template #item.originalFileName="{ item }">
      <a target="_blank" :href="`${item.link}`">
        {{ item.originalFileName }}
      </a>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'filelist',
  data () {
    return {
      headers: [
        {
          text: 'Filename (clickable)',
          align: 'start',
          sortable: false,
          value: 'originalFileName',
        },
        { text: 'Size', value: 'size' },
        { text: 'Created at', value: 'createdAt' },
        { text: 'Link', value: 'link' },
      ],
      fileList: [],
    }
  },
  async beforeMount () {
    const { data } = await this.$core.api.service.get('/filelist')
    this.fileList = data.map(file => {
      return{
        ...file,
        link: this.$core.api.getMainUrl() + '/api/download?id=' + file.id+'&token=' + this.$core.authHandler.getAccessToken()
      }
    })
  }
}
</script>

<style scoped>

</style>
