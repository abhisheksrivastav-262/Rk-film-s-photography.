// RK Films — shared interactions
(function(){
  // Loader
  window.addEventListener('load',()=>setTimeout(()=>document.getElementById('loader')?.classList.add('done'),600));
  setTimeout(()=>document.getElementById('loader')?.classList.add('done'),3500); // fallback

  // Navbar scroll + hamburger + progress
  const nav=document.getElementById('navbar'), prog=document.getElementById('progress');
  const onScroll=()=>{
    const y=window.scrollY;
    nav?.classList.toggle('scrolled',y>40);
    const h=document.documentElement.scrollHeight-innerHeight;
    if(prog) prog.style.width=(h>0?(y/h*100):0)+'%';
    // parallax
    document.querySelectorAll('.parallax').forEach(el=>{
      const r=el.getBoundingClientRect();
      const off=(r.top+r.height/2-innerHeight/2)*-.06;
      el.style.transform=`translateY(${off.toFixed(1)}px)`;
    });
  };
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // Mobile half side-drawer + backdrop (backdrop created here so all pages get it)
  const navLinks=document.getElementById('navLinks'), burger=document.getElementById('hamburger');
  let backdrop=document.querySelector('.nav-backdrop');
  if(navLinks && !backdrop){
    backdrop=document.createElement('div');
    backdrop.className='nav-backdrop';
    document.body.appendChild(backdrop);
  }
  const setMenu=open=>{
    if(open&&nav&&navLinks){navLinks.style.top=nav.offsetHeight+'px';} // drawer opens exactly below header
    navLinks?.classList.toggle('open',open);
    backdrop?.classList.toggle('show',open);
    if(burger) burger.textContent=open?'✕':'☰';
    document.body.style.overflow=open?'hidden':'';
  };
  burger?.addEventListener('click',e=>{
    e.stopPropagation();
    setMenu(!navLinks?.classList.contains('open'));
  });
  backdrop?.addEventListener('click',()=>setMenu(false));
  // Auto-close sidebar if screen becomes desktop-size (fixes stuck scroll-lock)
  addEventListener('resize',()=>{if(innerWidth>1000){setMenu(false);}else if(navLinks?.classList.contains('open')&&nav){navLinks.style.top=nav.offsetHeight+'px';}});

  // "Next page" gold button inside the mobile sidebar (auto per page)
  const pageOrder=['index.html','about.html','wedding.html','prewedding.html','gallery.html','films.html','services.html','pricing.html','testimonials.html','contact.html'];
  const pageNames={'index.html':'Home','about.html':'About','wedding.html':'Wedding','prewedding.html':'Pre Wedding','gallery.html':'Gallery','films.html':'Films','services.html':'Services','pricing.html':'Pricing','testimonials.html':'Reviews','contact.html':'Contact'};
  const curPage=location.pathname.split('/').pop()||'index.html';
  const curIdx=pageOrder.indexOf(curPage);
  if(navLinks && curIdx>-1 && !navLinks.querySelector('.drawer-next')){
    const nxtPage=pageOrder[(curIdx+1)%pageOrder.length];
    const nxtBtn=document.createElement('a');
    nxtBtn.href=nxtPage; nxtBtn.className='drawer-next';
    nxtBtn.textContent='Next → '+pageNames[nxtPage];
    nxtBtn.addEventListener('click',()=>setMenu(false));
    const scroller=document.createElement('div');
    scroller.className='drawer-scroll';
    while(navLinks.firstChild){scroller.appendChild(navLinks.firstChild);}
    navLinks.appendChild(scroller);
    navLinks.appendChild(nxtBtn);
  }
  document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  addEventListener('keydown',e=>{if(e.key==='Escape') setMenu(false);});

  // Cursor glow
  const glow=document.getElementById('cursorGlow');
  if(glow && matchMedia('(pointer:fine)').matches){
    addEventListener('mousemove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';},{passive:true});
  } else if(glow){ glow.style.display='none'; }

  // Reveal on scroll
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Counters
  const cio=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting) return; cio.unobserve(e.target);
    const el=e.target, end=parseFloat(el.dataset.count||'0'), suf=el.dataset.suffix||'';
    const t0=performance.now(), dur=1800;
    (function tick(t){const p=Math.min((t-t0)/dur,1), ease=1-Math.pow(1-p,3);
      el.textContent=Math.round(end*ease)+suf; if(p<1) requestAnimationFrame(tick);})(t0);
  }),{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

  // Gallery filter
  document.querySelectorAll('.chip').forEach(chip=>chip.addEventListener('click',()=>{
    document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    const f=chip.dataset.filter;
    document.querySelectorAll('.m-item').forEach(it=>{
      it.style.display=(f==='all'||it.dataset.cat===f)?'':'none';
    });
  }));

  // Lightbox
  const lb=document.getElementById('lightbox'), lbImg=document.getElementById('lbImg'), lbCap=document.getElementById('lbCap');
  let lbList=[], lbIdx=0;
  function openLb(src,cap,list){
    if(!lb) return; lbList=list||[src]; lbIdx=Math.max(lbList.indexOf(src),0);
    lbImg.src=src; lbCap.textContent=cap||''; lb.classList.add('open'); document.body.style.overflow='hidden';
  }
  function navLb(d){ if(!lbList.length) return; lbIdx=(lbIdx+d+lbList.length)%lbList.length; lbImg.src=lbList[lbIdx]; }
  document.querySelectorAll('.m-item img, .work-masonry img, [data-lightbox]').forEach(img=>{
    img.closest('.m-item,figure,a')?.addEventListener('click',e=>{
      e.preventDefault();
      const items=[...document.querySelectorAll('.m-item')].filter(m=>m.style.display!=='none').map(m=>m.querySelector('img').src);
      openLb(img.src, img.alt, items.length?items:null);
    });
  });
  document.getElementById('lbClose')?.addEventListener('click',()=>{lb.classList.remove('open');document.body.style.overflow='';});
  document.getElementById('lbPrev')?.addEventListener('click',e=>{e.stopPropagation();navLb(-1);});
  document.getElementById('lbNext')?.addEventListener('click',e=>{e.stopPropagation();navLb(1);});
  lb?.addEventListener('click',e=>{if(e.target===lb){lb.classList.remove('open');document.body.style.overflow='';}});
  addEventListener('keydown',e=>{
    if(!lb?.classList.contains('open')) return;
    if(e.key==='Escape'){lb.classList.remove('open');document.body.style.overflow='';}
    if(e.key==='ArrowRight') navLb(1); if(e.key==='ArrowLeft') navLb(-1);
  });

  // Testimonial slider
  const slides=document.getElementById('slides');
  if(slides){
    let i=0; const n=slides.children.length;
    const go=k=>{i=(k+n)%n;slides.style.transform=`translateX(-${i*100}%)`;};
    document.getElementById('prevSlide')?.addEventListener('click',()=>go(i-1));
    document.getElementById('nextSlide')?.addEventListener('click',()=>go(i+1));
    setInterval(()=>go(i+1),6000);
  }

  // Booking form -> WhatsApp
  document.getElementById('bookForm')?.addEventListener('submit',e=>{
    e.preventDefault();
    const v=id=>document.getElementById(id)?.value||'';
    const msg=`*New Booking — RK Film's & Photography*%0A%0A*Name:* ${encodeURIComponent(v('fName'))}%0A*Phone:* ${encodeURIComponent(v('fPhone'))}%0A*Email:* ${encodeURIComponent(v('fEmail'))}%0A*Event:* ${encodeURIComponent(v('fType'))}%0A*Date:* ${encodeURIComponent(v('fDate'))}%0A*Location:* ${encodeURIComponent(v('fLoc'))}%0A*Budget:* ${encodeURIComponent(v('fBudget'))}%0A*Message:* ${encodeURIComponent(v('fMsg'))}`;
    // build with raw newlines then encode properly:
    const text=encodeURIComponent(`*New Booking — RK Film's & Photography*\n\nName: ${v('fName')}\nPhone: ${v('fPhone')}\nEmail: ${v('fEmail')}\nEvent Type: ${v('fType')}\nEvent Date: ${v('fDate')}\nLocation: ${v('fLoc')}\nBudget: ${v('fBudget')}\nMessage: ${v('fMsg')}`);
    window.open(`https://wa.me/917895941403?text=${text}`,'_blank');
  });

  // Footer year
  const yr=document.getElementById('year'); if(yr) yr.textContent=new Date().getFullYear();
})();
