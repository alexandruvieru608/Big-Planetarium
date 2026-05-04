/* =============================================
   BigPlanetarium — Enhanced JS v2
   ============================================= */

/* ---- Star Canvas ---- */
(function initStars() {
  const canvas = document.createElement('canvas');
  canvas.id = 'star-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let stars = [];
  let w, h;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = [];
    const count = Math.floor((w * h) / 3000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + .2,
        a: Math.random(),
        speed: Math.random() * .004 + .001,
        offset: Math.random() * Math.PI * 2,
        color: Math.random() > .9 ? '#aaddff' : Math.random() > .8 ? '#ffeecc' : '#ffffff'
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const alpha = s.a * (.5 + .5 * Math.sin(t * s.speed + s.offset));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

/* ---- Main Init ---- */
document.addEventListener('DOMContentLoaded', () => {

  /* Hamburger */
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Active nav */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* Scroll to top */
  const scrollBtn = document.querySelector('.scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => scrollBtn.classList.toggle('visible', window.scrollY > 400));
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* Tabs */
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      const group  = btn.closest('.tabs');
      group.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active'); btn.setAttribute('aria-selected','true');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  /* Accordion */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item   = header.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-header').setAttribute('aria-expanded','false');
      });
      if (!isOpen) { item.classList.add('open'); header.setAttribute('aria-expanded','true'); }
    });
  });

  /* Scroll animations */
  const anim = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        anim.unobserve(e.target);
      }
    });
  }, { threshold: .1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.card,.fact-card,.video-card,.timeline-item,.accordion-item,.planet-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    anim.observe(el);
  });

  /* Quiz */
  initQuiz();

  /* Counters */
  animateCounters();
});

/* =============================================
   ENHANCED MCQ QUIZ
   ============================================= */

const quizData = [
  {
    category: 'Galaxy',
    question: 'How many light-years across is the Milky Way galaxy?',
    options: ['10,000 ly', '50,000 ly', '100,000 ly', '250,000 ly'],
    correct: 2,
    explanation: 'The Milky Way spans approximately 100,000 light-years in diameter, making it a large barred spiral galaxy.'
  },
  {
    category: 'Planets',
    question: 'Which planet is known as the "Red Planet"?',
    options: ['Venus', 'Jupiter', 'Saturn', 'Mars'],
    correct: 3,
    explanation: 'Mars appears red due to iron oxide (rust) covering its surface. This gave it its nickname "The Red Planet."'
  },
  {
    category: 'Planets',
    question: 'What is the largest planet in our Solar System?',
    options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
    correct: 1,
    explanation: 'Jupiter is the largest planet — it has a mass 2.5 times greater than all other planets combined.'
  },
  {
    category: 'Galaxy',
    question: 'Approximately how old is the Milky Way galaxy?',
    options: ['4.6 billion years', '8.8 billion years', '13.6 billion years', '20 billion years'],
    correct: 2,
    explanation: 'The Milky Way is estimated to be about 13.6 billion years old, nearly as old as the universe itself.'
  },
  {
    category: 'Solar System',
    question: 'How many planets are in our Solar System?',
    options: ['7', '8', '9', '10'],
    correct: 1,
    explanation: 'There are 8 officially recognised planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.'
  },
  {
    category: 'Mars',
    question: 'What is the name of the tallest volcano in the Solar System, located on Mars?',
    options: ['Mauna Kea', 'Olympus Mons', 'Tharsis Bulge', 'Elysium Mons'],
    correct: 1,
    explanation: 'Olympus Mons on Mars stands ~21.9 km tall — nearly three times the height of Mount Everest.'
  },
  {
    category: 'Space',
    question: 'What is the name of the supermassive black hole at the centre of the Milky Way?',
    options: ['Cygnus X-1', 'M87*', 'Sagittarius A*', 'NGC 1277'],
    correct: 2,
    explanation: 'Sagittarius A* (Sgr A*) is the supermassive black hole at the Milky Way\'s centre, with a mass of ~4 million suns.'
  },
  {
    category: 'Planets',
    question: 'Which planet has the most moons as of 2024?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correct: 1,
    explanation: 'Saturn holds the record with 146 confirmed moons as of 2023–2024, surpassing Jupiter\'s 95 moons.'
  }
];

let currentQ = 0;
let score    = 0;
let answered = false;
const results = [];

function initQuiz() {
  const el = document.getElementById('quiz');
  if (!el) return;
  renderQ();
}

