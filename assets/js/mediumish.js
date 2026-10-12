(function () {
    'use strict';

    var nav = document.querySelector('.mediumnavigation');
    var toggle = document.querySelector('.navbar-toggler');
    var menu = document.getElementById('navbarMediumish');
    var alertbar = document.querySelector('.alertbar');
    var lastScroll = window.pageYOffset;
    var alertVisible;
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

    // Once per frame: read all geometry before writing styles, so no write forces another layout.
    function onScroll() {
        var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        var navHeight = nav.offsetHeight;
        // Clamp both ends so Safari's overscroll bounce doesn't count as scrolling.
        var scroll = Math.max(0, Math.min(window.pageYOffset, maxScroll));
        var showAlert = scroll > 280;
        if (alertbar && alertVisible !== showAlert) {
            alertbar.style.display = showAlert ? 'block' : 'none';
            alertVisible = showAlert;
        }
        if (Math.abs(scroll - lastScroll) > 5) {
            // Chrome focuses the toggler on click and tap, so its focus doesn't pin the nav.
            var focused = document.activeElement;
            var keepVisible = (focused !== toggle && nav.contains(focused)) || menu.classList.contains('show');
            var hide = !keepVisible && scroll > lastScroll && scroll > navHeight;
            nav.style.top = hide ? -navHeight + 'px' : '0px';
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
