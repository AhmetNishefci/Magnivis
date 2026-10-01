import {delayRender,continueRender,cancelRender,staticFile} from 'remotion';
let ready:Promise<void>|undefined;
export const loadLongitudeFonts=()=>{
 if(ready)return ready;
 const handle=delayRender('Load exact pinned Longitude fonts');
 ready=Promise.all([
  ['Longitude Source Serif','SourceSerif4-Regular.otf','400'],
  ['Longitude Source Sans','SourceSans3-Regular.otf','400'],
  ['Longitude Source Sans','SourceSans3-Semibold.otf','600'],
 ].map(async([family,file,weight])=>{const face=new FontFace(family!,`url(${staticFile(`fonts/longitude-clock/${file}`)})`,{weight:weight!});await face.load();document.fonts.add(face);})).then(()=>continueRender(handle)).catch(cancelRender);
 return ready;
};
