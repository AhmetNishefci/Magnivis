import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {create} from 'fontkit';
import {millenniumBridgeApprovedContentAsset as asset} from '../../content-assets/assets/millennium-bridge-approved';
import {millenniumBridgeClaimIds as c} from '../../knowledge/packages/millennium-bridge';

export const bridgeDesignSize = {width: 1080, height: 1920} as const;
export const bridgeDisclosure = ['SIMPLIFIED EXPLANATORY MODEL', 'MOTION EXAGGERATED'] as const;
export const bridgeDesignThesis = 'More physical, more cinematic, more human; one believable structural world with filled pedestrians, depth, contact-driven causality and restrained mechanism traces.';
const require = createRequire(import.meta.url);
export const bridgeFontPath = require.resolve('@fontsource/manrope/files/manrope-latin-500-normal.woff2');
const font = create(readFileSync(bridgeFontPath));
if (!('layout' in font)) throw new Error('Expected a single Manrope font');

// Glyph outlines keep disclosure typography independent of system fonts.
export const outlinedText = (text: string, x: number, baseline: number, size: number, color = '#d2dee6') => {
  if (!('layout' in font)) throw new Error('Expected a single font');
  const run = font.layout(text);
  const scale = size / font.unitsPerEm;
  let cursor = 0;
  const paths = run.glyphs.map((glyph, index) => {
    const position = run.positions[index]!;
    const path = `<path transform="translate(${(cursor + position.xOffset) * scale + x} ${baseline - position.yOffset * scale}) scale(${scale} ${-scale})" d="${glyph.path.toSVG()}"/>`;
    cursor += position.xAdvance;
    return path;
  }).join('');
  return `<g fill="${color}" aria-label="${text.replaceAll('&', '&amp;').replaceAll('"', '&quot;')}">${paths}</g>`;
};

export type CriticalRegion = {id: string; x: number; y: number; width: number; height: number; meaning: string};
export type BridgeDesignFrame = {
  id: string; title: string; beatSuffixes: string[]; claimIds: string[]; explanation: string;
  camera: 'opening' | 'close' | 'crowd' | 'oblique' | 'damping';
  criticalRegions: CriticalRegion[];
};
const disclosureRegion: CriticalRegion = {id: 'disclosure', x: 108, y: 280, width: 690, height: 90, meaning: 'Two-line model disclosure, separate from captions.'};
export const bridgeDesignFrames: readonly BridgeDesignFrame[] = [
  {id: '01-balance-paradox', title: 'The bridge moves. The body responds.', camera: 'opening', beatSuffixes: ['balance-paradox', 'opening-day'], claimIds: [c.lateral, c.footPlacement, c.negativeDamping], explanation: 'A substantial foreground walker leans and widens a step on a laterally displaced deck. Receding rails and riverbanks establish a physical place immediately.', criticalRegions: [disclosureRegion, {id: 'human-contact', x: 180, y: 660, width: 620, height: 835, meaning: 'Foreground body, corrective shoes and deck contact.'}]},
  {id: '02-foot-placement', title: 'Balance becomes a lateral step.', camera: 'close', beatSuffixes: ['corrective-steps'], claimIds: [c.footPlacement], explanation: 'Closer body-to-foot framing makes the corrective lateral placement legible. A small warm contact pulse sits on the deck, with a faint previous-position shoe witness.', criticalRegions: [disclosureRegion, {id: 'body-foot-contact', x: 200, y: 445, width: 615, height: 1070, meaning: 'Shaded posture, lateral corrective foot and contact pulse.'}]},
  {id: '03-crowd-feedback', title: 'Many corrections. One moving structure.', camera: 'crowd', beatSuffixes: ['crowd-feedback'], claimIds: [c.negativeDamping, c.growth, c.withoutSynchrony], explanation: 'Varied body sizes and gait phases recede into the same bridge. Staggered contact pulses and bounded edge-position witnesses indicate collective response without unanimous marching.', criticalRegions: [disclosureRegion, {id: 'crowd-response', x: 140, y: 760, width: 695, height: 720, meaning: 'Varied crowd, staggered contacts and bounded structural response.'}]},
  {id: '04-coherence-uncertainty', title: 'Coordination can change the response.', camera: 'oblique', beatSuffixes: ['coherence-qualification'], claimIds: [c.withoutSynchrony, c.laterCoherence, c.dayUncertainty], explanation: 'An oblique bridge remains active. One small local pair has closer phases while the surrounding walkers differ; this is an illustrative possibility, not reconstructed opening-day evidence.', criticalRegions: [disclosureRegion, {id: 'local-coherence', x: 160, y: 810, width: 675, height: 650, meaning: 'Local pair within varied surrounding phases and active lateral response.'}]},
  {id: '05-damping-payoff', title: 'The structure sheds energy.', camera: 'damping', beatSuffixes: ['energy-out'], claimIds: [c.dampingRetrofit, c.damperSystems], explanation: 'The same bridge vocabulary shifts to an underside-aware oblique view. Integrated viscous-damper abstractions connect deck and bracing; warm dissipative accents and tight, nonzero position witnesses suggest controlled response.', criticalRegions: [disclosureRegion, {id: 'damping-response', x: 130, y: 800, width: 710, height: 720, meaning: 'Integrated bracing/dampers, walkers and residual response witnesses.'}]},
];

