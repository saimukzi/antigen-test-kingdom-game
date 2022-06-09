<script setup>
import * as fc_game from './fc_game.js'
import * as smz_freq_ctrl from '../smz/smz_freq_ctrl.js'
import * as smz_save from '../smz/smz_save.js'
import * as smz_single_check from '../smz/smz_single_check.js'
</script>

<script>
export default {
  data() {
    const FPS = 20;

    const retDict = {};
    retDict['fcMain'] = new fc_game.FcGame(FPS);
    retDict['freqCtrl'] = new smz_freq_ctrl.SmzFreqCtrl(FPS,()=>{retDict['fcMain'].tick();});
    retDict['fcSave'] = new smz_save.SmzSave("fc.autosave", retDict['fcMain']);
    
    return retDict;
  },
  methods: {
    onStart() {
      const self=this;
      self.fcSave.loadAutoSave();
    },
    tick() {
      const self=this;
      self.freqCtrl.tick();
      self.fcSave.tick();
    },
    onEnd() {
      const self=this;
      self.fcSave.saveAutoSave();
    },
  },
  mounted() {
    const self=this;
    self.onStart();
    window.addEventListener('beforeunload', self.onEnd);
    self.tickTimer = setInterval(self.tick, 1000/60);
  },
  beforeUnmount() {
    const self=this;
    clearInterval(self.tickTimer);
    window.removeEventListener('beforeunload', self.onEnd);
    self.onEnd();
  },
}
</script>

<template>
  <h1>Fibonacci Clicker</h1>
  <table border="1">
    <tr>
      <td>Value</td>
      <td>Action</td>
      <td>Cost</td>
    </tr>
    <tr>
      <td><b>{{fcMain.data.point}} point</b></td>
      <td><button @click="fcMain.click">+{{fcMain.data.clickAddPoint}} point</button></td>
      <td>-</td>
    </tr>
    <tr>
      <td>{{fcMain.data.clickAddPoint}} pt/click</td>
      <td><button @click="fcMain.upgradeClick" :disabled="!fcMain.upgradeClickOk()">+1 pt/click</button></td>
      <td>-{{fcMain.data.clickUpgradeMinusPoint}} pt</td>
    </tr>
    <tr>
      <td>{{fcMain.data.autoClickerAddPoint}} pt/sec</td>
      <td><button @click="fcMain.upgradeAutoClicker" :disabled="!fcMain.upgradeAutoClickerOk()">+1 pt/sec</button></td>
      <td>-{{fcMain.data.autoClickerUpgradeMinusPoint}} pt</td>
    </tr>
  </table>
  <div>fpsIn={{freqCtrl.inFreqCounter.fps}}</div>
  <div>fpsOut={{freqCtrl.outFreqCounter.fps}}</div>
  <div>lastSave={{fcSave.lastSave}} <button @click="fcSave.saveAutoSave">Save</button></div>
  <div><button @click="fcMain.newGame">New Game</button></div>
</template>

<style scoped>
button {
  font-weight: bold;
}
</style>
