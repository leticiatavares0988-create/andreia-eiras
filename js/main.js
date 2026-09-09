/* ============================================================
   ANDRÉIA EIRAS — interações e animações (GSAP + ScrollTrigger)
   Conteúdo permanece visível sem JS; animações respeitam
   prefers-reduced-motion via gsap.matchMedia().
   ============================================================ */

(function () {
  'use strict';

  /* ---------- navbar: fundo ao rolar (independe de GSAP) ---------- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  var mm = gsap.matchMedia();

  mm.add(
    {
      motionOK: '(prefers-reduced-motion: no-preference)',
      isDesktop: '(min-width: 900px)'
    },
    function (context) {
      var c = context.conditions;
      if (!c.motionOK) return;

      /* ---------- entrada do hero em sequência ---------- */
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.nav__inner', { y: -24, autoAlpha: 0, duration: 0.7 })
        .from('[data-hero="1"]', { y: 28, autoAlpha: 0, duration: 0.7 }, '-=0.35')
        .from('[data-hero="2"]', { y: 44, autoAlpha: 0, duration: 0.9 }, '-=0.4')
        .from('.glass-card', { x: 36, autoAlpha: 0, duration: 0.7, stagger: 0.14 }, '-=0.55')
        .from('[data-hero="4"] .btn', { y: 22, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, '-=0.4');

      /* ---------- reveal das seções ---------- */
      gsap.utils.toArray('[data-reveal]').forEach(function (el) {
        gsap.from(el, {
          y: 36,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 86%', once: true }
        });
      });

      /* ---------- especialidades: pin + scroll horizontal (desktop) ---------- */
      if (c.isDesktop) {
        var section = document.querySelector('.specialties');
        var pinEl = document.querySelector('.specialties__pin');
        var track = document.querySelector('.specialties__track');
        if (section && pinEl && track) {
          // deslocamento: leva a borda direita do último card até vw - 24px
          var distance = function () {
            var padLeft = Math.max(24, (window.innerWidth - 1160) / 2 + 24);
            return Math.max(0, padLeft + track.scrollWidth - (window.innerWidth - 24));
          };

          gsap.to(track, {
            x: function () { return -distance(); },
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              pin: pinEl,
              scrub: 1,
              start: 'top top',
              end: function () { return '+=' + distance(); },
              invalidateOnRefresh: true,
              anticipatePin: 1
            }
          });
        }
      }
    }
  );
})();
