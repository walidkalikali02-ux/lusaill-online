(() => {
  const lessons = window.mathLessons;
  const units = window.mathUnits;
  const byId = new Map(lessons.map(item => [item.id, item]));
  const lessonOrder = units.flatMap(unit => unit.ids.map(id => byId.get(id)));
  const ar = window.arNumber;
  const el = id => document.getElementById(id);
  const storageKey = 'manahej-qatar-grade-one-v1';
  const progressKey = 'manahej-qatar-grade-one-progress-v1';
  let scores = {};
  let progress = {last:null,drafts:{}};
  function readStorage(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  }
  const savedScores = readStorage(storageKey);
  for (const item of lessons) {
    const score = savedScores[item.id];
    if (Number.isInteger(score) && score >= 0 && score <= item.stages.length*10) scores[item.id] = score;
  }
  const savedProgress = readStorage(progressKey);
  progress.last = byId.has(savedProgress.last) ? savedProgress.last : null;
  for (const item of lessons) {
    const draft = savedProgress.drafts?.[item.id];
    const activity = item.stages[draft?.index];
    if (!Number.isInteger(draft?.index) || !activity || !Number.isInteger(draft.points) ||
      draft.points < 0 || draft.points > (draft.index + (draft.phase === 'review' ? 1 : 0))*10 ||
      !Number.isInteger(draft.step) || draft.step < 0 || draft.step > maxSteps(activity.art)) continue;
    if (draft.phase === 'predict' ? draft.prediction === null && draft.step === 0 :
      (draft.phase === 'try' || draft.phase === 'review') && activity.options.includes(draft.prediction) &&
      (draft.phase !== 'review' || draft.step === maxSteps(activity.art))) {
      progress.drafts[item.id] = draft;
    }
  }
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
  function maxSteps(art) { return ({
    count: Math.max(1,art.n),compare:Math.min(art.a,art.b),line:3,
    length:art.n,clock:2,shape:Math.max(1,art.sides),parts:art.n===4?2:1,pattern:2
  }[art.type] || 1); }
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

  function saveProgress() {
    try { localStorage.setItem(progressKey,JSON.stringify(progress)); } catch {}
  }

  function checkpoint() {
    progress.last = lesson.id;
    progress.drafts[lesson.id] = {index,prediction,step,phase,points};
    saveProgress();
  }

  function renderCatalog() {
    const finished = Object.keys(scores).length;
    el('catalog-score').textContent = 'أكملت '+ar(finished)+' من '+ar(lessons.length)+' درسًا · '+fmt(Object.values(scores).reduce((total,value)=>total+value,0));
    el('catalog-progress').max = lessons.length;
    el('catalog-progress').value = finished;
    const last = byId.get(progress.last);
    const draft = last && progress.drafts[last.id];
    const next = last && lessonOrder.slice(lessonOrder.indexOf(last)+1).find(item=>!Object.hasOwn(scores,item.id));
    const target = draft ? last : next || lessonOrder.find(item=>!Object.hasOwn(scores,item.id)) || last || lessonOrder[0];
    el('resume-link').href = '#درس-'+target.id;
    el('resume-link').textContent = draft ? 'كمّل من حيث توقفت ←' : finished === lessons.length ? 'راجع درسًا ←' :
      last || finished ? 'ابدأ الدرس التالي ←' : 'ابدأ أول درس ←';
    el('resume-detail').textContent = target.title + (draft ? ' · المرحلة '+ar(draft.index+1)+' من '+ar(target.stages.length) : '');
    el('terms').replaceChildren();
    for (const term of [1,2]) {
      const group = document.createElement('section');
      group.className='term';
      group.id='term-'+term;
      const title=document.createElement('h2');
      title.textContent=term===1?'الفصل الدراسي الأول':'الفصل الدراسي الثاني';
      group.append(title);
      for (const unit of units.filter(unit=>unit.term===term)) {
        const block=document.createElement('section');
        block.className='unit';
        const heading=document.createElement('h3');
        heading.textContent=unit.title;
        const grid=document.createElement('div');
        grid.className='catalog-grid';
        for (const id of unit.ids) {
          const item=byId.get(id);
          const link=document.createElement('a');
          const done=Object.hasOwn(scores,id);
          const started=Object.hasOwn(progress.drafts,id);
          link.className='lesson-link';
          link.setAttribute('data-status',done?'done':started?'started':'new');
          link.href='#درس-'+id;
          link.innerHTML='<span class="lesson-number" aria-hidden="true">'+(done?'✓':ar(lessonOrder.indexOf(item)+1))+
            '</span><div><strong>'+item.title+'</strong><small>'+item.goal+'</small><small class="lesson-status">'+
            (done?'مكتمل · '+fmt(scores[id]):started?'قيد التقدّم':'لم يبدأ بعد')+'</small></div>';
          grid.append(link);
        }
        block.append(heading,grid);
        group.append(block);
      }
      el('terms').append(group);
    }
  }

  function resetStage() {
    prediction=null;
    step=0;
    phase='predict';
    checkpoint();
    render();
    el('prompt').focus();
  }

  function start(item, replay=false) {
    lesson=item;
    complete=false;
    el('catalog').hidden=true;
    el('lesson').hidden=false;
    const draft = !replay && progress.drafts[item.id];
    if (draft) {
      ({index,prediction,step,phase,points}=draft);
      checkpoint();
      render();
      (phase==='predict'?el('prompt'):el('advance')).focus();
      return;
    }
    if (!replay && Object.hasOwn(scores,item.id)) {
      complete=true;
      points=scores[item.id];
      render();
      return;
    }
    index=0;
    points=0;
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
      el('result-score').textContent='أفضل نتيجة: '+ar(scores[lesson.id])+' من '+fmt(lesson.stages.length*10)+'.';
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
          checkpoint();
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
      checkpoint();
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
      delete progress.drafts[lesson.id];
      saveProgress();
      render();
    }
  });
  el('repeat').addEventListener('click',()=>start(lesson,true));
  function route() {
    let hash='';
    try { hash=decodeURIComponent(location.hash); } catch {}
    const item=lessons.find(item=>hash==='#درس-'+item.id);
    if (item) {
      start(item);
      window.scrollTo(0,0);
    } else {
      el('catalog').hidden=false;
      el('lesson').hidden=true;
      renderCatalog();
      if (hash==='#term-1' || hash==='#term-2') el(hash.slice(1))?.scrollIntoView();
      else window.scrollTo(0,0);
    }
  }
  window.addEventListener('hashchange',route);
  route();
})();
