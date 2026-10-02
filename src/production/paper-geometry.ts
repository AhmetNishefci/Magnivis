/** Ideal A-series model, distinct from nominal integer-millimetre dimensions. */
export const paperRatio=Math.sqrt(2);
export const adjacentLengthScale=1/paperRatio;
export const idealSheet=(shortSide:number)=>({width:shortSide,height:shortSide*paperRatio});
export const rotatedHalf=(shortSide:number)=>({width:shortSide*paperRatio/2,height:shortSide});
export const nominalPaper={a3:{width:297,height:420},a4:{width:210,height:297},a5:{width:148,height:210}} as const;
