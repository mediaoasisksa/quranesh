import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/language-context";
import logoImage from "@assets/quranesh logo (1)_1762444380395.png";
import {
  ArrowLeft,
  Send,
  Users,
  MessageCircle,
  Globe,
  ChevronDown,
  Languages,
} from "lucide-react";
import type { ChatMessage } from "@shared/schema";

interface ChatRoom {
  id: string;
  name: string;
  lang: string;
  flag: string;
  code: string;
}

const ROOM_DESCRIPTIONS: Record<string, string> = {
  english: "Practice Arabic-English conversations about Quranic topics",
  french: "Pratiquez les conversations arabe-français sur les sujets coraniques",
  indonesian: "Berlatih percakapan Arab-Indonesia tentang topik Al-Quran",
  urdu: "قرآنی موضوعات پر عربی-اردو گفتگو کی مشق کریں",
  turkish: "Kur'an konularında Arapça-Türkçe konuşma pratiği yapın",
  russian: "Практикуйте арабско-русские разговоры на коранические темы",
  spanish: "Practica conversaciones árabe-español sobre temas coránicos",
  bengali: "কুরআনিক বিষয়ে আরবি-বাংলা কথোপকথন অনুশীলন করুন",
  hindi: "कुरआनी विषयों पर अरबी-हिंदी बातचीत का अभ्यास करें",
  german: "Üben Sie arabisch-deutsche Gespräche über koranische Themen",
  swahili: "Fanya mazoezi ya mazungumzo ya Kiarabu-Kiswahili kuhusu mada za Qurani",
};

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/signin");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated || !user) return null;

  if (selectedRoom) {
    return (
      <ChatRoom
        roomId={selectedRoom}
        user={user}
        onBack={() => setSelectedRoom(null)}
      />
    );
  }

  return <ChatLobby onSelectRoom={setSelectedRoom} />;
}

function ChatLobby({ onSelectRoom }: { onSelectRoom: (id: string) => void }) {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    fetch("/api/chat/rooms")
      .then((r) => r.json())
      .then(setRooms)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-emerald-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setLocation("/dashboard")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">{t("backToDashboard") || "Back"}</span>
          </button>
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Quranesh" className="h-8" />
            <h1 className="text-lg font-bold text-emerald-800">Global Quranic Chat</h1>
          </div>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full mb-4">
            <Globe className="w-5 h-5" />
            <span className="font-medium">11 Language Rooms</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connect with Quran learners worldwide
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Join a room in your language. Messages are automatically translated between Arabic and your language using AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] border-2 hover:border-emerald-300"
              onClick={() => onSelectRoom(room.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{room.flag}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{room.name}</h3>
                    <p className="text-sm text-emerald-600 font-medium">{room.lang}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {ROOM_DESCRIPTIONS[room.id] || "Practice Arabic conversations"}
                    </p>
                  </div>
                  <MessageCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <Languages className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">How Translation Works</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>Type in <strong>Arabic</strong> → AI translates to the room's language</li>
                <li>Type in the <strong>room's language</strong> → AI translates to Arabic</li>
                <li>See both the translation and the original text to learn</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChatRoom({
  roomId,
  user,
  onBack,
}: {
  roomId: string;
  user: { id: string; firstName: string; lastName: string };
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [showOriginal, setShowOriginal] = useState<Record<string, boolean>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    fetch("/api/chat/rooms")
      .then((r) => r.json())
      .then((rooms: ChatRoom[]) => {
        const found = rooms.find((r) => r.id === roomId);
        if (found) setRoom(found);
      })
      .catch(() => {});
  }, [roomId]);

  useEffect(() => {
    const socket = io({
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_room", {
        roomId,
        userName: `${user.firstName} ${user.lastName}`,
        userId: user.id,
      });
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("message_history", (history: ChatMessage[]) => {
      setMessages(history);
      setTimeout(scrollToBottom, 100);
    });

    socket.on("new_message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
      setIsSending(false);
      setTimeout(scrollToBottom, 100);
    });

    socket.on("user_count", (data: { count: number }) => {
      setUserCount(data.count);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, user, scrollToBottom]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !socketRef.current || isSending) return;
    setIsSending(true);
    socketRef.current.emit("send_message", { text });
    setInput("");
    inputRef.current?.focus();
  };

  const toggleOriginal = (id: string) => {
    setShowOriginal((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isMyMessage = (msg: ChatMessage) => msg.userId === user.id;

  const formatTime = (date: string | Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-emerald-700 text-white px-4 py-3 flex items-center gap-3 shadow-md flex-shrink-0">
        <button onClick={onBack} className="p-1 hover:bg-emerald-600 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">{room?.flag}</span>
            <h2 className="font-semibold truncate">{room?.name || roomId}</h2>
          </div>
          <div className="flex items-center gap-2 text-emerald-200 text-xs">
            <Users className="w-3 h-3" />
            <span>{userCount} online</span>
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`} />
          </div>
        </div>
        <img src={logoImage} alt="Quranesh" className="h-8 opacity-80" />
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3" id="chat-messages">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No messages yet</p>
            <p className="text-sm">Be the first to start a conversation!</p>
          </div>
        )}

        {messages.map((msg) => {
          const mine = isMyMessage(msg);
          const hasTranslation = msg.translatedText && msg.translatedText !== msg.originalText;
          const showing = showOriginal[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm ${
                  mine
                    ? "bg-emerald-600 text-white rounded-br-md"
                    : "bg-white text-gray-900 rounded-bl-md border"
                }`}
              >
                {!mine && (
                  <p className={`text-xs font-semibold mb-1 ${mine ? "text-emerald-200" : "text-emerald-700"}`}>
                    {msg.userName}
                  </p>
                )}

                <p className={`text-[15px] leading-relaxed ${
                  hasTranslation && msg.targetLang === "Arabic" ? "font-amiri text-right" : ""
                }`} dir={hasTranslation && msg.targetLang === "Arabic" ? "rtl" : "ltr"}>
                  {hasTranslation ? msg.translatedText : msg.originalText}
                </p>

                {hasTranslation && (
                  <button
                    onClick={() => toggleOriginal(msg.id)}
                    className={`text-xs mt-1.5 flex items-center gap-1 ${
                      mine ? "text-emerald-200 hover:text-white" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <ChevronDown className={`w-3 h-3 transition-transform ${showing ? "rotate-180" : ""}`} />
                    {showing ? "Hide original" : "Show original"}
                  </button>
                )}

                {hasTranslation && showing && (
                  <p className={`text-xs mt-1 pt-1.5 border-t ${
                    mine ? "border-emerald-500 text-emerald-200" : "border-gray-200 text-gray-500"
                  } ${msg.originalLang === "Arabic" ? "font-amiri text-right" : ""}`}
                    dir={msg.originalLang === "Arabic" ? "rtl" : "ltr"}
                  >
                    {msg.originalText}
                  </p>
                )}

                <p className={`text-[10px] mt-1 ${mine ? "text-emerald-300" : "text-gray-400"} text-right`}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t px-3 py-3 flex-shrink-0">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder={`Type in ${room?.lang || "any language"} or Arabic...`}
            className="flex-1 rounded-full border-gray-300 focus:border-emerald-500"
            disabled={!isConnected}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || !isConnected || isSending}
            className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-4"
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!isConnected && (
          <p className="text-center text-xs text-red-500 mt-1">Connecting...</p>
        )}
      </div>
    </div>
  );
}
