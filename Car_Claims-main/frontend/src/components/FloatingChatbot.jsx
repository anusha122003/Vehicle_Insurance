import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FloatingChatbot.module.css';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "SYS // AS-ASSISTANT ONLINE. HOW CAN I HELP YOU WITH YOUR CLAIM TODAY?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Mock bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "PROCESSING QUERY... PLEASE CONTACT SUPPORT FOR DETAILED POLICY INQUIRIES.",
        sender: 'bot'
      }]);
    }, 1000);
  };

  return (
    <div className={styles.chatbotWrapper}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.chatWindow}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.chatHeader}>
              <div className={styles.headerTitle}>
                <Bot size={16} className={styles.botIcon} />
                <span>AS-ASSISTANT</span>
                <span className={styles.blinkingDot} />
              </div>
              <button 
                className={styles.closeButton} 
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
              >
                <X size={18} />
              </button>
            </div>

            <div className={styles.messagesContainer}>
              {messages.map((msg) => (
                <div key={msg.id} className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.wrapperUser : styles.wrapperBot}`}>
                  {msg.sender === 'bot' && (
                    <div className={styles.avatarBot}><Bot size={12} /></div>
                  )}
                  <div className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className={styles.inputArea}>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="TYPE MESSAGE..." 
                className={styles.textInput}
              />
              <button type="submit" className={styles.sendButton} disabled={!input.trim()}>
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        className={styles.fab}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
}
