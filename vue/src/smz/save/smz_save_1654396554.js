import Cookies from 'js-cookie'

import * as smz_save_1654335253 from './save/smz_save_1654335253.js'

'use strict';

export const SmzSave1654396554 = (function(){

const AUTOSAVE_PREFIX = 'fc.autosave.v1654396554';
const AUTOSAVE_SLOT_COUNT = 3;

const SmzSave1654396554 = {};

class SmzSave1654396554Class {
  constructor(gameMain){
    const self=this;
    self.gameMain = gameMain;
    
    self.autoSaveFreqCtrl = new smz_freq_ctrl.SmzFreqCtrl(-60000,()=>{self.save();})
    
    self.lastSave = "";
  };
  
  saveAutoSave(){
    const self=this;
    var data = self.gameMain.export();
    data = JSON.stringify(data);
    console.log(`YGQKQJUN save data=${data}`);
    SmzSave1654396554.setAutoSave(data);
    self.lastSave = new Date();
  };
  
  loadAutoSave(){
    const self=this;
    while(true){
      var data = SmzSave1654396554.getAutoSave();
      if(data==null)break;
      try{
        data = JSON.parse(data);
        var importRet = self.gameMain.import(data);
        if(importRet)return true;
      }catch(err){
      }
      SmzSave1654396554.rmTopAutoSave();
    }
    return false;
  };
  
  tick(){
    const self=this;
    self.autoSaveFreqCtrl.tick();
  };

};
SmzSave1654396554.Class = SmzSave1654396554Class;

SmzSave1654396554.setAutoSave = function(data){
  var bestAutoSaveSlot = null;
  var bestAutoSaveTs   = null;
  for(var autoSaveSlot=0;autoSaveSlot<AUTOSAVE_SLOT_COUNT;++autoSaveSlot){
    var autoSaveTs = SmzSave1654396554.getTs(`${AUTOSAVE_PREFIX}.${autoSaveSlot}`);
    if(!autoSaveTs){
      bestAutoSaveSlot = autoSaveSlot;
      bestAutoSaveTs = autoSaveTs;
      break;
    }
    if((bestAutoSaveTs==null)||(autoSaveTs<bestAutoSaveTs)){
      bestAutoSaveSlot = autoSaveSlot;
      bestAutoSaveTs = autoSaveTs;
    }
  }
  assert(bestAutoSaveSlot!=null);

  const nowTs = Date.now();
  SmzSave1654396554.setData(`${AUTOSAVE_PREFIX}.${bestAutoSaveSlot}`, data);
  SmzSave1654396554.setTs(`${AUTOSAVE_PREFIX}.${bestAutoSaveSlot}`, nowTs);
};

SmzSave1654396554.getAutoSave = function(){
  while(true){
    var bestAutoSaveSlot = null;
    var bestAutoSaveTs   = null;
    for(var autoSaveSlot=0;autoSaveSlot<AUTOSAVE_SLOT_COUNT;++autoSaveSlot){
      var autoSaveTs = SmzSave1654396554.getTs(`${AUTOSAVE_PREFIX}.${autoSaveSlot}`);
      if(!autoSaveTs)continue;
      if((bestAutoSaveTs==null)||(autoSaveTs>bestAutoSaveTs)){
        bestAutoSaveSlot = autoSaveSlot;
        bestAutoSaveTs = autoSaveTs;
      }
    }
    if(bestAutoSaveSlot==null){
      break;
    }
    var bestAutoSaveData = SmzSave1654396554.getData(`${AUTOSAVE_PREFIX}.${autoSaveSlot}`);
    if(bestAutoSaveData==null)continue;
    return bestAutoSaveData;
  }
  
  return null; // TODO: load old ver save
};

SmzSave1654396554.setTs = function(prefix, ts){
  Cookies.set(`${prefix}.ts`, ts, { sameSite: 'strict', expires: 40000 });
};

SmzSave1654396554.getTs = function(prefix){
  try{
    var ts = Cookies.get(`${prefix}.ts`);
    if(!ts)return null;
    ts = parseInt(ts);
    return ts;
  }catch(e){
    SmzSave1654396554.rm(prefix);
    return null;
  }
};

SmzSave1654396554.setData = function(prefix, data){
  Cookies.set(`${prefix}.data`, JSON.stringify(data), { sameSite: 'strict', expires: 40000 });
};

SmzSave1654396554.getData = function(prefix){
  try{
    var data = Cookies.get(`${prefix}.data`);
    if(!data)return null;
    data = JSON.parse(data);
    return data;
  }catch(e){
    SmzSave1654396554.rm(prefix);
    return null;
  }
};

SmzSave1654396554.rm = function(prefix){
  Cookies.remove(`${prefix}.ts`, { sameSite: 'strict' });
  Cookies.remove(`${prefix}.data`, { sameSite: 'strict' });
};

return SmzSave1654396554;

})();