function renderQ() {
  const el = document.getElementById('quiz');
  if (!el) return;
  if (currentQ >= quizData.length) { showResult(); return; }
  const q   = quizData[currentQ];
  const pct = Math.round((currentQ / quizData.length) * 100);

  el.innerHTML = `
    <div class="mcq-top-bar">
      <span class="mcq-counter" aria-label="Question ${currentQ+1} of ${quizData.length}">Q${currentQ+1} / ${quizData.length}</span>
      <div class="mcq-progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="Quiz progress">
        <div class="mcq-progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="mcq-score-badge">${score} pts</div>
    </div>
    <div class="mcq-body">
      <span class="mcq-category">${q.category}</span>
      <p class="mcq-question">${q.question}</p>
      <div class="mcq-options" role="group" aria-label="Answer choices">
        ${q.options.map((opt, i) => `
          <button class="mcq-option" data-index="${i}" aria-label="Option ${['A','B','C','D'][i]}: ${opt}">
            <span class="mcq-option-letter">${['A','B','C','D'][i]}</span>
            <span class="mcq-option-text">${opt}</span>
          </button>
        `).join('')}
      </div>
      <div class="mcq-feedback hidden" id="mcq-fb" role="status" aria-live="polite"></div>
      <button class="btn btn-primary" id="mcq-next" style="display:none" onclick="nextQ()">
        ${currentQ < quizData.length - 1 ? 'Next Question →' : 'See Results 🚀'}
      </button>
    </div>
    <div class="mcq-footer">
      <div class="mcq-dots" aria-hidden="true">
        ${quizData.map((_, i) => {
          let cls = 'mcq-dot';
          if (i < currentQ) cls += results[i] ? ' done-correct' : ' done-wrong';
          else if (i === currentQ) cls += ' current';
          return `<div class="${cls}"></div>`;
        }).join('')}
      </div>
      <span style="font-size:.8rem;color:var(--text-muted)">Click an answer to continue</span>
    </div>
  `;

  document.querySelectorAll('.mcq-option').forEach(btn => {
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      checkQ(parseInt(btn.dataset.index), q);
    });
  });
}

function checkQ(chosen, q) {
  const opts    = document.querySelectorAll('.mcq-option');
  const fb      = document.getElementById('mcq-fb');
  const nextBtn = document.getElementById('mcq-next');
  const isRight = chosen === q.correct;

  opts.forEach(o => { o.disabled = true; });

  if (isRight) {
    score++;
    opts[chosen].classList.add('correct');
    fb.className = 'mcq-feedback correct-fb';
    fb.innerHTML = `<span class="mcq-feedback-icon">✅</span><span><strong>Correct!</strong> ${q.explanation}</span>`;
    results.push(true);
  } else {
    opts[chosen].classList.add('wrong');
    opts[q.correct].classList.add('correct');
    fb.className = 'mcq-feedback wrong-fb';
    fb.innerHTML = `<span class="mcq-feedback-icon">❌</span><span><strong>Not quite.</strong> ${q.explanation}</span>`;
    results.push(false);
  }

  nextBtn.style.display = 'inline-flex';
}

function nextQ() {
  currentQ++;
  answered = false;
  renderQ();
}

function showResult() {
  const el   = document.getElementById('quiz');
  const pct  = Math.round((score / quizData.length) * 100);
  const wrong = quizData.length - score;
  let trophy, message;
  if (pct >= 90)     { trophy = '🏆'; message = 'Outstanding! You\'re a true space scholar!'; }
  else if (pct >= 70){ trophy = '🥇'; message = 'Excellent work! You know your cosmos!'; }
  else if (pct >= 50){ trophy = '🥈'; message = 'Great effort! Keep exploring the universe!'; }
  else if (pct >= 30){ trophy = '🌌'; message = 'A good start — the universe is waiting for you!'; }
  else               { trophy = '🚀'; message = 'Space is vast — dive in and learn more!'; }

  el.innerHTML = `
    <div class="mcq-top-bar" style="justify-content:center">
      <span class="mcq-counter">Quiz Complete!</span>
    </div>
    <div class="mcq-result">
      <span class="mcq-result-trophy">${trophy}</span>
      <div class="mcq-result-score">${pct}%</div>
      <div class="mcq-result-fraction">${score} of ${quizData.length} correct</div>
      <p class="mcq-result-message">${message}</p>
      <div class="mcq-result-breakdown">
        <div class="rb-item rb-correct">
          <span class="rb-value">${score}</span>
          <span class="rb-label">Correct</span>
        </div>
        <div class="rb-item rb-wrong">
          <span class="rb-value">${wrong}</span>
          <span class="rb-label">Incorrect</span>
        </div>
      </div>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="restartQuiz()">Try Again 🔄</button>
        <a href="milkyway.html" class="btn btn-outline">Explore More 🌌</a>
      </div>
    </div>
    <div class="mcq-footer">
      <div class="mcq-dots" aria-hidden="true">
        ${results.map(r => `<div class="mcq-dot ${r ? 'done-correct' : 'done-wrong'}"></div>`).join('')}
      </div>
      <span style="font-size:.8rem;color:var(--text-muted)">${pct >= 70 ? 'Great job! 🌟' : 'Keep learning! 📚'}</span>
    </div>
  `;
}

function restartQuiz() {
  currentQ = 0; score = 0; answered = false; results.length = 0;
  renderQ();
}

/* ---- Counter Animation ---- */
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      let current  = 0;
      const steps  = 60;
      const inc    = target / steps;
      const iv     = setInterval(() => {
        current += inc;
        if (current >= target) { current = target; clearInterval(iv); }
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      }, 2000 / steps);
      obs.unobserve(el);
    });
  }, { threshold: .5 });
  counters.forEach(c => obs.observe(c));
}

/* Expose globals */
window.nextQ        = nextQ;
window.restartQuiz  = restartQuiz;
