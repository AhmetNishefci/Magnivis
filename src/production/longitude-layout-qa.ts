/** Runs only in explicitly requested QA stills, with the exact production fonts loaded. */
export const inspectLongitudeLayout = (frame:number) => {
 const labels=[...document.querySelectorAll<SVGTextElement>('[data-critical-label]')].filter(el=>{
  let node:Element|null=el;while(node){if(Number(node.getAttribute('opacity')??'1')===0)return false;node=node.parentElement;}return true;
 }).map(el=>{const r=el.getBoundingClientRect();return {text:el.textContent??'',x:r.x,y:r.y,width:r.width,height:r.height};});
 const caption=document.querySelector<HTMLElement>('[data-caption-id]');
 let captionMetrics:unknown=null;
 if(caption){const ctx=document.createElement('canvas').getContext('2d')!;const style=getComputedStyle(caption);ctx.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const lines=(caption.textContent??'').split('\n');captionMetrics={id:caption.dataset.captionId,maxLineWidth:Math.max(...lines.map(l=>ctx.measureText(l).width)),availableWidth:caption.clientWidth,lineCount:lines.length,textHeight:lines.length*Number.parseFloat(style.lineHeight),availableHeight:caption.clientHeight};}
 const overlap=labels.flatMap((a,i)=>labels.slice(i+1).filter(b=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y).map(b=>({a:a.text,b:b.text})));
 const canvasClipping=labels.filter(r=>r.x<0||r.y<0||r.x+r.width>1080||r.y+r.height>1920);
 return {frame,fontsLoaded:document.fonts.check('600 48px "Longitude Source Sans"')&&document.fonts.check('400 66px "Longitude Source Serif"'),labels,caption:captionMetrics,labelOverlaps:overlap,canvasClipping};
};
