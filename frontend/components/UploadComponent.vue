<template>
  <div>
    <v-card
      @drop.prevent="onDrop($event)"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
      :class="{ 'grey lighten-2': dragover }"
    >
      <v-card-text>
        <v-row class="d-flex flex-column" dense align="center" justify="center">
          <v-icon :class="[dragover ? 'mt-2, mb-6' : 'mt-5']" size="60">
            mdi-cloud-upload
          </v-icon>
          <p>
            Drop your file(s) here, or click to select them.
          </p>
        </v-row>
        <v-virtual-scroll
          v-if="uploadedFiles.length > 0"
          :items="uploadedFiles"
          height="150"
          item-height="50"
        >
          <template v-slot:default="{ item }">
            <v-list-item :key="item.name">
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                  <span class="ml-3 text--secondary">
                    {{ item.size }} bytes</span
                  >
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn @click.stop="removeFile(item.name)" icon>
                  <v-icon> mdi-close-circle</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>

            <v-divider></v-divider>
          </template>
        </v-virtual-scroll>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn icon @click.stop="submit">
          <v-icon id="upload-button">mdi-upload</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'UploadComponent',

  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      dragover: false,
      uploadedFiles: []
    }
  },

  methods: {
    removeFile (fileName) {
      // Find the index of the
      const index = this.uploadedFiles.findIndex(
        file => file.name === fileName
      )

      // If file is in uploaded files remove it
      if (index > -1) this.uploadedFiles.splice(index, 1)
    },

    onDrop (e) {
      this.dragover = false

      if (this.uploadedFiles.length > 0) this.uploadedFiles = []
      if (e.dataTransfer.files.length === 0) {
        return
      }

      if (!this.multiple && e.dataTransfer.files.length > 1) {
        console.error('Only one file can be uploaded at a time..')
      } else {
        for (var i = 0; i < e.dataTransfer.files.length; i++) {
          this.uploadedFiles.push(e.dataTransfer.files[i])
        }
      }
    },
    submit () {
      if (this.uploadedFiles.length > 0) {
        this.$emit('filesUploaded', this.uploadedFiles)
      }
    }
  }
}
</script>
