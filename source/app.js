'use strict';
const game=document.querySelector('#game');
const route=[['promo','Промо события'],['event','Окно события'],['brief','Брифинг матч-3'],['victory','Победа в матч-3'],['stats','Статистика уровня'],['return','Возврат в событие'],['home','Завершение → домой']];
let current='promo',progress=false,infoReturn='event',introSeen=false;
const bounds={start:[41.5,78,17,13],promoClose:[72.3,8.5,3.8,6.5],play:[41,73,18,15],eventIcon:[76.5,51,12,26],briefClose:[65.5,9.5,3.5,6.5],info:[12.6,4.5,5.3,12],close:[92.7,2,4.7,10]};
function hotspot(action,label,rect){return `<button class="hotspot" data-action="${action}" aria-label="${label}" title="${label}" style="left:${rect[0]}%;top:${rect[1]}%;width:${rect[2]}%;height:${rect[3]}%"></button>`;}
function screenshot(number,alt){return `<img class="screen-image" src="${ART['screen-'+String(number).padStart(2,'0')]}" alt="${alt}" draggable="false">`;}
function sequence(name,label){return `<video class="screen-image" id="${name}-video" src="${ART[name]}" poster="${ART[name+'-poster']}" autoplay muted playsinline preload="auto" aria-label="${label}"></video>`;}
function continueButton(action,label='Tap to Continue'){return `<button class="continue" data-action="${action}" aria-label="Нажмите, чтобы продолжить">${label}</button>`;}
function setScreen(next){if(next==='event'&&!introSeen){introSeen=true;infoReturn='event';next='info';}current=next;render();}
function render(){
 let html='',index=route.findIndex(([name])=>name===current);
 switch(current){
  case 'promo':html=screenshot(2,'Промо события Lava Quest')+hotspot('start','Start',bounds.start)+hotspot('brief','Закрыть промо',bounds.promoClose);break;
  case 'group':html=screenshot(4,'Подобраны 100 игроков')+hotspot('group-ready','Нажмите, чтобы продолжить',[0,0,100,100]);index=0;break;
  case 'event':case 'return':{
   const isReturn=current==='return';
   html=(isReturn?sequence('post-win','Анимация события после победы: прыжки карточек, разлёт и лучи'):screenshot(5,'Окно события'))+hotspot('info','Информация о событии',bounds.info)+hotspot('home','Завершить событие и выйти домой',bounds.close)+(isReturn?hotspot('brief','Tap to Continue — следующий брифинг',[20,84,60,16]):continueButton('brief'));
   break;}
  case 'brief':html=screenshot(3,'Брифинг матч-3, уровень 66')+hotspot('play','Play — показать победу',bounds.play)+hotspot('event-icon','Открыть событие',bounds.eventIcon)+hotspot('back-event','Закрыть брифинг',bounds.briefClose);break;
  case 'info':html=`<img class="screen-image" src="${ART['info-original']}" alt="Информация о событии Lava Quest" draggable="false">`+hotspot('close-info','Нажмите в любом месте, чтобы закрыть информацию',[0,0,100,100]);index=infoReturn==='return'?5:1;break;
  case 'victory':html=sequence('victory','Победа в матч-3: Township и фейерверки')+hotspot('stats','Продолжить к статистике',[0,0,100,100]);break;
  case 'stats':html=sequence('stats','Статистика уровня: Well Done! и начисление прогресса')+hotspot('return','Нажмите, чтобы вернуться в событие',[0,0,100,100]);break;
  case 'home':html=`<img class="screen-image" src="${ART.town}" alt="Домашняя мета"><div class="end-card"><h1>Вы вернулись домой</h1><p>Событие завершено</p><button data-action="reset">Посмотреть ещё раз</button></div>`;break;
 }
 game.innerHTML=`<section class="screen ${current==='home'?'ending':''}" data-screen="${current}">${html}</section>`;
 const video=game.querySelector('video');if(video){video.muted=true;video.play().catch(()=>{});}
 document.querySelector('#flow-list').innerHTML=route.map(([name,title],i)=>`<li><button class="step ${i===index?'active':i<index?'done':''}" data-step="${name}" ${i===index?'aria-current="step"':''}><span class="step-number">${i<index?'✓':String(i+1).padStart(2,'0')}</span><span>${title}</span>${name==='return'?'<span class="loop-tag">↻</span>':''}</button></li>`).join('');
 if(current==='info')game.querySelector('[data-action="close-info"]').focus({preventScroll:true});
}
function act(action){switch(action){
 case 'reset':progress=false;introSeen=false;setScreen('promo');break;
 case 'start':setScreen('group');break;
 case 'group-ready':setScreen('event');break;
 case 'play':progress=true;setScreen('victory');break;
 case 'event-icon':case 'back-event':setScreen(progress?'return':'event');break;
 case 'info':infoReturn=current;setScreen('info');break;
 case 'close-info':setScreen(infoReturn);break;
 default:if(route.some(([name])=>name===action)){if(['return','stats','victory'].includes(action))progress=true;setScreen(action);}
}}
document.addEventListener('click',event=>{const step=event.target.closest('[data-step]');if(step){act(step.dataset.step);return;}const button=event.target.closest('[data-action]');if(button)act(button.dataset.action);});
document.addEventListener('keydown',event=>{if(event.code!=='Space'||['BUTTON','A','INPUT'].includes(document.activeElement.tagName))return;event.preventDefault();act(({promo:'start',group:'group-ready',event:'brief',brief:'play',victory:'stats',stats:'return',return:'brief',info:'close-info',home:'reset'})[current]);});
render();
