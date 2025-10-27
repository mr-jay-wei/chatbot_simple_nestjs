// 1. 在文件顶部导入 axios
import axios from 'axios';
import React, { useState, useEffect } from 'react'; // <-- 引入 useEffect
import './App.css';

// ... Message 接口不变 ...
interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const API_BASE_URL = 'http://localhost:5000/api/chat'; // <-- 统一定义 API 地址

function App() {
  const [userInput, setUserInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- 新增 useEffect Hook ---
  // 这个 Hook 会在组件第一次渲染到屏幕上后执行一次
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true); // 开始时显示加载状态
        const response = await axios.get(`${API_BASE_URL}/history`);
        // response.data 应该是一个 Message[] 数组
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch history:', error);
        // 可以在这里设置一条错误消息
        setMessages([{ sender: 'bot', text: '加载历史记录失败' }]);
      } finally {
        setIsLoading(false); // 结束时取消加载状态
      }
    };

    fetchHistory();
  }, []); // <-- 空数组 [] 意味着这个 effect 只在组件挂载时运行一次

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage: Message = { sender: 'user', text: userInput };
    // 立即更新 UI，提供即时反馈
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    // 清空输入框，但保留 userInput 的值用于发送
    const currentInput = userInput;
    setUserInput('');

    try {
      const response = await axios.post(
        API_BASE_URL, // <-- 使用统一定义的地址
        { message: currentInput } // <-- 使用保存的输入值
      );

      const botMessage: Message = { sender: 'bot', text: response.data.reply };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (error) {
      console.error('Error fetching bot reply:', error);
      // 如果发送失败，把用户的消息状态改一下，或者加个提示
      const errorMessage: Message = { sender: 'bot', text: '抱歉，发送失败了。' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* ... JSX 界面代码保持不变 ... */}
      <div className="messages-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="message bot">正在思考中...</div>}
      </div>
      <form className="input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="输入你的问题..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          发送
        </button>
      </form>
    </div>
  );
}

export default App;