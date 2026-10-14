import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Send, Bot, User, Loader2, ArrowRight, RotateCcw, Compass } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
  isError?: boolean;
  retryMessage?: string;
  noRole?: boolean;
}

export function AIChatDrawer() {
  const { profile } = useAuth();
  const navigate = useNavigate();
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
      const roleName = profile?.targetRoleName;
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: roleName
            ? `Hi there! I'm your Skill Setu AI Mentor. I have your target role (${roleName}) and current skill assessments in my context. What would you like to explore today?`
            : `Hi there! I'm your Skill Setu AI Mentor. Pick a target role first so I can tailor mentoring and study recommendations to your career goals.`,
          noRole: !roleName
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

    const controller = new AbortController();
    const timeoutTimer = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const res = await apiClient<{
        conversationId: string;
        noRole?: boolean;
        degraded?: boolean;
        message: { id: string; content: string };
      }>('/assistant/chat', {
        method: 'POST',
        signal: controller.signal,
        body: JSON.stringify({
          conversationId,
          message: textToSend
        })
      });
      clearTimeout(timeoutTimer);

      if (res?.conversationId) setConversationId(res.conversationId);

      setMessages((prev) => [
        ...prev,
        {
          id: res.message.id,
          role: 'assistant',
          content: res.message.content,
          noRole: res.noRole
        }
      ]);
    } catch (err: any) {
      clearTimeout(timeoutTimer);
      const isTimeout =
        err?.name === 'AbortError' ||
        err?.message?.toLowerCase().includes('abort') ||
        err?.message?.toLowerCase().includes('timed out') ||
        err?.message?.toLowerCase().includes('timeout');
      const is429 = err?.status === 429 || err?.statusCode === 429 || err?.message?.includes('429');
      const is503 = err?.status === 503 || err?.statusCode === 503 || err?.message?.includes('503') || err?.degraded;

      const friendlyMessage = is429
        ? 'The AI Mentor is currently busy due to high demand. Please try again in a moment.'
        : isTimeout
        ? 'Request timed out after 15 seconds. Please try asking again.'
        : is503
        ? 'The AI Mentor service is temporarily unavailable. Please retry in a moment.'
        : 'Could not connect to the AI Mentor service. Please check your network and retry.';

      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: friendlyMessage,
          isError: true,
          retryMessage: textToSend
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
          className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-3 sm:px-5 sm:py-3 text-white shadow-[0_8px_25px_rgba(37,99,235,0.4)] border border-white/30 hover:shadow-[0_12px_32px_rgba(37,99,235,0.55)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all"
          aria-label="Ask AI Mentor"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline text-sm font-semibold tracking-wide">Ask AI Mentor</span>
        </button>
      )}

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 w-[92vw] max-w-md h-[560px] rounded-3xl border border-white/20 dark:border-white/10 bg-card/95 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-sans font-bold text-foreground">Skill Setu AI Mentor</h4>
                <p className="text-[11px] text-muted-foreground">
                  Context: {profile?.targetRoleName || 'Role Not Selected'}
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
                  <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20 whitespace-pre-wrap'
                      : m.isError
                      ? 'bg-destructive/10 text-destructive border border-destructive/30 whitespace-pre-wrap'
                      : 'bg-secondary text-secondary-foreground border border-border'
                  }`}
                >
                  {m.role === 'assistant' && !m.isError ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words text-xs sm:text-sm [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:list-disc [&>ul]:pl-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-4 [&>ol]:mb-2 [&>pre]:bg-background/80 [&>pre]:p-2 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>code]:bg-background/60 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div>{m.content}</div>
                  )}
                  {m.isError && m.retryMessage && (
                    <button
                      type="button"
                      onClick={() => handleSend(m.retryMessage)}
                      className="mt-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                  )}
                  {m.noRole && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/dashboard');
                      }}
                      className="mt-2 text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5 transition-colors"
                    >
                      <Compass className="w-3 h-3" />
                      <span>Pick Target Role</span>
                    </button>
                  )}
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
                <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="rounded-xl px-3.5 py-2 bg-secondary border border-border flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
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
                  className="text-left text-foreground/80 hover:text-blue-600 flex items-center justify-between py-0.5 truncate"
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
              className="flex-1 bg-secondary rounded-xl px-3.5 py-2 text-xs border border-border focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
