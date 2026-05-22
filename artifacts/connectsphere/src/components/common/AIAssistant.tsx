import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const mockResponses: Record<string, string> = {
  default: "I'm ConnectAI, your intelligent workplace assistant. I can help you find colleagues, summarize announcements, suggest events, surface relevant knowledge articles, and more. What can I help you with today?",
  help: "Here's what I can do:\n\n• Find employees by skill, team, or location\n• Summarize recent announcements\n• Show you upcoming events\n• Surface relevant knowledge articles\n• Help draft messages and recognitions\n• Analyze your engagement score",
  announce: "The top announcements right now are:\n\n1. ConnectSphere closes $120M Series C — Sarah Chen\n2. Q2 All-Hands on May 28th — Michael Torres\n3. New Health Benefits effective June 1st — HR Team\n\nWould you like me to summarize any of these?",
  event: "Upcoming events this week:\n\n• May 28 — Q2 All-Hands (2PM PT)\n• May 30 — 5th Anniversary Celebration (6PM)\n• May 31 — New Joiners Happy Hour (5PM)\n\nWant me to add any of these to your calendar?",
  recognition: "To send a recognition, go to the Recognition page and click 'Appreciate a Colleague'. You can award badges like Innovator, Team Player, or Leader. Your peers really appreciate the kind words!",
  colleague: "I found several people who might be helpful. Alex Rivera is a Senior Engineer with React and TypeScript expertise. For design work, Emma Larsson or Andre Dubois would be great. Who specifically are you looking for?",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('help') || lower.includes('what can')) return mockResponses.help;
  if (lower.includes('announc')) return mockResponses.announce;
  if (lower.includes('event') || lower.includes('calendar')) return mockResponses.event;
  if (lower.includes('recogni') || lower.includes('appreciat') || lower.includes('badge')) return mockResponses.recognition;
  if (lower.includes('colleague') || lower.includes('who') || lower.includes('find')) return mockResponses.colleague;
  return mockResponses.default;
}

const initialMessages: Message[] = [
  { id: '0', role: 'assistant', content: "Hi! I'm ConnectAI. Ask me anything about your workplace — colleagues, events, announcements, or knowledge articles.", time: 'now' }
];

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, time: 'now' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = getResponse(input);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: response, time: 'now' };
      setMessages(prev => [...prev, aiMsg]);
      setTyping(false);
    }, 800 + Math.random() * 600);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] max-w-sm bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            style={{ height: 440 }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">ConnectAI</p>
                  <p className="text-xs text-white/70">Your intelligent workplace assistant</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-7 w-7" onClick={() => setOpen(false)} data-testid="button-minimize-ai">
                  <Minimize2 size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-7 w-7" onClick={() => setOpen(false)} data-testid="button-close-ai">
                  <X size={14} />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-background/50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot size={14} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted text-foreground rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} className="text-white" />
                  </div>
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 pb-3 pt-2 border-t border-border bg-card">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask anything..."
                  className="text-sm h-9"
                  data-testid="input-ai-chat"
                />
                <Button size="icon" className="h-9 w-9 flex-shrink-0" onClick={sendMessage} data-testid="button-send-ai">
                  <Send size={14} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(v => !v)}
        data-testid="button-open-ai"
      >
        <Sparkles size={20} />
      </motion.button>
    </>
  );
}
