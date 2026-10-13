import {useLayoutEffect,useRef} from 'react';
type Uniforms=Record<string,number|[number,number]|[number,number,number]>;
// Small deterministic raster surface; art/shader/camera remain owned by each story.
export const ShaderSurface=({fragment,uniforms,texture,onReady}:{fragment:string;uniforms:Uniforms;texture?:HTMLCanvasElement;onReady?:()=>void})=>{
 const canvas=useRef<HTMLCanvasElement>(null),state=useRef<{gl:WebGLRenderingContext;program:WebGLProgram}|null>(null);
 useLayoutEffect(()=>{
  const gl=canvas.current!.getContext('webgl',{preserveDrawingBuffer:true,alpha:false,antialias:false});if(!gl)throw new Error('WebGL rendering unavailable');
  const compile=(type:number,source:string)=>{const shader=gl.createShader(type)!;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader)??'Shader compilation failed');return shader;};
  const program=gl.createProgram()!;gl.attachShader(program,compile(gl.VERTEX_SHADER,'attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}'));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program)??'Shader link failed');gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const position=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  if(texture){const tex=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.uniform1i(gl.getUniformLocation(program,'map'),0);}
  state.current={gl,program};return()=>{gl.deleteProgram(program);gl.deleteBuffer(buffer);state.current=null;};
 },[fragment,texture]);
 useLayoutEffect(()=>{const s=state.current;if(!s)return;const {gl,program}=s;for(const [key,value]of Object.entries(uniforms)){const location=gl.getUniformLocation(program,key);if(typeof value==='number')gl.uniform1f(location,value);else if(value.length===2)gl.uniform2f(location,value[0],value[1]);else gl.uniform3f(location,value[0],value[1],value[2]);}gl.viewport(0,0,1080,1920);gl.drawArrays(gl.TRIANGLES,0,3);const error=gl.getError();if(error!==gl.NO_ERROR)throw new Error(`WebGL draw error ${error}`);onReady?.();},[uniforms,onReady]);
 return <canvas ref={canvas} width={1080} height={1920} style={{position:'absolute',width:1080,height:1920}}/>;
};
