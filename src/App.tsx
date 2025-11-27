import { useState, useRef, useEffect } from 'react';
import { ArrowRight, User, FolderKanban, Sparkles, Palette, Phone, Info, ExternalLink, Github, Star } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isAboutMe?: boolean;
  isProjects?: boolean;
}

interface Project {
  name: string;
  description: string;
  url: string;
  tech: string[];
  color: string;
}

const projects: Project[] = [
  {
    name: 'Production Flask',
    description: 'A production-ready Flask application with best practices, scalable architecture, and modern deployment strategies.',
    url: 'https://github.com/Solved-Overnight/production-flask',
    tech: ['Python', 'Flask', 'Docker', 'PostgreSQL'],
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'ToolsHub',
    description: 'A centralized hub for developer tools and utilities, streamlining workflows and boosting productivity.',
    url: 'https://github.com/Solved-Overnight/toolsHub',
    tech: ['JavaScript', 'React', 'Node.js', 'API'],
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'WebHarvester AI',
    description: 'An intelligent web scraping tool powered by AI to extract and process data from websites efficiently.',
    url: 'https://github.com/Solved-Overnight/WebHarvester-AI',
    tech: ['Python', 'AI/ML', 'Selenium', 'BeautifulSoup'],
    color: 'from-orange-500 to-red-500'
  },
  {
    name: 'Arvana Clothing',
    description: 'A modern e-commerce platform for clothing with seamless user experience and inventory management.',
    url: 'https://github.com/Solved-Overnight/arvana-clothing',
    tech: ['React', 'TypeScript', 'E-commerce', 'Stripe'],
    color: 'from-pink-500 to-rose-500'
  }
];

const aiResponses = [
  "I'm Raph, a full-stack developer specializing in AI. I'm 21 years old and currently based in Paris, France. I work at LightOn AI where I get to work on some super cool AI projects!",
  "I'm really passionate about AI, tech, and entrepreneurship. I love building SaaS products and exploring new technologies. What specifically interests you?",
  "I started my journey as a competitive mountain biker, but now I'm all about coding and innovation. The transition has been amazing!",
  "At LightOn AI, I've been working on some fascinating projects involving AI and machine learning. It's been an incredible learning experience.",
  "I'm interested in AI, Developer tools, working at 42 Paris, and sports. Feel free to ask me about any of these topics!",
];

function HomePage({ onStartChat }: { onStartChat: () => void }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
            <div className="w-3 h-3 bg-white" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          </div>
          <span className="text-sm font-medium">Build your AI portfolio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="w-16 h-16 mb-8 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="black"/>
            <path d="M2 17L12 22L22 17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <p className="text-lg text-gray-600 mb-2">Hey, I'm Raphael 👋</p>

        <h1 className="text-7xl font-bold mb-12 text-center">AI Portfolio</h1>

        <div className="w-64 h-64 mb-12 rounded-full overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-8xl">👨</div>
        </div>

        <div className="w-full max-w-2xl mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="w-full px-6 py-4 pr-14 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && onStartChat()}
            />
            <button onClick={onStartChat} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={onStartChat} className="flex flex-col items-center gap-2 px-8 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors min-w-[100px]">
            <User className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">Me</span>
          </button>

          <button onClick={onStartChat} className="flex flex-col items-center gap-2 px-8 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors min-w-[100px]">
            <FolderKanban className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">Projects</span>
          </button>

          <button className="flex flex-col items-center gap-2 px-8 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors min-w-[100px]">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium">Skills</span>
          </button>

          <button className="flex flex-col items-center gap-2 px-8 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors min-w-[100px]">
            <Palette className="w-5 h-5 text-pink-500" />
            <span className="text-sm font-medium">Fun</span>
          </button>

          <button className="flex flex-col items-center gap-2 px-8 py-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors min-w-[100px]">
            <Phone className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium">Contact</span>
          </button>
        </div>
      </main>
    </div>
  );
}

