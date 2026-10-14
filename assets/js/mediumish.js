// Navbar visibility, mobile-menu controls and lazy search loading; no Bootstrap JS.
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

    var form = document.querySelector('form.bd-search');
    var input = document.getElementById('lunrsearch');
    if (!form || !input) return;

    // idle allows retry after either download fails; loading owns one script chain;
    // ready reuses the index. A pending submit reads the latest input, not a snapshot.
    var state = 'idle';
    var searchWhenReady = false;

    function search() {
        var term = input.value.trim();
        if (term) lunr_search(term);
    }

    function addScript(src, onload) {
        var script = document.createElement('script');
        script.src = src;
        script.defer = true;
        script.onload = onload;
        script.onerror = function () {
            state = 'idle';
            searchWhenReady = false;
            script.parentNode.removeChild(script);
        };
        document.body.appendChild(script);
    }

    function load() {
        if (state !== 'idle') return;
        state = 'loading';
        addScript(form.getAttribute('data-search-vendor'), function () {
            addScript(form.getAttribute('data-search-engine'), function () {
                state = 'ready';
                if (searchWhenReady) {
                    searchWhenReady = false;
                    search();
                }
            });
        });
    }

    input.addEventListener('focus', load);
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!input.value.trim()) return;
        if (state === 'ready') {
            search();
        } else {
            searchWhenReady = true;
            load();
        }
    });
})();
