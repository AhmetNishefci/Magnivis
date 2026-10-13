import {useMemo} from 'react';
import land from '../data/devils-hole-land.json';
import {ShaderSurface} from '../graphics/ShaderSurface';
import {globeShader} from '../production/visuals/devils-hole-shaders';
export const globePoint=(longitude:number,latitude:number,centerLongitude:number,centerLatitude:number)=>{const r=Math.PI/180,d=(longitude-centerLongitude)*r,lt=latitude*r,c=centerLatitude*r;return {x:510+510*Math.sin(d)*Math.cos(lt),y:810-510*(Math.sin(lt)*Math.cos(c)-Math.cos(lt)*Math.cos(d)*Math.sin(c)),visible:Math.sin(lt)*Math.sin(c)+Math.cos(lt)*Math.cos(d)*Math.cos(c)>0};};
export const DevilsHoleGlobeV2=({time,longitude=200,latitude=40,energy=0}:{time:number;longitude?:number;latitude?:number;energy?:number})=>{
 const texture=useMemo(()=>{const c=document.createElement('canvas');c.width=2048;c.height=1024;const ctx=c.getContext('2d')!;ctx.fillStyle='#123F53';ctx.fillRect(0,0,2048,1024);ctx.fillStyle='#78866B';
  const features=land.features as unknown as {geometry:{type:string;coordinates:number[][][]|number[][][][]}}[];
  for(const feature of features){const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates as number[][][]]:feature.geometry.coordinates as number[][][][];for(const polygon of polygons){ctx.beginPath();for(const ring of polygon){ring.forEach((p,i)=>{const x=(p[0]!+180)/360*2048,y=(90-p[1]!)/180*1024;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.closePath();}ctx.fill('evenodd');}}
  return c;
 },[]);
 return <ShaderSurface fragment={globeShader} texture={texture} uniforms={{time,lon:longitude,lat:latitude,energy}}/>;
};
