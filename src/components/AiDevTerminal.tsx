import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  badge?: string;
  code?: string;
  links?: { label: string; url: string; external?: boolean }[];
  timestamp: string;
}

const PRESET_QUERIES = [
  {
    label: "⚡ Full-Stack + AI Profile",
    prompt: "Give me an executive overview of Abdellah's background in Full-Stack Dev and AI."
  },
  {
    label: "🧠 Applied AI & RAG Approach",
    prompt: "How does Abdellah build and integrate AI, LLMs, and RAG systems with web applications?"
  },
  {
    label: "🛠️ Core Technical Stack",
    prompt: "What is Abdellah's core technology stack across backend, frontend, and data intelligence?"
  },
  {
    label: "📂 Top Projects & Case Studies",
    prompt: "What are Abdellah's standout projects and key architectural achievements?"
  },
  {
    label: "🎓 Verified AI & Data Certifications",
    prompt: "List Abdellah's official credentials and certifications from DataCamp and Almdrasa."
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'intro-1',
    sender: 'assistant',
    text: "Hello! I'm Abdellah's interactive AI & Engineering Assistant. I can walk you through his full-stack engineering architecture, applied AI & LLM implementations, production projects, and verified credentials.",
    badge: 'AI Core v2.4 · Online',
    timestamp: 'Just now'
  }
];

