<script setup>
import * as smz_single_check from '../smz/smz_single_check.js'
import { createApp } from 'vue'
import FcGame from './FcGame.vue'
</script>

<script>
export default {
  data(){
    const retDict={};
    retDict['singleCheck'] = new smz_single_check.SmzSingleCheck('fc.singleCheck');
    return retDict;
  },
  methods: {
    onStart() {
      const self=this;
      console.log(`self.singleCheck.good=${self.singleCheck.good}`);
      if(self.singleCheck.good){
        createApp(FcGame).mount('#fc_game')
      }
    },
    onEnd() {
      const self=this;
      self.singleCheck.onEnd();
    },
  },
  mounted() {
    const self=this;
    self.onStart();
    window.addEventListener('beforeunload', self.onEnd);
  },
  beforeUnmount() {
    const self=this;
    window.removeEventListener('beforeunload', self.onEnd);
    self.onEnd();
  }
}
</script>

<template>
  <div v-if="singleCheck.good" id="fc_game"></div>
  <div v-else>
    Multiple tab is not allowed.
  </div>
</template>
