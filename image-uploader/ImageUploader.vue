<template lang="pug">
div
  input(type="file", accept="image/*", @change="imageChange", :disabled="state === 'uploading'")
  span(v-if="state === 'uploading'") Uploading
  span(v-if="state === 'uploaded'") Uploaded
  span(v-if="state === 'failed'") Uploading failed, try again.
</template>


<script>
import firebase from 'firebase/app';
import 'firebase/storage';

export default {
  data(){
    return {
      state: 'new',
    }
  },
  methods: {
    imageChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.state = 'uploading';
        firebase.storage().ref().child('images-upload/' + file.name + Date.now()).put(file).then(snapshot => {
          this.state = 'uploaded';
          setTimeout(() => {
            if (this.state === 'uploaded'){this.state = 'new'}
          }, 3000)
          console.info('Uploaded', snapshot);
          this.$emit('upload', snapshot.downloadURL)
        }).catch(err => {
          this.state = 'failed';
          console.error(err);
        });;
      }
    },
  },
}
</script>
