import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    // Cycle through: en -> id -> tr -> ar -> zh -> sw -> so -> bs -> sq -> ru -> en
    if (language === "en") {
      setLanguage("id");
    } else if (language === "id") {
      setLanguage("tr");
    } else if (language === "tr") {
      setLanguage("ar");
    } else if (language === "ar") {
      setLanguage("zh");
    } else if (language === "zh") {
      setLanguage("sw");
    } else if (language === "sw") {
      setLanguage("so");
    } else if (language === "so") {
      setLanguage("bs");
    } else if (language === "bs") {
      setLanguage("sq");
    } else if (language === "sq") {
      setLanguage("ru");
    } else {
      setLanguage("en");
    }
  };

  const getButtonText = () => {
    switch (language) {
      case "en":
        return "English";
      case "id":
        return "Bahasa";
      case "tr":
        return "Türkçe";
      case "ar":
        return "العربية";
      case "zh":
        return "中文";
      case "sw":
        return "Kiswahili";
      case "so":
        return "Soomaali";
      case "bs":
        return "Bosanski";
      case "sq":
        return "Shqip";
      case "ru":
        return "Русский";
      default:
        return "Language";
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
      data-testid="button-language-toggle"
    >
      <Languages className="h-4 w-4" />
      <span>{getButtonText()}</span>
    </Button>
  );
}
