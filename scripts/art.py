"""Original procedural vector artwork. No third-party assets."""
from pathlib import Path
import random
P=Path(__file__).resolve().parents[1]/'public/art';P.mkdir(parents=True,exist_ok=True)
def scene(name,palette,kind):
 r=random.Random(42);a,b,c=palette
 stars=''.join(f'<circle cx="{r.randrange(1400)}" cy="{r.randrange(530)}" r="{r.choice([.7,1,1.4,2])}" fill="#e4e7ff" opacity="{r.uniform(.1,.65):.2f}"/>' for _ in range(180))
 common=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 760"><defs>
 <linearGradient id="sky" x2=".2" y2="1"><stop stop-color="#131a2a"/><stop offset=".6" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient>
 <linearGradient id="land" x1="0" y1="0" x2="1" y2="1"><stop stop-color="{b}"/><stop offset="1" stop-color="#182333"/></linearGradient>
 <linearGradient id="portal" x2=".7" y2="1"><stop stop-color="#b8ffdf"/><stop offset=".5" stop-color="#8ce3d7"/><stop offset="1" stop-color="#ad96f8"/></linearGradient>
 <radialGradient id="glow"><stop stop-color="{c}" stop-opacity=".3"/><stop offset="1" stop-color="{c}" stop-opacity="0"/></radialGradient>
 <radialGradient id="moon"><stop stop-color="#d9cbed"/><stop offset=".7" stop-color="#8c83af"/><stop offset="1" stop-color="#656585"/></radialGradient>
 <filter id="blur"><feGaussianBlur stdDeviation="10"/></filter></defs>
 <path fill="url(#sky)" d="M0 0h1400v760H0z"/>{stars}
 <ellipse cx="900" cy="365" rx="510" ry="370" fill="url(#glow)"/>
 <circle cx="1095" cy="145" r="75" fill="url(#moon)" opacity=".75"/>
 <ellipse cx="1095" cy="145" rx="123" ry="13" transform="rotate(-24 1095 145)" fill="none" stroke="#b7b1d0" stroke-opacity=".35" stroke-width="3"/>
 <path d="M0 448L100 411 160 430 245 335 290 365 359 309 465 398 550 329 700 405 805 325 947 400 1050 319 1150 367 1280 270 1400 315V760H0Z" fill="#3d415b" opacity=".55"/>
 <path d="M0 500L115 458 260 517 370 438 490 501 685 418 805 496 934 423 1045 484 1240 398 1400 445V760H0Z" fill="#29334a"/>
 <path d="M0 620L210 540 320 556 451 489 619 533 701 502 855 524 1010 463 1215 509 1400 477V760H0Z" fill="url(#land)"/>
 <path d="M619 533L701 502 855 524 1010 463 1215 509 1138 530 1005 494 865 550 709 527Z" fill="{c}" opacity=".2"/>
 <path d="M0 683L259 628 403 660 534 606 708 631 869 591 1048 665 1246 578 1400 624V760H0Z" fill="#111d2c"/>
 <path d="M720 760L780 670 867 606 909 548 1005 505 1016 509 936 560 897 620 822 682 792 760" fill="#86b9b1" opacity=".2"/>
 '''
 if kind in ['hero','rift']:
  common+='''<path d="M753 510l86-28 153 30-63 47-163-11z" fill="#71838c"/><path d="M766 548l163 11 63-47-38 105-84 55-77-51z" fill="#283546"/><path d="M766 548l104 124-8-107z" fill="#3e4d61"/><path d="M862 565l67-6 25 58-84 55z" fill="#202f42"/>
  <ellipse cx="867" cy="500" rx="60" ry="14" fill="#87ebd3" opacity=".22" filter="url(#blur)"/>
  <ellipse cx="863" cy="353" rx="100" ry="158" transform="rotate(13 863 353)" fill="#70dccb" opacity=".11" stroke="#91e8dc" stroke-width="22" filter="url(#blur)"/>
  <ellipse cx="863" cy="353" rx="100" ry="158" transform="rotate(13 863 353)" fill="#172c3e" fill-opacity=".66" stroke="#536575" stroke-width="23"/>
  <ellipse cx="863" cy="353" rx="94" ry="154" transform="rotate(13 863 353)" fill="none" stroke="url(#portal)" stroke-width="7"/>
  <ellipse cx="863" cy="353" rx="84" ry="142" transform="rotate(13 863 353)" fill="none" stroke="#99e7d6" stroke-width="1" opacity=".5"/>
  <path d="M812 419l38-84 55-77-28 112z" fill="#80cece" opacity=".06"/>
  <path d="M735 463l8-20 22 4-10 21zM1008 380l22-13 11 21-22 14zM796 148l18-15 16 13-14 22z" fill="#a5b1cb" opacity=".6"/>
  <path d="M950 503l3-22 8-4 6 10-2 19M956 486l-8 9M963 487l8 8" fill="#d8d7cb" stroke="#d8d7cb" stroke-width="3"/>
  <circle cx="959" cy="473" r="6" fill="#d9e4e0"/>
  '''
 if kind=='frontier':
  for x,y,scale in [(650,435,1.2),(950,460,.8),(1080,390,.6)]:
   common+=f'<g transform="translate({x} {y}) scale({scale})"><path d="M-80 30L0-6 88 27 0 62Z" fill="#8a8890"/><path d="M-80 30v56L0 123V62Z" fill="#344654"/><path d="M0 62l88-35v61L0 123Z" fill="#1c3544"/><path d="M-57 19L0-48 64 15 0 47Z" fill="#667c86"/><path d="M-20 11V-51L0-63 20-51V11L0 23Z" fill="#bdebd6"/><path d="M10 72l21-8v22l-21 9M46 58l20-7v23l-20 10" fill="#e8bc8d"/><path d="M-61 85v-32l26 12v34" fill="#9dcac9"/></g>'
  common+='<path d="M570 475L405 571 418 577 592 480M1038 480l184 95" fill="none" stroke="#b2d0c6" opacity=".4" stroke-width="3"/>'
 if kind=='bastion':
  common+='<g transform="translate(715 170) rotate(30) skewX(-25)">'
  for y in range(5):
   for x in range(6):
    common+=f'<rect x="{x*78}" y="{y*78}" width="72" height="72" rx="3" fill="{["#446576","#496e79","#607e85"][(x+y)%3]}" stroke="#aec9ba" stroke-opacity=".18"/>'
  for x,y in [(0,3),(4,0),(5,3),(2,1)]:
   common+=f'<rect x="{x*78+12}" y="{y*78+12}" width="47" height="47" fill="{"#c98b91" if x>2 else "#ace7c8"}"/><rect x="{x*78+18}" y="{y*78+20}" width="35" height="8" fill="#263e4e"/>'
  common+='</g>'
 if kind=='signal':
  common+='<g transform="translate(670 180) rotate(-8)">'
  points=[(0,0),(95,0),(190,0),(190,95),(95,95),(95,190),(190,190),(285,190),(285,95),(380,95),(380,190),(380,285),(285,285),(190,285),(95,285),(0,285),(0,190),(0,95)]
  common+='<polyline points="'+' '.join(f'{x},{y}' for x,y in points)+'" fill="none" stroke="#29464d" stroke-width="30"/><polyline points="'+' '.join(f'{x},{y}' for x,y in points)+'" fill="none" stroke="#93e3c7" stroke-width="7"/>'
  for x,y in points:common+=f'<circle cx="{x}" cy="{y}" r="18" fill="#315552" stroke="#8bddba" stroke-width="2"/><circle cx="{x}" cy="{y}" r="7" fill="#b8ffdc"/>'
  common+='</g>'
 common+='<path d="M0 730L134 672 192 706 253 691 329 752H0M1150 760l126-103 38 28 86-29v104" fill="#0d1724"/></svg>'
 (P/f'{name}.svg').write_text(common)
for name,palette,kind in [('universe',('#33334e','#4a586b','#90ead7'),'hero'),('rift',('#343049','#555177','#b098e7'),'rift'),('bastion',('#333545','#555564','#e9c28d'),'bastion'),('signal',('#243b40','#426e68','#92e3b9'),'signal'),('frontier',('#46384b','#796477','#e9a4be'),'frontier')]:scene(name,palette,kind)
