class ThemeHandlerClass {
    isDark(){
        return this.currentTheme() == "dark";
    }
    currentTheme(){
        let theme = localStorage.getItem("theme");
        return theme ?? "light";
    }
    switchTo(theme){
        let to = document.querySelector(`[data-theme-style][title="${theme}"]`);
        if (!to){return}
        to.disabled = false;

        let styles = document.querySelectorAll(`[data-theme-style]:not([title="${theme}"])`);
        for (let s of styles){
            s.disabled = true;
        }
        localStorage.setItem("theme", theme);
    }
    toggleDarkMode(){
        if (this.isDark()){
            this.switchTo("light");
        } else {
            this.switchTo("dark");
        }
    }
}

let ThemeHandler = new ThemeHandlerClass();
ThemeHandler.switchTo(ThemeHandler.currentTheme());

window.ThemeHandler = ThemeHandler;

export default ThemeHandler;