export const bridgeFrameBeatIds = (frame: BridgeDesignFrame) => frame.beatSuffixes.map((suffix) => {
  const beat = asset.narrativeStructure.find(({id}) => id.endsWith(`.beat.${suffix}`));
  if (!beat) throw new Error(`Unknown approved beat: ${suffix}`);
  return beat.id;
});

const fixed = (value: number) => Number(value.toFixed(2));
const pedestrian = (x: number, y: number, scale: number, phase: number, lean: number, tone: string, contact: boolean) => {
  const left = fixed(-38 + phase * 23);
  const right = fixed(40 - phase * 26);
  const liftLeft = fixed(Math.max(0, phase) * 20);
  const liftRight = fixed(Math.max(0, -phase) * 22);
  const corrective = Math.abs(lean) > 6;
  const coat = `url(#coat-${tone.slice(1)})`;
  const contactX = phase > 0 ? right : left;
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <ellipse cx="2" cy="9" rx="67" ry="14" fill="#02070b" opacity=".52"/>
    ${contact ? `<ellipse cx="${contactX}" cy="2" rx="38" ry="9" fill="#dcaa69" opacity=".14"/><ellipse cx="${contactX}" cy="2" rx="24" ry="5" fill="none" stroke="#edc791" stroke-width="1.5" opacity=".8"/>` : ''}
    <path d="M-24-174 Q-26-110 ${left - 8}-58 L${left - 14} ${-12-liftLeft} Q${left - 5} ${-3-liftLeft} ${left + 9} ${-12-liftLeft} L${left + 14}-65 L5-156Z" fill="#142733"/>
    <path d="M10-175 Q38-119 ${right + 3}-76 L${right + 12} ${-15-liftRight} Q${right + 5} ${-3-liftRight} ${right - 9} ${-13-liftRight} L${right - 18}-70 L-11-158Z" fill="#253b47"/>
    <path transform="translate(0 ${-liftLeft})" d="M${left - 15}-15 L${left + 10}-14 L${left + 24}-3 Q${left + 23} 4 ${left - 18} 2Z" fill="#bec3bd"/>
    <path transform="translate(0 ${-liftRight})" d="M${right - 12}-15 L${right + 12}-16 L${right + 26}-4 Q${right + 27} 4 ${right - 14} 2Z" fill="#849997"/>
    <g transform="rotate(${lean} 0 -169)">
      <path d="M-33-290 Q-46-276-45-239 L-49-173 Q-8-144 43-174 L37-256 Q33-288 19-297Z" fill="${coat}"/>
      <path d="M-30-287 Q-41-261-37-221 L-37-177 L-13-166 L-8-289Z" fill="#7a99a4" opacity=".12"/>
      ${corrective ? `<path d="M12-296 Q43-294 51-265 L${68 + phase * 16}-222 L${88 + phase * 12}-229 Q101-228 99-218 L${72 + phase * 16}-208 Q57-207 46-231 L27-270Z" fill="${coat}"/>
      <path d="M-31-287 Q-57-285-65-258 L${-91 - phase * 10}-217 L-124-230 Q-135-228-133-220 L-99-201 Q-88-198-76-215 L-43-260Z" fill="${coat}"/>` : `<path d="M20-294 Q49-288 51-260 L${54+phase*12}-203 L${65+phase*14}-130 Q59-119 48-131 L${32+phase*10}-206 L14-259Z" fill="${coat}"/><path d="M-29-289 Q-54-287-55-258 L${-62-phase*8}-192 L${-48-phase*14}-117 Q-37-112-35-124 L${-43-phase*8}-194 L-20-258Z" fill="${coat}"/>`}
      <path d="M-12-308 L-13-292 Q5-280 18-295 L15-318Z" fill="#3c505d"/>
      <ellipse cx="0" cy="-329" rx="25" ry="31" fill="url(#head)"/>
      <path d="M-25-329 Q-31-367 6-364 Q28-362 27-338 Q9-346-13-341 L-19-313Z" fill="#101e27"/>
      <path d="M-21-287 Q-1-274 22-290" fill="none" stroke="#a8bec5" stroke-width="2" opacity=".48"/>
      <path d="M-3-280 L-2-176" stroke="#111f29" stroke-width="2" opacity=".42"/>
    </g>
  </g>`;
};

const environment = () => {
  const skyline = Array.from({length: 24}, (_, i) => {
    const x = i * 51 - 30;
    const top = 647 + ((i * 37) % 85);
    return `<rect x="${x}" y="${top}" width="${34 + i % 13}" height="${800 - top}" fill="${i % 2 ? '#23323a' : '#1a2b34'}"/>`;
  }).join('');
  const reflections = Array.from({length: 22}, (_, i) => `<path d="M${(i * 139) % 920} ${850 + i * 41} h${32 + (i * 53) % 180}" stroke="#afc3c5" stroke-width="${i % 3 + 1}" opacity="${.035 + i % 4 * .009}"/>`).join('');
  return `<rect width="1080" height="1920" fill="url(#sky)"/>
    <ellipse cx="690" cy="580" rx="510" ry="245" fill="url(#horizon)"/>
    <g opacity=".65">${skyline}<path d="M660 715V661H676V635Q680 596 710 584Q742 596 746 635V661H761V715Z" fill="#425057"/><path d="M707 582V567H713V582" stroke="#667779" stroke-width="4"/></g>
    <rect y="775" width="1080" height="1145" fill="url(#water)"/>${reflections}
    <path d="M0 778Q260 806 480 782T1080 773" fill="none" stroke="#99b1b9" opacity=".2" stroke-width="3"/>
    <path d="M0 830L335 794L220 830L0 888Z M1080 835L863 789L946 838L1080 870Z" fill="#0d1b25"/>
    <ellipse cx="570" cy="802" rx="700" ry="80" fill="url(#haze)"/>
  `;
};

const deck = (oblique: boolean, amplitude: number, damping: boolean) => {
  const vp = oblique ? {x: 760, y: 740} : {x: 590, y: 760};
  const left = oblique ? -280 : -580;
  const right = oblique ? 1940 : 1780;
  const farLeft = vp.x - 48;
  const farRight = vp.x + 48;
  const bottom = 1920;
  const edgePoint = (t: number, side: 'left' | 'right') => ({
    x: fixed((side === 'left' ? farLeft : farRight) + ((side === 'left' ? left : right) - (side === 'left' ? farLeft : farRight)) * t),
    y: fixed(vp.y + (bottom - vp.y) * t),
  });
  const seams = Array.from({length: 15}, (_, i) => {
    const t = Math.pow((i + 1) / 16, 1.75);
    const a = edgePoint(t, 'left'); const b = edgePoint(t, 'right');
    return `<path d="M${a.x} ${a.y}L${b.x} ${b.y}" stroke="#849b9f" stroke-width="${fixed(.4 + t * 1.6)}" opacity=".18"/>`;
  }).join('');
  const railing = (side: 'left' | 'right') => {
    const near = edgePoint(1, side); const far = edgePoint(0, side);
    const posts = Array.from({length: 15}, (_, i) => {
      const t = Math.pow((i + 1) / 16, 1.65); const p = edgePoint(t, side);
      return `<path d="M${p.x} ${p.y}v${fixed(-12 - t * 185)}" stroke="#68838d" stroke-width="${fixed(1 + t * 6)}" opacity=".7"/>`;
    }).join('');
    return `<g>${posts}<path d="M${far.x} ${far.y - 12}L${near.x} ${near.y - 197}" stroke="#a4b9bc" stroke-width="7" opacity=".7"/><path d="M${far.x} ${far.y - 6}L${near.x} ${near.y - 91}" stroke="#53707c" stroke-width="3" opacity=".7"/></g>`;
  };
  // Position witnesses are physical edge traces, not force arrows or measured waveforms.
  const witness = [-1, 1].map((sign) => `<path d="M${farLeft + amplitude * sign * .15} ${vp.y}Q${320 + amplitude * sign} 1050 ${-80 + amplitude * sign} 1430" fill="none" stroke="${sign < 0 ? '#74a8b3' : '#d9af77'}" stroke-width="4" opacity="${damping ? .36 : .62}"/>`).join('');
  const underside = damping ? `<path d="M455 1053L163 1399L169 1430L462 1080Z" fill="#142b35" stroke="#86a1a9" stroke-width="3"/>
    <path d="M384 1150L284 1440L237 1310 M451 1070L389 1286L343 1205" fill="none" stroke="#526e7b" stroke-width="9"/>
    ${[[292, 1356, -58], [402, 1219, -58]].map(([x, y, rotation]) => `<g transform="translate(${x} ${y}) rotate(${rotation})"><path d="M-58 0H62" stroke="#a3b3b2" stroke-width="7"/><rect x="-31" y="-12" width="52" height="24" rx="5" fill="url(#damper)" stroke="#c0c9c1" stroke-width="1.5"/><path d="M-23-7H14" stroke="#e1be85" stroke-width="2"/><ellipse cx="-4" cy="0" rx="41" ry="23" fill="url(#dissipation)" opacity=".48"/></g>`).join('')}` : '';
  return `<path d="M${farLeft} ${vp.y}L${farRight} ${vp.y}L${right} ${bottom}L${left} ${bottom}Z" fill="url(#deck)"/>
    ${seams}<path d="M${farLeft} ${vp.y}L${left} ${bottom}" stroke="#aac2c4" stroke-width="4" opacity=".65"/>
    <path d="M${farRight} ${vp.y}L${right} ${bottom}" stroke="#8dabb6" stroke-width="4" opacity=".7"/>
    ${witness}${railing('left')}${railing('right')}
    ${damping ? underside : ''}`;
};

const crowd = (oblique: boolean) => {
  const phases = [-.82, .43, -.16, .93, -.56, .18, .71, -.91, .37, -.35, .62, .58, -.72, .06];
  return phases.map((phase, index) => {
    const depth = index / (phases.length - 1);
    const y = fixed(830 + depth * 588);
    const scale = fixed(.14 + depth * .91);
    const lane = index % 3 - 1;
    const x = fixed((oblique ? 680 - depth * 300 : 580 - depth * 80) + lane * (28 + depth * 148));
    return pedestrian(x, y, scale, phase, (index % 5 - 2) * 2.6, ['#354f5a', '#52616a', '#3c4d5f', '#685c53'][index % 4]!, index % 3 !== 0);
  }).join('');
};

export const renderBridgeDesignSvg = (frame: BridgeDesignFrame) => {
  const oblique = frame.camera === 'oblique' || frame.camera === 'damping';
  const amplitude = frame.camera === 'damping' ? 7 : frame.camera === 'crowd' ? 49 : 31;
  let people: string;
  if (frame.camera === 'opening') people = `<path d="M415 1398l27-3 25 15-53 2Z" fill="none" stroke="#8fb5bf" stroke-width="2" opacity=".38"/>` + pedestrian(611, 984, .42, -.65, 5, '#344753', false) + pedestrian(471, 1403, 1.94, -.85, -9, '#405b68', true);
  else if (frame.camera === 'close') people = `<path d="M292 1490h82" stroke="#8bb6c1" stroke-width="3" opacity=".38"/>` + pedestrian(493, 1459, 2.65, -.97, -7, '#405b68', true);
  else if (frame.camera === 'damping') people = pedestrian(624, 992, .4, .39, 2, '#52616a', false) + pedestrian(404, 1175, .84, -.62, -1, '#405b68', true);
  else people = crowd(oblique);
  const pulse = frame.camera === 'close' ? `<ellipse cx="333" cy="1464" rx="82" ry="21" fill="none" stroke="#e6c28e" stroke-width="2" opacity=".7"/><path d="M287 1431Q330 1420 360 1433" fill="none" stroke="#8ab4be" stroke-width="2" opacity=".4"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
    <title>${frame.title}</title><desc>Reconstructed design-review illustration; not documentary imagery. ${frame.explanation}</desc>
    <defs>
      <linearGradient id="head" x2="1" y2=".3"><stop stop-color="#566b78"/><stop offset=".55" stop-color="#3b4f5d"/><stop offset="1" stop-color="#1d2e3a"/></linearGradient>
      ${['#405b68','#344753','#354f5a','#52616a','#3c4d5f','#685c53'].map((tone) => `<linearGradient id="coat-${tone.slice(1)}" x2="1" y2=".15"><stop stop-color="${tone}"/><stop offset=".38" stop-color="${tone}"/><stop offset="1" stop-color="#172b36"/></linearGradient>`).join('')}

      <linearGradient id="sky" x2="0" y2="1"><stop stop-color="#07111f"/><stop offset=".58" stop-color="#243b48"/><stop offset="1" stop-color="#101e29"/></linearGradient>
      <radialGradient id="horizon"><stop stop-color="#a4a79d" stop-opacity=".28"/><stop offset="1" stop-color="#809aa5" stop-opacity="0"/></radialGradient>
      <linearGradient id="water" x2=".4" y2="1"><stop stop-color="#263d49"/><stop offset=".6" stop-color="#102631"/><stop offset="1" stop-color="#08141f"/></linearGradient>
      <radialGradient id="haze"><stop stop-color="#b6cad0" stop-opacity=".12"/><stop offset="1" stop-color="#a2c1cc" stop-opacity="0"/></radialGradient>
      <linearGradient id="deck" x2=".75" y2="1"><stop stop-color="#53656a"/><stop offset=".28" stop-color="#374d57"/><stop offset=".65" stop-color="#2a414b"/><stop offset="1" stop-color="#102732"/></linearGradient>
      <linearGradient id="damper" x2="0" y2="1"><stop stop-color="#a3b6b7"/><stop offset=".42" stop-color="#405b64"/><stop offset="1" stop-color="#142e3a"/></linearGradient>
      <radialGradient id="dissipation"><stop stop-color="#f7ba67" stop-opacity=".65"/><stop offset="1" stop-color="#d39b55" stop-opacity="0"/></radialGradient>
      <radialGradient id="vignette"><stop offset=".38" stop-color="#030b13" stop-opacity="0"/><stop offset="1" stop-color="#020810" stop-opacity=".7"/></radialGradient>
    </defs>
    ${environment()}${deck(oblique, amplitude, frame.camera === 'damping')}${people}${pulse}
    <rect width="1080" height="1920" fill="url(#vignette)"/>
    <rect x="92" y="271" width="724" height="99" rx="4" fill="#06121e" opacity=".82"/>
    ${outlinedText(bridgeDisclosure[0], 111, 310, 27)}${outlinedText(bridgeDisclosure[1], 111, 349, 27, '#acbdc7')}
  </svg>\n`.replace(/[ \t]+$/gm, '');
};
