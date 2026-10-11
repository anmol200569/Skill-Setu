import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2, ArrowRight } from 'lucide-react';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

export function AIChatDrawer() {
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Load initial chat welcome message
      const conv = `conv-${Date.now()}`;
      setConversationId(conv);
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Hi there! I'm your Skill Setu AI Mentor. I have your target role (${profile?.targetRoleName || 'Target Career'}) and current skill assessments in my context. What would you like to explore today?`
        }
      ]);
    }
  }, [isOpen, profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await apiClient<{ conversationId: string; message: { id: string; content: string } }>('/assistant/chat', {
        method: 'POST',
        body: JSON.stringify({
          conversationId,
          message: textToSend
        })
      });

      if (res?.conversationId) setConversationId(res.conversationId);

      setMessages((prev) => [
        ...prev,
        {
          id: res.message.id,
          role: 'assistant',
          content: res.message.content
        }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Error: ${err.message || 'Could not connect to AI service. Please check your backend configuration.'}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'How do I bridge my highest priority skill gap?',
    'Explain the difference between TypeScript unknown and any',
    'Suggest a practical portfolio project for my target role'
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#C2410C] px-4 py-3 text-white shadow-lg hover:bg-[#9A3412] active:scale-95 transition-all"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-semibold">Ask AI Mentor</span>
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] max-w-md h-[560px] rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-full bg-[#C2410C]/10 text-[#C2410C]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-foreground">Skill Setu AI Mentor</h4>
                <p className="text-[11px] text-muted-foreground">
                  Context: {profile?.targetRoleName || 'Target Career'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-[#C2410C]/15 text-[#C2410C] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`rounded-xl px-3.5 py-2.5 max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#C2410C] text-white'
                      : 'bg-secondary text-secondary-foreground border border-border whitespace-pre-wrap'
                  }`}
                >
                  {m.content}
                </div>
                {m.role === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-6 h-6 rounded-full bg-[#C2410C]/15 text-[#C2410C] flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="rounded-xl px-3.5 py-2 bg-secondary border border-border flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Consulting skill intelligence models...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt suggestions if few messages */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 border-t border-border/50 bg-secondary/20 flex flex-col gap-1 text-[11px]">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Quick queries</span>
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="text-left text-foreground/80 hover:text-[#C2410C] flex items-center justify-between py-0.5 truncate"
                >
                  <span className="truncate">{q}</span>
                  <ArrowRight className="w-3 h-3 flex-shrink-0 ml-1 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-border bg-card flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your skill gaps or concepts..."
              disabled={isLoading}
              className="flex-1 bg-secondary rounded-lg px-3 py-2 text-xs border border-border focus:outline-none focus:ring-1 focus:ring-[#C2410C]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-lg bg-[#C2410C] text-white hover:bg-[#9A3412] disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