export default function AiDevTerminal() {
  const [mode, setMode] = useState<'chat' | 'cli'>('chat');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages container
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateAnswer = (query: string): Omit<Message, 'id' | 'timestamp'> => {
    const q = query.toLowerCase();

    if (q.includes('ai') || q.includes('rag') || q.includes('llm') || q.includes('machine learning')) {
      return {
        sender: 'assistant',
        badge: 'Applied AI & LLM Engineering',
        text: "Abdellah combines modern full-stack development with applied AI engineering. He specializes in connecting Python backend architectures to LLM APIs, vector stores, and automated data processing pipelines.",
        code: `# High-Level RAG & AI Agent Architecture Pipeline
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.vectorstores import PGVector
from django.db import models

class RAGQueryEngine:
    def __init__(self, embedding_model, vector_store):
        self.retriever = vector_store.as_retriever(search_kwargs={"k": 4})
        
    async def generate_grounded_response(self, user_query: str) -> dict:
        context_docs = await self.retriever.ainvoke(user_query)
        # Synthesize prompt with verifiable context
        return {"response": synthesized_text, "sources": context_docs}`,
        links: [
          { label: "View DataCamp AI Engineer Credential", url: "#certifications" },
          { label: "Check GitHub Repos", url: "https://github.com/Abdellah-BELMAARIS", external: true }
        ]
      };
    }

    if (q.includes('stack') || q.includes('tech') || q.includes('skill') || q.includes('python') || q.includes('django')) {
      return {
        sender: 'assistant',
        badge: 'Technical Capabilities',
        text: "Abdellah operates across four specialized disciplines:\n\n• Development: Python, Django, HTML, CSS, SQL, Django REST Framework, PostgreSQL, REST APIs.\n• Data: Pandas, Matplotlib, Data Analysis.\n• Computer Science: Algorithms, Data Structures, Software Engineering.\n• Exploring / Foundations: Artificial Intelligence, Cybersecurity Fundamentals.",
        links: [
          { label: "Browse Full Skills Matrix", url: "#skills" },
          { label: "The Modern Journal Case Study", url: "#project" }
        ]
      };
    }

    if (q.includes('project') || q.includes('work') || q.includes('arcade') || q.includes('journal')) {
      return {
        sender: 'assistant',
        badge: 'Production Showcase',
        text: "Abdellah has engineered several high-performance open-source systems:\n\n1. The Modern Journal: Full-featured Django CMS with RBAC, N+1 query optimization, custom search indexing, and automated transactional emails.\n2. PyGame 3D Web Arcade: Interactive 3D retro arcade cabinet hosting 16 WebAssembly-compiled Python games.\n3. Dev-Pulse: Automated local developer telemetry pipeline parsing log files and generating sub-200ms Matplotlib visual reports.",
        links: [
          { label: "Explore Featured Project", url: "#project" },
          { label: "Play PyGame 3D Arcade Live", url: "https://Abdellah-BELMAARIS.github.io/PyGame_Projects/", external: true }
        ]
      };
    }

    if (q.includes('cert') || q.includes('education') || q.includes('datacamp') || q.includes('degree')) {
      return {
        sender: 'assistant',
        badge: 'Verified Credentials',
        text: "Abdellah holds certified industry credentials:\n\n• AI Engineer for Developers Associate — DataCamp (ID: AIEDA0011678564836)\n• Python Data Associate — DataCamp (ID: PDA0019412806212)\n• Cybersecurity Fundamentals — Almdrasa (ID: 77F16BFF2A-77EB48CD64-1451D2521)\n• Associate Python Developer — 30 HR Django Developer Track",
        links: [
          { label: "View Certificates & IDs", url: "#certifications" }
        ]
      };
    }

    if (q.includes('bimpulse') || q.includes('company') || q.includes('experience') || q.includes('job')) {
      return {
        sender: 'assistant',
        badge: 'Work Experience',
        text: "Abdellah currently works as a Junior Full-Stack Developer at BIMPulse in Casablanca, Morocco.\n\nHe contributes to enterprise web applications, digital engineering tools adhering to IFC standards, database modeling, and performant backend services.",
        links: [
          { label: "View Experience Timeline", url: "#experience" },
          { label: "BIMPulse Profile", url: "#bimpulse" }
        ]
      };
    }

    if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('reach')) {
      return {
        sender: 'assistant',
        badge: 'Direct Connect',
        text: "You can reach Abdellah directly:\n\n• Email: obaidbelmaaris@gmail.com\n• Location: Casablanca, Morocco (Open to hybrid and remote roles worldwide)\n• LinkedIn: linkedin.com/in/abdellah-belmaaris\n• GitHub: github.com/Abdellah-BELMAARIS",
        links: [
          { label: "Open Contact Form", url: "#contact" },
          { label: "LinkedIn Profile", url: "https://linkedin.com/in/abdellah-belmaaris", external: true }
        ]
      };
    }

    // Default overview response
    return {
      sender: 'assistant',
      badge: 'Executive Summary',
      text: `Abdellah BELMAARIS is a Junior Full-Stack Developer & AI Systems Specialist based in Casablanca, Morocco. He bridges high-performance web backends (Python, Django REST Framework, PostgreSQL, React) with applied artificial intelligence (LLMs, RAG, DataCamp Certified AI Engineer Associate). Currently building software solutions at BIMPulse.`,
      links: [
        { label: "Download Resume (PDF)", url: "assets/Abdellah_BELMAARIS_CV.pdf" },
        { label: "Explore Case Studies", url: "#project" },
        { label: "Get in Touch", url: "#contact" }
      ]
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate intelligent streaming calculation
    setTimeout(() => {
      const answer = generateAnswer(text);
      const assistantMsg: Message = {
        ...answer,
        id: `assistant-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const lower = cmd.toLowerCase();

    if (lower === 'clear' || lower === 'cls') {
      setMessages([]);
      setInputVal('');
      return;
    }

    if (lower === 'help') {
      setMessages(prev => [
        ...prev,
        {
          id: `cmd-${Date.now()}`,
          sender: 'user',
          text: `$ ${cmd}`,
          timestamp: 'CLI'
        },
        {
          id: `resp-${Date.now()}`,
          sender: 'system',
          text: `Available commands:\n  • bio       - Executive summary & background\n  • ai        - Applied AI, LLM & RAG architecture\n  • stack     - Technologies, languages & frameworks\n  • projects  - Production apps & GitHub repositories\n  • certs     - DataCamp & Almdrasa verified credentials\n  • contact   - Email, location, social links\n  • clear     - Clear terminal history`,
          timestamp: 'CLI'
        }
      ]);
      setInputVal('');
      return;
    }

    // Map common CLI commands to query
    handleSend(`$ ${cmd}`);
  };

  return (
    <div className="ai-terminal-container">
      {/* Terminal Glass Frame */}
      <div className="ai-terminal-card">
        {/* Top Window Bar */}
        <div className="ai-terminal-header">
          <div className="ai-terminal-controls">
            <span className="terminal-dot dot-red" />
            <span className="terminal-dot dot-yellow" />
            <span className="terminal-dot dot-green" />
            <span className="terminal-title">
              <i className="fa-solid fa-terminal" style={{ color: 'var(--accent)', marginRight: '6px' }} />
              abdellah@system: ~/{mode === 'chat' ? 'ai-assistant' : 'shell'}
            </span>
          </div>

          <div className="ai-terminal-modes">
            <button
              type="button"
              className={`terminal-mode-btn ${mode === 'chat' ? 'active' : ''}`}
              onClick={() => setMode('chat')}
              aria-label="Switch to AI Assistant view"
            >
              <i className="fa-solid fa-brain" /> AI Assistant
            </button>
            <button
              type="button"
              className={`terminal-mode-btn ${mode === 'cli' ? 'active' : ''}`}
              onClick={() => setMode('cli')}
              aria-label="Switch to CLI Shell view"
            >
              <i className="fa-solid fa-code" /> CLI Shell
            </button>
          </div>
        </div>

        {/* Quick Query Pills */}
        <div className="ai-terminal-chips-wrapper">
          <span className="chips-label">
            <i className="fa-solid fa-bolt" style={{ color: 'var(--accent)', marginRight: '5px' }} />
            Quick Prompts:
          </span>
          <div className="ai-terminal-chips">
            {PRESET_QUERIES.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="ai-chip-btn"
                onClick={() => handleSend(item.prompt)}
                disabled={isTyping}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Body */}
        <div className="ai-terminal-body" role="log" aria-live="polite">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`terminal-msg ${msg.sender}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="msg-header">
                  <div className="msg-author">
                    {msg.sender === 'user' ? (
                      <>
                        <i className="fa-solid fa-user-astronaut" />
                        <span>Visitor</span>
                      </>
                    ) : msg.sender === 'assistant' ? (
                      <>
                        <i className="fa-solid fa-robot" style={{ color: 'var(--accent)' }} />
                        <span>Abdellah AI Assistant</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-microchip" style={{ color: '#a78bfa' }} />
                        <span>System CLI</span>
                      </>
                    )}
                  </div>
                  {msg.badge && <span className="msg-badge">{msg.badge}</span>}
                  <span className="msg-time">{msg.timestamp}</span>
                </div>

                <div className="msg-content">
                  <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>

                  {msg.code && (
                    <div className="msg-code-block">
                      <div className="code-header">
                        <span>Python / Architecture Snippet</span>
                        <i className="fa-brands fa-python" />
                      </div>
                      <pre><code>{msg.code}</code></pre>
                    </div>
                  )}

                  {msg.links && msg.links.length > 0 && (
                    <div className="msg-links-row">
                      {msg.links.map((link, lIdx) => (
                        <a
                          key={lIdx}
                          href={link.url}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                          className="msg-link-btn"
                        >
                          {link.label}
                          <i className={`fa-solid ${link.external ? 'fa-arrow-up-right-from-square' : 'fa-arrow-down'}`} style={{ marginLeft: '6px' }} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="terminal-msg assistant typing-indicator">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                Analyzing query & synthesizing response…
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          className="ai-terminal-input-form"
          onSubmit={(e) => {
            if (mode === 'cli') handleCliSubmit(e);
            else {
              e.preventDefault();
              handleSend();
            }
          }}
        >
          <div className="input-prompt-symbol">
            {mode === 'cli' ? '$' : '✦'}
          </div>
          <input
            type="text"
            className="ai-terminal-input"
            placeholder={
              mode === 'cli'
                ? "Type a command ('help', 'bio', 'ai', 'stack', 'projects', 'certs', 'contact')..."
                : "Ask anything about Abdellah's full-stack & AI engineering experience..."
            }
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={isTyping}
            id="ai-terminal-input-field"
          />
          <button
            type="submit"
            className="ai-terminal-send-btn"
            disabled={!inputVal.trim() || isTyping}
            aria-label="Send message"
            id="ai-terminal-submit-btn"
          >
            <i className="fa-solid fa-paper-plane" />
          </button>
        </form>
      </div>
    </div>
  );
}
