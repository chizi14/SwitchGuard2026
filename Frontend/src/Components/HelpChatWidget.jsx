import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { chatQuery } from "../api";

const greetings = {
  en: "Hello! Ask me anything about SwitchGuard — dispense errors, card blocking, USSD, and more.",
  ch: "Moni! Funsirani chimodzi chilichonse cha SwitchGuard — dispense error, kutsekera kadi, USSD, ndi zina.",
};

const fallbackMessages = {
  en: "I'm not sure about that yet — try Contact Support for help from our team.",
  ch: "Sindine woyimira kale — yesetsani Contact Support kuti mupeze thandizo kuchoka kwa ife.",
};

const fallbackLabels = {
  en: "Contact Support",
  ch: "Limbitsani Thandizo",
};

export default function HelpChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "bot", text: greetings.en }]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSetLanguage = (next) => {
    setLanguage(next);
    setMessages((msgs) => {
      if (msgs.length === 1 && msgs[0].role === "bot") {
        return [{ role: "bot", text: greetings[next] }];
      }
      return msgs;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMessage = { role: "user", text: trimmed };
    let answer = fallbackMessages[language];
    let isFallback = true;

    try {
      const result = await chatQuery(trimmed, language);
      answer = result.answer;
      isFallback = result.isFallback;
    } catch {
      // fallback already set
    }

    const botMessage = {
      role: "bot",
      text: answer || fallbackMessages[language],
      isFallback: isFallback,
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInputValue("");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-on-surface/20 sm:bg-transparent"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {isOpen && (
        <div
          role="dialog"
          aria-label="Help chat"
          className="fixed bottom-44 lg:bottom-24 right-5 z-50 w-[calc(100%-2.5rem)] sm:w-96 max-h-[70vh] flex flex-col rounded-lg border border-outline-variant bg-surface-lowest shadow-soft-hover overflow-hidden"
        >
          <div className="flex items-center justify-between gap-3 border-b border-outline-variant px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSetLanguage("en")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  language === "en"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleSetLanguage("ch")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  language === "ch"
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                Chichewa
              </button>
            </div>
            <button
              type="button"
              aria-label="Close chat"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-lowest text-on-surface-variant transition-colors hover:bg-surface-container focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-lowest"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-6 ${
                    msg.role === "user"
                      ? "bg-primary text-on-primary ml-8"
                      : "bg-surface-container text-on-surface mr-8"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.isFallback && (
                    <Link
                      to="/contact-support"
                      onClick={() => setIsOpen(false)}
                      className="mt-2 inline-block text-xs font-semibold underline text-on-surface-variant"
                    >
                      {fallbackLabels[language]}
                    </Link>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-outline-variant p-3 flex gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={language === "en" ? "Type your question..." : "Lembani funso lanu..."}
              className="flex-1 h-10 px-3 rounded border border-outline-variant bg-surface-low text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              aria-label={language === "en" ? "Send message" : "Tumiza uthenga"}
              className="h-10 w-10 shrink-0 inline-flex items-center justify-center rounded bg-primary text-on-primary transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow-soft"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        aria-label="Open help chat"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-24 lg:bottom-6 right-5 z-40 h-14 w-14 rounded-full flex items-center justify-center shadow-soft-hover transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          isOpen
            ? "bg-surface-high text-on-surface rotate-0"
            : "bg-primary text-on-primary hover:opacity-90"
        }`}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}
