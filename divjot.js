
// NOTE: 2025 TODO
// divjot.js - Divjot Live Web Editor

(function() {

    const UI = {
        devMode: true,
        darkMode: false,
        colorModes: {
            dark: { bg: "#333", fg: "#fff" },
            light: { bg: "#fff", fg: "#333" }
        }
    }

    let divjot_wrapper = document.getElementById('divjot-wrapper');

    // Editor textarea elements
    let divjot_html = document.getElementById('divjot-html');
    let divjot_css = document.getElementById('divjot-css');
    let divjot_js = document.getElementById('divjot-js');
    let usermarkup = document.getElementById('divjot-markup');
    let userstyle = document.getElementById('divjot-style');

    // Editor control buttons
    const controls = {
        opacity:  document.getElementById('opacity-control'),
        fsmaller: document.getElementById('fsize-smaller-button'),
        fbigger: document.getElementById('fsize-bigger-button'),
        toggleLightDarkButton: document.getElementById('toggle-light-dark-button'),
        html: document.getElementById('html-button'),
        css: document.getElementById('css-button'),
        js: document.getElementById('js-button'),
        run: document.getElementById('run-button'),
        export: document.getElementById('export-button'),
        closed: false,    // flag for open/close all editors
        fsize: 10
    };

    // Set initial opacity to 100
    controls.opacity.value = 100;

    // Menu UI elements.
    const menu = {
        top_ui_section: document.getElementsByClassName('top-ui-section')[0],
        user_fileinput: document.getElementById('user-fileinput'),
        import_fileinput: document.getElementById('import-fileinput'),
        import_button: document.getElementById('import-button'),
        imported_list: []
    };

    // Send user source to DOM.
    const outputs = {
        markup_out: () => usermarkup.innerHTML = divjot_html.value,
        style_out: () => userstyle.innerHTML = divjot_css.value,
        js_out: () => eval(divjot_js.value),

        exportOut: () => {
            const content = `${divjot_html.value} <style> ${divjot_css.value}</style> <script> ${divjot_js.value} </script>`

            const raw = `<h1>HTML</h1><hr> <pre><code>${divjot_html.value}</code></pre>
                         <h1>CSS</h1><hr>  <pre><code>${divjot_css.value}</code></pre>
                         <h1>JS</h1><hr>   <pre><code>${divjot_js.value}</code></pre>`

            const win = window.open('', '_blank')
            win.document.open('divjot-save.html')
            win.document.write(content + raw)
        }
    }

    // Open or close all editors at once (for hotkeys)
    function openclose_editors() {
      // TODO: Make a show/hide el function
	    if (controls.closed) {
            divjot_html.style.display = "inline-block";
            divjot_css.style.display = "inline-block";
            divjot_js.style.display = "inline-block";
            controls.closed = false;
        }
        else {
            divjot_html.style.display = "none";
            divjot_css.style.display = "none";
            divjot_js.style.display = "none";
            controls.closed = true;
        }
    }

    // Toggle 'show/hide' individual editors.
    function toggle(el) {
        const showing = el.style.display !== "none";
        el.style.display = showing ? "none" : "inline-block";
    }

    // Editor font size
    function incDecFontSize(buttonId) {
        const amt = buttonId === 'fsize-smaller-button' ? -2 : 2
        controls.fsize += amt
        divjot_html.style.fontSize = controls.fsize + "pt";
        divjot_css.style.fontSize = controls.fsize + "pt";
        divjot_js.style.fontSize = controls.fsize + "pt";
    }

    // Switch to dark UI colors.
    function toggleLightDarkMode() {
        const switchedColors = UI.darkMode ? UI.colorModes.light : UI.colorModes.dark
        controls.toggleLightDarkButton.innerText = UI.darkMode ? " dark " : " light "

        divjot_wrapper.style.backgroundColor = switchedColors.bg
        menu.top_ui_section.style.color = switchedColors.fg

        UI.darkMode = !UI.darkMode
    }

    // Append new JS or CSS file resource to <head>.
    function divjot_import(filepath) {
        error_msg = `Error calling divjot_import ${filepath}. Please check the file path and try again.`;

        if (!filepath)
            throw error_msg;

        const head =  document.getElementsByTagName('head')[0];
        const f_length = filepath.length;

        // Does file name end with '.js' extension?
        if (filepath.slice(-3, f_length) === '.js') {
            script = document.createElement('script');
            script.setAttribute('src', filepath);
            head.appendChild(script);
        }
        // Or does file name end with '.css' extension?
        else if (filepath.slice(-4, f_length) == '.css') {
            stylesheet = document.createElement('link');
            stylesheet.setAttribute('rel', "stylesheet");
            stylesheet.setAttribute('href', filepath);
            head.appendChild(stylesheet);
        }
        else
            throw error_msg;
    }

    // Load local file and read - for loading local html files
    // or other content file into the html editor.

    function get_user_file(file, onLoadCallback) {
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsText(file);
    }

    /* UI Events */

    // Global Document events for divjot hotkeys.
    // alt + space opens and closes editors.

    window.document.addEventListener('keydown', function(key) {
        if (key.which === 32 && key.altKey) {
            openclose_editors();
        }
    }, false);

    /* User code I/O event triggers. */

    divjot_html.addEventListener('keyup' || 'keypress', outputs.markup_out, false);

    divjot_css.addEventListener('keyup' || 'keypress', outputs.style_out, false);

    /* UI Control button event listeners */

    controls.opacity.addEventListener('input', function() {
        divjot_wrapper.style.opacity = controls.opacity.value; }, false);


    controls.fsmaller.addEventListener('click', e => incDecFontSize(e.target.id), false);
    controls.fbigger.addEventListener('click', e => incDecFontSize(e.target.id), false);

    controls.toggleLightDarkButton.addEventListener('click', toggleLightDarkMode, false);

    controls.html.addEventListener('click', () => toggle(divjot_html), false)

    controls.css.addEventListener('click', () => toggle(divjot_css), false)

    controls.js.addEventListener('click', () => toggle(divjot_js), false)

    controls.run.addEventListener('click', () => outputs.js_out(), false)

    controls.export.addEventListener('click', () => outputs.exportOut(), false)

    /* Menu UI event listeners */

    // New file input event. Assign file content,
    // and then append to divjot_html editor.

    menu.user_fileinput.addEventListener('change', function(e) {

        get_user_file(this.files[0], function(e) {
            divjot_html.userfile = e.target.result;
            divjot_html.value += divjot_html.userfile;
            outputs.markup_out();
        });
    });

    // Import field listener

    menu.import_button.addEventListener('click', function(key) {
        pathvalue = menu.import_fileinput.value;

        if (pathvalue.length > 0) {
            divjot_import(pathvalue);
            menu.imported_list.push(pathvalue);
            menu.import_fileinput.value = "";
        }

    }, false);

}());

