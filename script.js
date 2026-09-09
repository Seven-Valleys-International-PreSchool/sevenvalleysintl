// Seven Valleys International Preschool — homepage interactions
const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('.dot')];
let current = 0;
let heroTimer;

function showSlide(index){
  current = (index + slides.length) % slides.length;
  slides.forEach((slide,i)=>slide.classList.toggle('active',i===current));
  dots.forEach((dot,i)=>dot.classList.toggle('active',i===current));
}
function restartHeroTimer(){
  clearInterval(heroTimer);
  heroTimer = setInterval(()=>showSlide(current+1), 6000);
}
document.querySelector('.next').addEventListener('click',()=>{showSlide(current+1);restartHeroTimer()});
document.querySelector('.prev').addEventListener('click',()=>{showSlide(current-1);restartHeroTimer()});
dots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);restartHeroTimer()}));
restartHeroTimer();

// Mobile app-style left drawer
const drawer = document.getElementById('mobileDrawer');
const backdrop = document.querySelector('.drawer-backdrop');
const menuBtn = document.querySelector('.menu-btn');
const closeBtn = document.querySelector('.drawer-close');
function setDrawer(open){
  drawer.classList.toggle('open',open);
  backdrop.classList.toggle('open',open);
  drawer.setAttribute('aria-hidden',String(!open));
  menuBtn.setAttribute('aria-expanded',String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}
menuBtn.addEventListener('click',()=>setDrawer(true));
closeBtn.addEventListener('click',()=>setDrawer(false));
backdrop.addEventListener('click',()=>setDrawer(false));
drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setDrawer(false)));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setDrawer(false)});

// Teacher carousel
const teacherTrack = document.getElementById('teacherTrack');
const teachers = [...teacherTrack.children];
let teacherIndex = 0;
function visibleTeachers(){ return window.innerWidth <= 620 ? 1 : window.innerWidth <= 900 ? 2 : 3; }
function moveTeachers(){
  const visible = visibleTeachers();
  const max = Math.max(0, teachers.length-visible);
  teacherIndex = Math.min(Math.max(teacherIndex,0),max);
  const gap = 20;
  const cardWidth = teachers[0].getBoundingClientRect().width + gap;
  teacherTrack.style.transform = `translateX(-${teacherIndex*cardWidth}px)`;
}
document.getElementById('teacherNext').addEventListener('click',()=>{teacherIndex++;moveTeachers()});
document.getElementById('teacherPrev').addEventListener('click',()=>{teacherIndex--;moveTeachers()});
window.addEventListener('resize',moveTeachers);
moveTeachers();

// WhatsApp enquiry form
// Replace this demo number with the school's WhatsApp number, digits only, including country code.
const WHATSAPP_NUMBER = '919999999999';
document.getElementById('whatsappForm').addEventListener('submit', e=>{
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const message = [
    'Hello Seven Valleys International Preschool! 🌈',
    '',
    `Name: ${data.get('name')}`,
    `Mobile: ${data.get('mobile')}`,
    `Email: ${data.get('email') || 'Not provided'}`,
    `Message: ${data.get('message')}`
  ].join('\n');
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,'_blank','noopener');
});

// Active nav based on scroll
const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href') === '#'+entry.target.id));
    }
  });
},{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>observer.observe(s));


// Activities tabs: each tab controls its own content panel.
const activityTabs = [...document.querySelectorAll('.activity-tab')];
const activityPanels = [...document.querySelectorAll('.activity-panel')];

function activateActivity(name, moveTabIntoView = false){
  activityTabs.forEach(tab=>{
    const active = tab.dataset.activity === name;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  activityPanels.forEach(panel=>{
    const active = panel.id === `panel-${name}`;
    panel.hidden = !active;
    panel.classList.toggle('active', active);
  });
  if(moveTabIntoView){
    const tab = document.querySelector(`[data-activity="${name}"]`);
    tab?.scrollIntoView({behavior:'smooth', block:'nearest', inline:'center'});
  }
}

activityTabs.forEach((tab, index)=>{
  tab.addEventListener('click', ()=>activateActivity(tab.dataset.activity, true));
  tab.addEventListener('keydown', e=>{
    if(e.key !== 'ArrowRight' && e.key !== 'ArrowLeft' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    let next = index;
    if(e.key === 'ArrowRight') next = (index + 1) % activityTabs.length;
    if(e.key === 'ArrowLeft') next = (index - 1 + activityTabs.length) % activityTabs.length;
    if(e.key === 'Home') next = 0;
    if(e.key === 'End') next = activityTabs.length - 1;
    const target = activityTabs[next];
    activateActivity(target.dataset.activity, true);
    target.focus();
  });
});
