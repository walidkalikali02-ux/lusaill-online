(() => {
  const lessons = window.mathLessons;
  const ar = window.arNumber;
  const el = id => document.getElementById(id);
  const storageKey = 'manahej-qatar-grade-one-v1';
  let scores = {};
  try { scores = JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
  let lesson;
  let index;
  let prediction;
  let step;
  let phase;
  let points;
  let complete;

  const trials = {
    count: ['المس قطعة للعدّ','عُدّ القطعة التالية'],
    compare: ['طابق قطعة بقطعة','طابق القطعتين التاليتين'],
    add: ['أضف المجموعة','أضف المجموعة'],
    subtract: ['أزل المجموعة','أزل المجموعة'],
    line: ['اقفز على خط الأعداد','اقفز مرة أخرى'],
    place: ['افتح حزمة العشرة','افتح حزمة العشرة'],
    length: ['ضع مكعبًا','ضع المكعب التالي'],
    clock: ['أبرز عقرب الساعات','أبرز عقرب الدقائق'],
    shape: ['تتبّع حدود الشكل','تتبّع الضلع التالي'],
    solid: ['أبرز الأسطح','أبرز الأسطح'],
    parts: ['قسّم الشكل','أضف خط تقسيم'],
    pattern: ['أظهر المجموعة الأولى','كرّر المجموعة']
  };
  const maxSteps = art => ({
    count: Math.max(1,art.n),compare:Math.min(art.a,art.b),line:3,
    length:art.n,clock:2,shape:Math.max(1,art.sides),parts:art.n===4?2:1,pattern:2
  }[art.type] || 1);
  const show = value => typeof value === 'number' ? ar(value) : value;
  const fmt = score => ar(score) + ' نقطة';
  const token = (icon,kind='') => '<span class="token '+kind+'">'+icon+'</span>';
  const tokens = (n,draw) => Array.from({length:n},(_,i)=>draw(i)).join('');
  const row = inner => '<div class="tokens" aria-hidden="true">'+inner+'</div>';
  const caption = text => '<p class="scene-label">'+text+'</p>';
  const svg = (content,label) => '<svg viewBox="0 0 240 150" role="img" aria-label="'+label+'">'+content+'</svg>';
  const segment = (x1,y1,x2,y2,color,width=3) =>
    '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+color+'" stroke-width="'+width+'" stroke-linecap="round"/>';
  const dot = (x,y,r,fill) => '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'"/>';

  const illustrations = {
    count(art,n) {
      return row(tokens(art.n,i=>token(art.icon,i<n?'marked':''))) +
        caption(art.n ? (n?'عدَدْتَ '+ar(n):'قطع للعدّ') : n?'عدد القطع في السلة: ٠':'السلة فارغة');
    },
    compare(art,n) {
      const group = count => '<div class="pair">'+tokens(7,i=>i<count?token('●',i<n?'marked':''):token('','empty'))+'</div>';
      return caption('المجموعة الأولى')+'<div class="pair-board" aria-hidden="true">'+group(art.a)+
        '<div class="links">'+tokens(7,i=>'<span class="'+(i<n?'joined':'')+'"></span>')+'</div>'+group(art.b)+'</div>'+
        caption('المجموعة الثانية');
    },
    add(art,n) {
      const piece = kind => token(art.skip?'١٠':'●',art.skip?'bundle '+kind:kind);
      return row(tokens(art.a,()=>piece(''))+(n?tokens(art.b,()=>piece('marked')):'')) +
        caption(n?'المجموعتان معًا':'مجموعة البداية');
    },
    subtract(art,n) {
      return row(tokens(art.a,i=>token(art.skip?'١٠':'●',(art.skip?'bundle ':'')+(n&&i>=art.a-art.b?'gone':''))))+
        caption(n?'عُدّ القطع التي لم تُشطب':'مجموعة البداية');
    },
    line(art,n) {
      return '<div class="line" dir="ltr">'+tokens(4,i=>'<span class="'+(i===n?'on':'')+'">'+
        (i===3&&n<3?'؟':ar(art.start+i*art.step))+'</span>'+(i<3?' → ':''))+'</div>'+
        caption('كل قفزة تزيد '+ar(art.step));
    },
    place(art,n) {
      return row(tokens(art.t-(n?1:0),()=>token('١٠','bundle')))+
        (n?row(tokens(10,()=>token('●','marked'))):'')+row(tokens(art.o,()=>token('●')))+
        caption(n?'حزمة واحدة فُتحت إلى عشر قطع':'حزم العشرات وقطع الآحاد');
    },
    length(art,n) {
      return '<div class="ruler" dir="ltr"><div class="strip" style="width:'+art.n*100/8+'%"></div>'+
        '<div class="cubes" style="grid-template-columns:repeat(8,1fr)">'+tokens(8,i=>'<span class="'+(i<n?'filled':'')+'"></span>')+
        '</div></div>'+caption(n?'وضعت '+ar(n)+' مكعبات':'الشريط المراد قياسه');
    },
    clock(art,n) {
      function point(angle,r) {
        return [120+Math.sin(angle*Math.PI/180)*r,75-Math.cos(angle*Math.PI/180)*r];
      }
      const numbers=tokens(12,i=>{
        const [x,y]=point((i+1)*30,48);
        return '<text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="13" fill="#252236">'+ar(i+1)+'</text>';
      });
      return svg('<circle cx="120" cy="75" r="64" fill="white" stroke="#61509f" stroke-width="3"/>'+numbers+
        segment(120,75,...point((art.h+art.m/60)*30,28),n===1?'#9b471d':'#322359',n===1?7:5)+
        segment(120,75,...point(art.m*6,41),n===2?'#9b471d':'#322359',n===2?6:3)+dot(120,75,4,'#322359'),
        'ساعة بعقرب قصير وطويل')+(n?caption(n===1?'العقرب القصير يبيّن الساعة':'العقرب الطويل يبيّن الدقائق'):'');
    },
    shape(art,n) {
      if (!art.sides) return svg('<circle cx="120" cy="75" r="48" fill="white" stroke="'+(n?'#a95721':'#61509f')+'" stroke-width="4"/>','دائرة')+
        (n?caption('تتبّعت حدًا منحنيًا'):'');
      const vertices=art.sides===3?[[120,22],[175,121],[65,121]]:[[75,30],[165,30],[165,120],[75,120]];
      const edges=vertices.map(([x,y],i)=>segment(x,y,...vertices[(i+1)%vertices.length],i<n?'#a95721':'#61509f',i<n?6:3)).join('');
      return svg('<polygon points="'+vertices.map(v=>v.join(',')).join(' ')+'" fill="white"/>'+edges,art.name)+
        (n?caption('الأضلاع التي تتبّعتها: '+ar(n)):'');
    },
    solid(art,n) {
      const fill=n?'#ffcf79':'#e2d8fc';
      const items={
        'المكعب':'<path d="M77 52l36-25 53 18v59l-35 25-54-20z" fill="'+fill+'" stroke="#61509f" stroke-width="3"/><path d="M77 52l54 20 35-27m-35 27v57" fill="none" stroke="#61509f" stroke-width="3"/>'+dot(104,87,5,'#5340a1'),
        'الكرة':'<circle cx="120" cy="75" r="47" fill="'+fill+'" stroke="#61509f" stroke-width="3"/><path d="M78 54q38 0 74 57m-75-16q42 4 77-53" fill="none" stroke="#61509f" stroke-width="2"/>',
        'الأسطوانة':'<path d="M84 45v61c0 20 72 20 72 0V45" fill="'+fill+'" stroke="#61509f" stroke-width="3"/><ellipse cx="120" cy="45" rx="36" ry="13" fill="white" stroke="#61509f" stroke-width="3"/>'
      };
      const surface = {'المكعب':'أوجه مستوية مربعة','الكرة':'سطح منحنٍ في كل الجهات','الأسطوانة':'قاعدتان دائريتان وسطح منحنٍ'};
      return svg(items[art.answer],art.name)+caption(n?surface[art.answer]:art.name);
    },
    parts(art,n) {
      const lines=(n?segment(120,30,120,120,'#a95721',3):'')+(n===2?segment(45,75,195,75,'#a95721',3):'');
      return svg('<rect x="45" y="30" width="150" height="90" rx="4" fill="#fff" stroke="#61509f" stroke-width="3"/>'+lines,'مستطيل')+
        caption(n?'أجزاء متساوية: '+ar(n===1?2:4):'مستطيل كامل');
    },
    pattern(art,n) {
      const period=art.sequence.length===3?2:3;
      const group=art.sequence.map((item,i)=>'<span'+(n&&i<period?' style="color:#9b471d"':'')+'>'+item+'</span>').join('');
      return '<div class="pattern" dir="ltr">'+group+'<span>'+(n===2?art.answer:'؟')+'</span></div>'+
        (n?caption('المجموعة المتكررة: '+art.sequence.slice(0,period).join(' ')):'');
    }
  };

  function renderCatalog() {
    el('catalog-score').textContent = 'مجموع أفضل نتائجك · '+fmt(Object.values(scores).reduce((total,value)=>total+value,0));
    el('terms').replaceChildren();
    for (const term of [1,2]) {
      const group = document.createElement('section');
      group.className='term';
      const title=document.createElement('h2');
      title.textContent=term===1?'الفصل الدراسي الأول':'الفصل الدراسي الثاني';
      const grid=document.createElement('div');
      grid.className='catalog-grid';
      for (const item of lessons.filter(item=>item.term===term)) {
        const link=document.createElement('a');
        link.className='lesson-link';
        link.href='#درس-'+item.id;
        link.innerHTML='<span class="lesson-number">'+ar(item.id)+'</span><div><strong>'+item.title+'</strong><small>'+item.goal+
          (Object.hasOwn(scores,item.id)?' · '+fmt(scores[item.id]):'')+'</small></div>';
        grid.append(link);
      }
      group.append(title,grid);
      el('terms').append(group);
    }
  }

  function resetStage() {
    prediction=null;
    step=0;
    phase='predict';
    render();
    el('prompt').focus();
  }

  function start(item) {
    lesson=item;
    index=0;
    points=0;
    complete=false;
    el('catalog').hidden=true;
    el('lesson').hidden=false;
    resetStage();
  }

  function render() {
    el('lesson-title').textContent=lesson.title;
    el('lesson-score').textContent=fmt(points);
    el('progress').max=lesson.stages.length;
    el('progress').value=complete?lesson.stages.length:index+(phase==='review'?1:0);
    el('play').hidden=complete;
    el('result').hidden=!complete;
    if (complete) {
      el('result-score').textContent='جمعت '+ar(points)+' من '+fmt(lesson.stages.length*10)+'.';
      el('result-title').focus();
      return;
    }

    const activity=lesson.stages[index];
    const art=activity.art;
    const limit=maxSteps(art);
    const status={predict:'توقّع',try:'جرّب',review:'افهم'}[phase];
    el('phase').textContent=ar(index+1)+' من '+ar(lesson.stages.length)+' · '+status;
    el('prompt').textContent=phase==='predict'?activity.prompt:'توقّعك: '+show(prediction);
    el('scene').innerHTML=illustrations[art.type](art,step);
    el('choices').replaceChildren();
    el('observation').textContent=phase==='try'&&step>0?'خطوات التجربة: '+ar(step)+' من '+ar(limit):'';
    el('feedback').hidden=phase!=='review';
    el('advance').hidden=phase==='predict';

    if (phase==='predict') {
      const shift=(lesson.id+index)%activity.options.length;
      const options=activity.options.slice(shift).concat(activity.options.slice(0,shift));
      for (const option of options) {
        const button=document.createElement('button');
        button.type='button';
        button.textContent=show(option);
        button.addEventListener('click',()=>{
          prediction=option;
          phase='try';
          render();
          el('advance').focus();
        });
        el('choices').append(button);
      }
    } else if (phase==='try') {
      el('advance').textContent=step===limit?'شوف تفسير توقّعك':
        art.type==='count'&&art.n===0?'افحص السلة':trials[art.type][step?1:0];
    } else {
      const verdict=document.createElement('strong');
      const reason=document.createElement('p');
      const explanation=document.createElement('p');
      const correct=prediction===activity.answer;
      verdict.textContent=correct?'توقّع صحيح! +١٠ نقاط':'لنراجع توقّعك';
      reason.textContent=correct?'الإجابة الصحيحة: '+show(activity.answer):activity.why[activity.options.indexOf(prediction)-1];
      explanation.textContent=activity.explain;
      el('feedback').replaceChildren(verdict,reason,explanation);
      el('advance').textContent=index===lesson.stages.length-1?'شوف النتيجة':'المرحلة التالية';
    }
  }

  el('advance').addEventListener('click',()=>{
    const activity=lesson.stages[index];
    if (phase==='try') {
      if (step<maxSteps(activity.art)) {
        step++;
      } else {
        phase='review';
        if (prediction===activity.answer) points+=10;
      }
      render();
    } else if (phase==='review') {
      if (index+1<lesson.stages.length) {
        index++;
        resetStage();
        return;
      }
      complete=true;
      scores[lesson.id]=Math.max(scores[lesson.id]||0,points);
      try { localStorage.setItem(storageKey,JSON.stringify(scores)); } catch {}
      render();
    }
  });
  el('repeat').addEventListener('click',()=>start(lesson));
  function route() {
    let hash='';
    try { hash=decodeURIComponent(location.hash); } catch {}
    const item=lessons.find(item=>hash==='#درس-'+item.id);
    if (item) {
      start(item);
    } else {
      el('catalog').hidden=false;
      el('lesson').hidden=true;
      renderCatalog();
    }
    window.scrollTo(0,0);
  }
  window.addEventListener('hashchange',route);
  route();
})();
