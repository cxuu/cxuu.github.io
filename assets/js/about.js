// Rotate About's fallback tagline with opacity fades; reduced motion stays static.
(function () {
    'use strict';

    var span = document.getElementById('self_description');
    if (!span) return;

    var descriptions = JSON.parse(span.getAttribute('data-descriptions'));
    if (descriptions.length < 2) return;

    var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var index = 0;
    var timer;
    var fadeDuration = 400; // Match .self-description's opacity transition in screen.css.
    var holdDuration = 3000;

    function rotate() {
        span.classList.add('is-fading');
        timer = window.setTimeout(function () {
            index = (index + 1) % descriptions.length;
            span.textContent = descriptions[index];
            span.classList.remove('is-fading');
            // Allow the fade-in to finish before the next three-second hold.
            timer = window.setTimeout(rotate, fadeDuration + holdDuration);
        }, fadeDuration);
    }

    function update() {
        window.clearTimeout(timer);
        span.classList.remove('is-fading');
        if (!motion.matches) {
            timer = window.setTimeout(rotate, holdDuration);
        }
    }

    if (motion.addEventListener) {
        motion.addEventListener('change', update);
    } else {
        motion.addListener(update);
    }
    update();
})();
