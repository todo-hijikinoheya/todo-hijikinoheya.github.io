window.addEventListener('DOMContentLoaded', () => {
    const chatLog = document.getElementById('chat-log');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
  
    // メッセージ送信時の処理
    sendButton.addEventListener('click', () => {
      const message = messageInput.value;
      if (message) {
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chatLog.appendChild(messageElement);
        messageInput.value = '';
      }
    });
  
    // Enterキーでメッセージ送信
    messageInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        sendButton.click();
        event.preventDefault();
      }
    });
  });