<template>
  <div>
    File uploader
    <v-btn @click="uploadDialog = true">Upload more</v-btn>
    <UploadComponent
      :dialog.sync="uploadDialog" :multiple="false" @filesUploaded="processUpload($event)"
    />
  </div>
</template>

<script>
import UploadComponent from '../components/UploadComponent'

export default {
  name: 'upload',
  components: { UploadComponent },
  data () {
    return {
      uploadDialog: true
    }
  },
  methods: {
    processUpload (data) {
      let formData = new FormData();
      formData.append('file', data[0]);
      this.$core.api.service.post( '/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(function(){
        console.log('SUCCESS!!');
      })
        .catch(function(){
          console.log('FAILURE!!');
        });
      console.log(data)
    }
  }
}
</script>

<style scoped>

</style>
