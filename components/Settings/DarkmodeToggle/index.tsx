import { useSettings } from "@/hooks/redux/useSettings";


export const DarkmodeToggle = () => {
    const { isDarkMode, toggleDarkMode } = useSettings();
}