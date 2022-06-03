'use strict';

export const FreqCtrl = (function(){

class FreqCtrl {
  constructor(freq,callback){
    const self=this;
    self.freq = freq;
    self.callback = callback;
    
    self.msList = Array(freq);
    for(var i=0;i<freq;++i){
      self.msList[i] = Math.floor((1000*(i+1))/freq) - Math.floor((1000*i)/freq);
    }
    self.msListIdx = 0;
    self.msDiffMax = Math.floor(2500/freq);
    
    self.lastMs = Date.now();
  };
  tick(){
    const self=this;
    const NOW_MS = Date.now();
    if(NOW_MS-self.lastMs>self.msDiffMax){
      self.lastMs = NOW_MS-self.msDiffMax;
    }
    while(self.lastMs<NOW_MS){
      self.callback();
      self.lastMs += self.msList[self.msListIdx];
      self.msListIdx += 1;
      self.msListIdx %= self.freq;
    }
  };
};

return FreqCtrl;

})();
