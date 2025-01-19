import {create} from "zustand"

const themeStore = (set)=>({
    theme:localStorage.getItem("chat-theme") || "black",
    setTheme:(theme)=>{
        localStorage.setItem("chat-theme",theme)
        set({theme})
    }
    
})
const useThemeStore = create(themeStore);
export default useThemeStore;