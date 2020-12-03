// document.addEventListener("DOMContentLoaded", function() {
    //*** variable declarations ***//
    const themeToggle = document.querySelector("#light-dark-toggle");

    //*** event listeners ***//
    themeToggle.addEventListener('click', toggleTheme);

    // RUN ON LOAD
    init();




    //*** methods ***//
    function init() {
        initTheme();
    }

    function initTheme() {
        if(matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }

    // toggle light vs. dark
    function toggleTheme() {

        if (document.documentElement.getAttribute('data-theme') === 'light' ) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }

    function setTheme(input) {
        if (!['light','dark'].includes(input)) {
            console.error("invalid color theme for method setTheme");
            return;
        }

        document.documentElement.setAttribute('data-theme', input);

        if(input === 'light') {
            themeToggle.setAttribute('src', 'images/icon-moon.svg');
        } else {
            themeToggle.setAttribute('src', 'images/icon-sun.svg');
        }

    }



// })