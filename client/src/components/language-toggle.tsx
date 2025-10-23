import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    // Cycle through: en -> id -> ar -> en
    if (language === "en") {
      setLanguage("id");
    } else if (language === "id") {
      setLanguage("ar");
    } else {
      setLanguage("en");
    }
  };

  const getButtonText = () => {
    switch (language) {
      case "en":
        return "Bahasa";
      case "id":
        return "العربية";
      case "ar":
        return "English";
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
