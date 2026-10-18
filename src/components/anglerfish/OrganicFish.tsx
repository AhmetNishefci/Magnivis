import React from 'react';
import {staticFile} from 'remotion';
/** Frozen original raster reconstructions, rigged in source-image coordinates.
 * Native generated alpha is retained. Source-space fin partitions allow small
 * independent movements without tracing or using copyrighted reference pixels.
 * The source-space contact is a selected ventrolateral skin point, not a universal
 * attachment position. Image deformation is illustrative 2.5D, not specimen motion. */
export const organicContact={x:0,y:0} as const;
export const OrganicFemale:React.FC<{frame:number;opacity?:number}>=({frame,opacity=1})=>{
 const tail= Math.sin(frame*.045)*2.2,fin=Math.sin(frame*.056+.6)*1.6;
 const image=<image href={staticFile('visuals/anglerfish-fusion-v3/female-selected.png')} width={1536} height={1024}/>;
 return <g opacity={opacity} transform="scale(.625) translate(-440 -890)">
 <defs><clipPath id="organic-female-body"><rect x="0" y="0" width="1190" height="1024"/></clipPath><clipPath id="organic-female-tail"><path d="M1190 420Q1350 346 1536 315V752H1190Z"/></clipPath><clipPath id="organic-female-pectoral"><path d="M590 493Q707 453 848 451L855 660Q719 671 601 565Z"/></clipPath></defs>
 <g><g clipPath="url(#organic-female-body)">{image}</g></g>
 <g transform={`rotate(${tail} 1190 527)`}><g clipPath="url(#organic-female-tail)">{image}</g></g>
 <g transform={`rotate(${fin} 602 522)`}><g clipPath="url(#organic-female-pectoral)">{image}</g></g>
 </g>;
};
export const OrganicMale:React.FC<{frame:number;x?:number;y?:number;rotation?:number;size?:number;grip?:number;bounds?:boolean}>=({frame,x=0,y=0,rotation=90,size=1,grip=1,bounds=true})=>{
 // The male's anterior denticular tips reach the same origin as the tissue section.
 const tailSwing=Math.sin(frame*.11)*(1-grip)*3.5+Math.sin(frame*.037)*.6;
 return <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${.065*size}) translate(-53 -315)`}>
 <defs><filter id="male-keylight" colorInterpolationFilters="sRGB"><feComponentTransfer><feFuncR type="linear" slope="1.25"/><feFuncG type="linear" slope="1.25"/><feFuncB type="linear" slope="1.25"/></feComponentTransfer></filter><clipPath id="organic-male-body"><rect width="1785" height="724"/></clipPath><clipPath id="organic-male-tail"><rect x="1785" width="387" height="724"/></clipPath></defs>
 <g filter="url(#male-keylight)">
 <g clipPath="url(#organic-male-body)"><image href={staticFile('visuals/anglerfish-fusion-v3/male-original.png')} width={2172} height={724}/></g><g transform={`rotate(${tailSwing} 1785 370)`}><g clipPath="url(#organic-male-tail)"><image href={staticFile('visuals/anglerfish-fusion-v3/male-original.png')} width={2172} height={724}/></g></g>
 </g>
 {/* Jaw action is a restrained schematic articulation over the textured snout.
     Front hooks approach skin, then remain clamped. No instant tissue change. */}
 <g transform={`translate(53 315) rotate(${(1-grip)*-12})`}>
 <path d="M105 -54C38 -75 -7 -45 -1 -3Q4 8 24 -7" fill="none" stroke="#301f16" strokeWidth="17" strokeLinecap="round"/>
 <path d="M100 -56C38 -75 -7 -45 -1 -3Q4 8 24 -7" fill="none" stroke="#ae9872" strokeWidth="5" strokeLinecap="round"/>
 </g>
 <g transform={`translate(53 315) rotate(${(1-grip)*12})`}>
 <path d="M110 58C41 84 -7 46 0 2Q3 -8 23 8" fill="none" stroke="#2d201a" strokeWidth="15" strokeLinecap="round"/>
 <path d="M104 58C41 80 -7 46 0 2Q3 -8 23 8" fill="none" stroke="#b5a17e" strokeWidth="4" strokeLinecap="round"/>
 </g>
 <g opacity=".16" transform={`rotate(${tailSwing} 1790 370)`}><path d="M1790 370Q2014 320 2133 221M1790 370L2140 537" fill="none" stroke="#cad8ce" strokeWidth="3"/></g>
 {bounds&&<rect data-qabounds="critical-visual" aria-label="Recognizable textured male and clamped jaws" x="30" y="70" width="2120" height="520" fill="transparent"/>}
 </g>;
};
export const OrganicPair:React.FC<{frame:number;gap?:number;maleSize?:number;grip?:number;opacity?:number}>=({frame,gap=0,maleSize=1.5,grip=1,opacity=1})=><g opacity={opacity}><OrganicFemale frame={frame}/><OrganicMale frame={frame} y={gap} size={maleSize} grip={grip}/></g>;
