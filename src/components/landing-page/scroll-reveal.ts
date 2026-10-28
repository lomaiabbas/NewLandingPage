/* Shows the page's data-aos elements as they scroll into view. The fade-up itself is still aos.css
   (imported in app/[lng]/layout.tsx), so the markup and the look are unchanged.

   AOS's own trigger is not used: it places an element by adding up offsetTop values, which inside
   the landing page's CSS zoom (landing-page.module.css) are in unzoomed units while the scroll
   position is real. At the 90% laptop zoom it fired later the further down the page an element
   was, so the clients and contact sections only appeared once the page was scrolled to the end;
   on large screens it fired early. An IntersectionObserver reads what is actually on screen. */

// a fade-up waits 100px below its place, so reaching 80px past the bottom edge means its own top
// is 20px into the screen: AOS's old offset of 20, chosen so a section heading sitting at the very
// bottom of the first screen still shows instead of leaving an empty band
const ROOT_MARGIN = '0px 0px 80px 0px';

export function initScrollReveal({ duration, easing }: { duration: number; easing: string }) {
  // aos.css reads the timing from these, as AOS.init used to set them
  document.body.setAttribute('data-aos-duration', String(duration));
  document.body.setAttribute('data-aos-easing', easing);
  document.body.setAttribute('data-aos-delay', '0');

  const watched = new WeakSet<Element>();
  const inView = new WeakSet<Element>();

  const io = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting, boundingClientRect } of entries) {
        if (isIntersecting) {
          inView.add(target);
          target.classList.add('aos-animate');
        } else {
          inView.delete(target);
          // scrolled back up past it: reset so it plays again next time, as AOS did; one that
          // left through the top stays shown
          if (boundingClientRect.top > 0) target.classList.remove('aos-animate');
        }
      }
    },
    { rootMargin: ROOT_MARGIN },
  );

  const sync = () => {
    document.querySelectorAll('[data-aos]').forEach((el) => {
      if (!watched.has(el)) {
        watched.add(el);
        io.observe(el);
      } else if (inView.has(el) && !el.classList.contains('aos-animate')) {
        // React rewrote its className while it was on screen (the why-us stage going fullscreen)
        el.classList.add('aos-animate');
      }
    });
  };
  sync();
  // also picks up sections that stream in after the hero (our-clients waits on the API)
  const mo = new MutationObserver(sync);
  mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

  return () => {
    io.disconnect();
    mo.disconnect();
  };
}
