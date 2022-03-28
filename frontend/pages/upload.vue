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
    async processUpload (files) {
      let formData = new FormData()
      for (let file of files) {
        formData.append('files', file)
      }
      const { data } = await this.$core.api.service.post('/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      for (const fileEl of data)
      this.uploaded.push({
        ...fileEl,
        link: this.$core.getFileIdLink(fileEl.id)
      })
    }
  }
}
</script>

<style scoped>

</style>
