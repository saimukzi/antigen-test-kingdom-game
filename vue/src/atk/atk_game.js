import * as smz_common from '../smz/smz_common.js'; const common=smz_common.SmzCommon;

'use strict';

export const FcGame = (function(){

class FcGame {
  constructor(fps){
    const self=this;
    self.FPS = fps;

    self.newGame();
  };
  tick(){
    const self=this;
    self.data.remain += self.data.autoClickerAddPoint;
    const add = Math.floor(self.data.remain/self.FPS);
    self.data.remain %= self.FPS;
    self.data.point += add;
  };
  click(){
    const self=this;
    self.data.point+=self.data.clickAddPoint;
  };
  upgradeClickOk(){
    const self=this;
    if(self.data.point<self.data.clickUpgradeMinusPoint)return false;
    return true;
  };
  upgradeClick(){
    const self=this;
    if(!self.upgradeClickOk())return;
    self.data.point-=self.data.clickUpgradeMinusPoint;
    self.data.clickAddPoint+=1;
    const oldCost = self.data.clickUpgradeMinusPoint;
    self.data.clickUpgradeMinusPoint += self.data.clickUpgradeMinusPointX;
    self.data.clickUpgradeMinusPointX = oldCost;
  };
  upgradeAutoClickerOk(){
    const self=this;
    if(self.data.point<self.data.autoClickerUpgradeMinusPoint)return false;
    return true;
  };
  upgradeAutoClicker(){
    const self=this;
    if(!self.upgradeAutoClickerOk())return;
    self.data.point-=self.data.autoClickerUpgradeMinusPoint;
    self.data.autoClickerAddPoint+=1;
    const oldCost = self.data.autoClickerUpgradeMinusPoint;
    self.data.autoClickerUpgradeMinusPoint += self.data.autoClickerUpgradeMinusPointX;
    self.data.autoClickerUpgradeMinusPointX = oldCost;
  };

  export(){
    return common.clone(this.data);
  };
  
  import(data){
    this.data = common.clone(data);
    return true;
  };
  
  newGame(){
    this.data = {
      point: 0,
      clickAddPoint: 1,
      clickUpgradeMinusPoint: 1,
      clickUpgradeMinusPointX: 1,
      autoClickerAddPoint: 0,
      autoClickerUpgradeMinusPoint: 1,
      autoClickerUpgradeMinusPointX: 1,
      remain: 0,
    };
  };
};

return FcGame;

})();
