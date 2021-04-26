import GlobalState from "./globalState";

class ThemeHandlerClass {
    isDark(){
        return this.currentTheme() == "dark";
    }
    currentTheme(){
        let theme = localStorage.getItem("theme");
        return theme ?? "light";
    }
    switchTo(theme){
        document.body.classList.add("notransition");
        setDocumentBackgroundColor(theme);
        document.documentElement.dataset.theme = theme;
        GlobalState.theme = theme;
        let gradeColors = {
            light:{
                "5":"#43a047",
                "4":"#0074D9",
                "3":"#795548",
                "2":"#FF4136",
                "1":"#c62828",
                "other":"#607d8b",
            },
            dark: {
                "5":"#2ECC40",
                "4":"#0083f5",
                "3":"#c38169",
                "2":"#ff9036",
                "1":"#FF4136",
                "other":"#607d8b",
            }
        }
        Object.assign(GlobalState.gradeColors, gradeColors[theme]);
        document.body.offsetHeight;
        document.body.classList.remove("notransition");
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