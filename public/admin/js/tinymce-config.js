function initTinyMCE(isDarkMode) {
    tinymce.init({
        selector: 'textarea.textarea-mce',
        plugins: "image",
        skin: isDarkMode ? 'oxide-dark' : 'oxide',
        content_css: isDarkMode ? 'dark' : 'default',
    });
}

let isDarkMode = document.documentElement.classList.contains('dark');

document.addEventListener('DOMContentLoaded', function () {
    initTinyMCE(isDarkMode);

    document.getElementById('theme-toggle').addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        tinymce.remove();
        initTinyMCE(isDarkMode);
    });
})
