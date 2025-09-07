import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { useSpeech } from "@/hooks/use-speech";

interface AudioButtonProps {
  text: string;
  lang?: string;
  size?: "sm" | "default" | "lg";
  variant?: "ghost" | "outline" | "default";
  className?: string;
}

export default function AudioButton({ 
  text, 
  lang = "ar-SA", 
  size = "sm", 
  variant = "ghost",
  className = ""
}: AudioButtonProps) {
  const { speak, stop, isSpeaking, isSupported } = useSpeech();

  const handleClick = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text, { lang });
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
      data-testid="button-audio"
      disabled={!text}
    >
      {isSpeaking ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      <span className="sr-only">
        {isSpeaking ? "Stop audio" : "Play audio"}
      </span>
    </Button>
  );
}
