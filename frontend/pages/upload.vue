<template>
  <div>
    <UploadComponent
      :multiple="false" @filesUploaded="processUpload($event)"
    />
    <div v-for="file in uploaded">
      <a :href="file.link">{{ file.originalFileName }}</a>
    </div>
  </div>
</template>

<script>
import UploadComponent from '../components/UploadComponent'

export default {
  name: 'upload',
  components: { UploadComponent },
  data () {
    return {
      uploadDialog: true,
      uploaded: []
    }
  },
  methods: {
    async processUpload (file) {
      let formData = new FormData()
      formData.append('file', file[0])
      const { data } = await this.$core.api.service.post('/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      this.uploaded.push({
        ...data,
        link: this.$core.getFileIdLink(data.id)
      })
    }
  }
}
</script>

<style scoped>

</style>
