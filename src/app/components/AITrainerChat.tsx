import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Bot, Send, Sparkles } from 'lucide-react';
import { authedFetch } from '/utils/supabase/info';

interface AITrainerChatProps {
  userId: string;
  userProfile: any;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AITrainerChat({ userId, userProfile }: AITrainerChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi ${userProfile.name}! I'm your AI fitness trainer. I can answer ANY fitness question - workouts, nutrition, form, recovery, and more. Ask me anything!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiSource, setAiSource] = useState<string>('');
  const quickQuestions = [
    'How to improve my bench press?',
    'Best post-workout meal?',
    'How much rest between sets?',
    'Tips for muscle recovery?',
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Call backend AI trainer API
      const response = await authedFetch(`/ai-trainer`, {
        method: 'POST',
        body: JSON.stringify({
          message: currentInput,
          userProfile: {
            goal: userProfile.goal,
            weight: userProfile.weight,
            activityLevel: userProfile.activityLevel,
            age: userProfile.age,
            gender: userProfile.gender,
          },
        }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        setAiSource(data.source);
      } else {
        throw new Error('Failed to get AI response');
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Fallback response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm having trouble connecting right now. Here's some general advice:\n\nFor ${userProfile.goal}:\n- Focus on progressive overload\n- Protein: ${Math.round(userProfile.weight * 2)}g/day\n- Sleep 7-9 hours\n- Train consistently\n\nPlease try again in a moment!`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Bot className="w-8 h-8 text-emerald-500" />
            AI Trainer
          </h1>
          <p className="text-stone-400">Ask me anything about fitness, form, or nutrition</p>
        </div>

        {/* Chat Container */}
        <Card
          className="bg-stone-900 border-stone-800 flex flex-col"
          style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-stone-800 text-white'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-emerald-400 font-medium">AI Trainer</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line">{message.content}</p>
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-stone-800 rounded-lg p-4">
                  <div className="flex gap-2">
                    <div
                      className="w-2 h-2 bg-stone-500 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-stone-500 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <div
                      className="w-2 h-2 bg-stone-500 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="px-6 py-3 border-t border-stone-800">
            <p className="text-xs text-stone-400 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="text-xs px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-stone-800">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything about fitness..."
                className="bg-stone-800 border-stone-700 text-white"
              />
              <Button
                onClick={sendMessage}
                className="bg-emerald-500 hover:bg-emerald-600"
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
