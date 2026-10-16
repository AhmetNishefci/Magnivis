/** Actual rendered bounds, shared by caption/label and SVG production inspection. */
export type QaRect={x:number;y:number;width:number;height:number};
export type QaBound=QaRect&{kind:string;text:string;id?:string};
export const rectsOverlap=(a:QaRect,b:QaRect,tolerance=1)=>Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>tolerance&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>tolerance;
export const inspectRenderedBounds=(bounds:readonly QaBound[],safe:QaRect)=>{
 const failures:string[]=[];
 for(const b of bounds){if(![b.x,b.y,b.width,b.height].every(Number.isFinite)||b.width<=0||b.height<=0){failures.push('Invalid measured bounds: '+b.text);continue;}if(b.x<safe.x-.1||b.y<safe.y-.1||b.x+b.width>safe.x+safe.width+.1||b.y+b.height>safe.y+safe.height+.1)failures.push('Safe-region collision: '+b.text);}
 const text=bounds.filter(b=>['critical','label','disclosure','caption-midpoint'].includes(b.kind));
 for(let i=0;i<text.length;i++)for(let j=i+1;j<text.length;j++)if(rectsOverlap(text[i]!,text[j]!))failures.push('Text overlap: '+text[i]!.text+' / '+text[j]!.text);
 for(const c of bounds.filter(b=>b.kind==='caption-midpoint'))for(const v of bounds.filter(b=>b.kind==='critical-visual'))if(rectsOverlap(c,v))failures.push('Critical visual overlaps caption: '+v.text);
 return failures;
};