function ChatPage({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getAIResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('who are you') ||
        lowerInput.includes('about you') ||
        lowerInput.includes('tell me about yourself') ||
        lowerInput.includes('know more about you') ||
        lowerInput.includes('about me') ||
        lowerInput === 'me') {
      return { text: '', isAboutMe: true, isProjects: false };
    }

    if (lowerInput.includes('project') ||
        lowerInput.includes('work') ||
        lowerInput.includes('portfolio') ||
        lowerInput.includes('github') ||
        lowerInput.includes('built') ||
        lowerInput.includes('created')) {
      return { text: '', isAboutMe: false, isProjects: true };
    }

    return { text: aiResponses[Math.floor(Math.random() * aiResponses.length)], isAboutMe: false, isProjects: false };
  };

  const handleSendMessage = async (quickQuestion?: string) => {
    const messageText = quickQuestion || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const response = getAIResponse(messageText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'ai',
        timestamp: new Date(),
        isAboutMe: response.isAboutMe,
        isProjects: response.isProjects,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="p-6 flex items-center justify-between sticky top-0 z-10 bg-white" style={{
        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 80%, rgba(255, 255, 255, 0) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
            <div className="w-3 h-3 bg-white" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          </div>
          <span className="text-sm font-medium">Build your AI portfolio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
          <Info className="w-6 h-6" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 pb-32">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-b from-blue-100 to-blue-50 flex items-center justify-center mb-6">
                <div className="text-6xl">👨</div>
              </div>
              <h2 className="text-2xl font-bold mb-4">Raphael Giraud</h2>
              <p className="text-gray-600 mb-6 text-center">21 years old • Paris, France</p>
              <div className="text-center mb-8">
                <p className="text-gray-700 mb-4">Hey 👋</p>
                <p className="text-gray-700 mb-4">
                  I'm Raph also known as Toukoum. I'm a developer specializing in AI at 42 Paris. I'm working at LightOn AI in Paris. I'm passionate about AI, tech, Entrepreneurship and SaaS tech.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">AI</span>
                <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">Developer</span>
                <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">42 Paris</span>
                <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">Sport</span>
                <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">SaaS Builder</span>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 w-full max-w-2xl">
                <p className="text-gray-700 leading-relaxed">
                  I'm Raphael Giraud, a 21-year-old full-stack developer specializing in AI, currently rocking it at 42 Paris. Before diving into the tech world, I was a competitive mountain biker, but now I'm all about coding and innovation! ✨ I recently interned at LightOn AI in Paris, where I got to work on some super cool AI projects.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  I'm really passionate about AI, tech, and entrepreneurship. What about you? What brings you here? 😊
                </p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-6 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.isProjects && message.sender === 'ai' ? (
                <div className="w-full max-w-4xl py-6">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                      <Github className="w-8 h-8" />
                      My Projects
                    </h2>
                    <p className="text-gray-600">Here are some of the projects I've been working on</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project, index) => (
                      <a
                        key={index}
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                      >
                        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${project.color}`}></div>

                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                            {project.name.charAt(0)}
                          </div>
                          <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors" />
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{project.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <Github className="w-4 h-4" />
                            <span>View on GitHub</span>
                          </div>
                          <Star className="w-4 h-4 text-gray-400 group-hover:text-yellow-500 transition-colors" />
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <a
                      href="https://github.com/Solved-Overnight"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                    >
                      <Github className="w-5 h-5" />
                      View all projects on GitHub
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : message.isAboutMe && message.sender === 'ai' ? (
                <div className="w-full max-w-4xl py-6">
                  <div className="flex gap-8 mb-8">
                    <div className="flex-shrink-0">
                      <div className="w-48 h-48 rounded-lg overflow-hidden bg-gradient-to-b from-blue-100 to-blue-50">
                        <div className="w-full h-full flex items-center justify-center text-9xl">👨</div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="mb-4">
                        <h2 className="text-3xl font-bold mb-2">Raphael Giraud</h2>
                        <div className="flex items-center gap-3 text-gray-600">
                          <span>21 years old</span>
                          <span>•</span>
                          <span>Paris, France</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <p className="text-gray-700 mb-3">Hey 👋</p>
                        <p className="text-gray-700 leading-relaxed">
                          I'm Raph also known as Toukoum. I'm a developer specializing in AI at 42 Paris. I'm working at LightOn AI in Paris. I'm passionate about AI, tech, Entrepreneurship and SaaS tech.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium">AI</span>
                        <span className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium">Developer</span>
                        <span className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium">42 Paris</span>
                        <span className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium">Sport</span>
                        <span className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium">SaaS Builder</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 w-full">
                    <p className="text-gray-700 leading-relaxed">
                      I'm Raphael Giraud, a 21-year-old full-stack developer specializing in AI, currently rocking it at 42 Paris. Before diving into the tech world, I was a competitive mountain biker! Now, I'm interning at LightOn AI in Paris, where I get to play with some cool AI stuff. I'm super passionate about tech, entrepreneurship, and building SaaS products. Voilà! What about you? What brings you here? 😊
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={`max-w-2xl px-6 py-4 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed">{message.text}</p>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="mb-6 flex justify-start">
              <div className="bg-gray-100 px-6 py-4 rounded-lg rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white" style={{
        background: 'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 80%, rgba(255, 255, 255, 0) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowQuickQuestions(!showQuickQuestions)}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-2"
            >
              {showQuickQuestions ? '▼' : '▶'}
              <span>{showQuickQuestions ? 'Hide' : 'Show'} quick questions</span>
            </button>
          </div>

          <div className={`flex gap-3 mb-6 justify-center transition-all duration-500 ease-in-out overflow-hidden flex-wrap ${
            showQuickQuestions ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <button onClick={() => handleSendMessage('Who are you? I want to know more about you.')} className="group flex flex-row items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:border-gray-300">
              <div className="w-5 h-5 rounded-md bg-blue-50 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
                <User className="w-3 h-3 text-blue-500" />
              </div>
              <span className="text-xs font-medium whitespace-nowrap">Me</span>
            </button>
            <button onClick={() => handleSendMessage('Show me your projects')} className="group flex flex-row items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:border-gray-300">
              <div className="w-5 h-5 rounded-md bg-green-50 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
                <FolderKanban className="w-3 h-3 text-green-500" />
              </div>
              <span className="text-xs font-medium whitespace-nowrap">Projects</span>
            </button>
            <button className="group flex flex-row items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:border-gray-300">
              <div className="w-5 h-5 rounded-md bg-purple-50 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
                <Sparkles className="w-3 h-3 text-purple-500" />
              </div>
              <span className="text-xs font-medium whitespace-nowrap">Skills</span>
            </button>
            <button className="group flex flex-row items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:border-gray-300">
              <div className="w-5 h-5 rounded-md bg-pink-50 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
                <Palette className="w-3 h-3 text-pink-500" />
              </div>
              <span className="text-xs font-medium whitespace-nowrap">Fun</span>
            </button>
            <button className="group flex flex-row items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:border-gray-300">
              <div className="w-5 h-5 rounded-md bg-orange-50 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
                <Phone className="w-3 h-3 text-orange-500" />
              </div>
              <span className="text-xs font-medium whitespace-nowrap">Contact</span>
            </button>
            <button className="group flex items-center justify-center px-3 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:border-gray-300">
              <svg className="w-4 h-4 text-gray-600 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
              </svg>
            </button>
          </div>

          <div className="relative mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything"
              className="w-full px-6 py-4 pr-14 rounded-xl border border-gray-200 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">Powered by Fastfolio</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isInChat, setIsInChat] = useState(false);

  return (
    <>
      {isInChat ? (
        <ChatPage onBack={() => setIsInChat(false)} />
      ) : (
        <HomePage onStartChat={() => setIsInChat(true)} />
      )}
    </>
  );
}

export default App;
