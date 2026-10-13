export const faces={yellow:[3,3,3,3,3,3],blue:[4,4,4,4,0,0],green:[1,1,1,5,5,5],orange:[2,2,2,2,6,6]} as const;
export type DieId=keyof typeof faces;
export const ids:DieId[]=['yellow','blue','green','orange'];
// Permanent physical planes: +X,-X,+Y,-Y,+Z,-Z. No standard-die opposite-face rule.
export const topology={yellow:[3,3,3,3,3,3],blue:[4,0,4,0,4,4],green:[1,1,5,1,5,5],orange:[2,6,2,2,6,2]} as const;
export const colors={yellow:'#E8BE40',blue:'#4698DA',green:'#80B878',orange:'#EF9453'} as const;
export const counterChoice:DieId[]=['yellow','blue','green','orange','yellow'];
export const enumerate=(winner:DieId,opponent:DieId)=>faces[winner].flatMap((a,i)=>faces[opponent].map((b,j)=>({winnerFace:i,opponentFace:j,a,b,win:a>b,tie:a===b})));
export const branches={green:{winner:'green',opponent:'blue',firstValue:5,secondValue:1},orange:{winner:'orange',opponent:'green',firstValue:6,secondValue:2}} as const;
