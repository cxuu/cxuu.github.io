(function () {
    'use strict';

    var nav = document.querySelector('.mediumnavigation');
    var toggle = document.querySelector('.navbar-toggler');
    var menu = document.getElementById('navbarMediumish');
    var alertbar = document.querySelector('.alertbar');
    var lastScroll = window.pageYOffset;
    var scheduled = false;

    function showNav() {
        nav.style.top = '0px';
    }

    function setMenu(open) {
        menu.classList.toggle('show', open);
        toggle.setAttribute('aria-expanded', String(open));
        showNav();
    }

    toggle.addEventListener('click', function () {
        setMenu(!menu.classList.contains('show'));
    });
    // Search results open inside the menu; closing it under them would leave the page unable to scroll.
    nav.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && menu.classList.contains('show') && !document.body.classList.contains('modal-open')) {
            setMenu(false);
            toggle.focus();
        }
    });
    nav.addEventListener('focusin', showNav);

    function onScroll() {
        // Clamp both ends so Safari's overscroll bounce doesn't count as scrolling.
        var scroll = Math.max(0, Math.min(window.pageYOffset, document.documentElement.scrollHeight - window.innerHeight));
        if (alertbar) alertbar.style.display = scroll > 280 ? 'block' : 'none';
        if (Math.abs(scroll - lastScroll) > 5) {
            // Chrome focuses the toggler on click and tap, so its focus doesn't pin the nav.
            var focused = document.activeElement;
            var keepVisible = (focused !== toggle && nav.contains(focused)) || menu.classList.contains('show');
            var hide = !keepVisible && scroll > lastScroll && scroll > nav.offsetHeight;
            nav.style.top = hide ? -nav.offsetHeight + 'px' : '0px';
            lastScroll = scroll;
        }
        scheduled = false;
    }

    window.addEventListener('scroll', function () {
        if (!scheduled) {
            scheduled = true;
            window.requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    onScroll();
})();
