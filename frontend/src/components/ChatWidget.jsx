import React, { useState, useRef, useEffect } from 'react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hallo! 🌿 Wie kann ich Ihnen heute helfen?' }
  ]);
  const chatBottomRef = useRef(null);

  const faqList = [
    { q: 'Wie reserviere ich Essen?', a: 'Suchen Sie ein Angebot aus und klicken Sie auf "Reservieren", um es in den Warenkorb zu legen.' },
    { q: 'Wie kann ich Spender werden?', a: 'Registrieren Sie sich einfach mit der Rolle "Spender / Restaurant" und erstellen Sie Angebote.' },
    { q: 'Wo finde ich den Abholort?', a: 'Die Adresse finden Sie in den Details des jeweiligen Angebots.' }
  ];

  // التمرير للأسفل تلقائياً عند إضافة رسائل جديدة
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleQuestionClick = (q, a) => {
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: q },
      { sender: 'bot', text: a }
    ]);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1050 }}>
      {/* نافذة الدردشة */}
      {isOpen && (
        <div className="card shadow-lg border-0 rounded-4 mb-3" style={{ width: '320px', maxHeight: '480px' }}>
          <div className="card-header bg-success text-white rounded-top-4 d-flex justify-content-between align-items-center py-3">
            <h6 className="mb-0 fw-bold">💬 Support Assistant</h6>
            <button type="button" className="btn-close btn-close-white" onClick={() => setIsOpen(false)}></button>
          </div>

          <div className="card-body overflow-auto p-3" style={{ height: '220px', backgroundColor: '#f8f9fa' }}>
            {messages.map((msg, index) => (
              <div key={index} className={`d-flex mb-2 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                <div 
                  className={`p-2 rounded-3 small ${msg.sender === 'user' ? 'bg-success text-white' : 'bg-white text-dark shadow-sm border'}`}
                  style={{ maxWidth: '80%' }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* خيارات الأسئلة السريعة */}
          <div className="card-footer bg-white p-2 border-top">
            <small className="text-muted d-block mb-1 text-center" style={{ fontSize: '0.75rem' }}>Häufige Fragen:</small>
            <div className="d-flex flex-column gap-1 mb-2">
              {faqList.map((item, idx) => (
                <button
                  key={idx}
                  className="btn btn-sm btn-outline-success text-start text-truncate rounded-3"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => handleQuestionClick(item.q, item.a)}
                >
                  {item.q}
                </button>
              ))}
            </div>

            {/* زر التوجيه المباشر للبريد الإلكتروني */}
            <a
              href="mailto:kontakt@foodsurplus-erlangen.de?subject=Anfrage%20über%20Support-Chat"
              className="btn btn-dark btn-sm w-100 rounded-3 text-decoration-none py-1 text-center"
              style={{ fontSize: '0.78rem' }}
            >
              ✉️ Per E-Mail anfragen
            </a>
          </div>
        </div>
      )}

      {/* زر الأيقونة الثابت في الزاوية */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-success rounded-circle p-3 shadow-lg d-flex align-items-center justify-content-center border-0"
        style={{ width: '60px', height: '60px' }}
      >
        <span className="fs-4">{isOpen ? '✖' : '💬'}</span>
      </button>
    </div>
  );
};

export default ChatWidget;