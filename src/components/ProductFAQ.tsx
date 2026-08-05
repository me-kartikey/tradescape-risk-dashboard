import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  id: number;
  question: string;
  answer: React.ReactNode;
}

export const ProductFAQ: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleItem = (id: number) => {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
    }
  };

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "What is drawdown in trading?",
      answer: (
        <>
          <p>
            <strong>Drawdown</strong> is the peak-to-trough decline in an account's equity or balance, typically measured from the highest net asset value (peak) the account has ever achieved to the subsequent low point.
          </p>
          <p style={{ marginTop: '8px' }}>
            It indicates the absolute volatility and peak risk experienced by the account. For instance, if an account starts at $100,000, grows to $105,000 (new peak), and then falls to $102,000, the drawdown is <strong>$3,000</strong> ($105,000 - $102,000), even though the account is still up $2,000 overall from its initial starting capital.
          </p>
        </>
      ),
    },
    {
      id: 2,
      question: "Why would a trader care about remaining drawdown rather than just current P&L?",
      answer: (
        <>
          <p>
            Traders (especially those trading under prop firm rules) care about remaining drawdown because it measures their <strong>survival buffer</strong>. 
          </p>
          <ul style={{ marginTop: '8px', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>
              <strong>Hard Violation Threshold:</strong> Prop firms enforce strict maximum drawdown limits (e.g., $10,000). Exceeding this limit leads to instant account termination, regardless of how much profit was made previously.
            </li>
            <li>
              <strong>Risk Assessment:</strong> Knowing the remaining drawdown helps the trader size their next positions appropriately. If the remaining drawdown is tiny, they must scale down contract/lot sizes to avoid an accidental breach.
            </li>
            <li>
              <strong>Psychological Comfort:</strong> Knowing the exact distance to the "danger line" provides clarity and mitigates emotional trading, which P&L alone doesn't show.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 3,
      question: "If you had another day to work on this, what would you improve?",
      answer: (
        <>
          <p>
            With more time, I would expand this tool into a fully functional local simulator:
          </p>
          <ul style={{ marginTop: '8px', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li>
              <strong>Persist State:</strong> Save the custom trade logs to LocalStorage or a mock client database so modifications persist across page refreshes.
            </li>
            <li>
              <strong>Interactive Charting:</strong> Implement a more complete charting library like Recharts to enable detailed gridlines, hover crosshairs, and multi-asset filtering overlays.
            </li>
            <li>
              <strong>Risk Alerts & Sound notifications:</strong> Add custom web audio alerts when risk enters "Approaching Limit" or "Violated" status to mock a live trader workstation.
            </li>
            <li>
              <strong>Advanced Prop Rules Simulator:</strong> Support daily drawdown calculations that reset at midnight, minimum trading days checks, and profit target milestones.
            </li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div className="card faq-card">
      <div className="faq-header">
        <HelpCircle size={20} className="text-primary" />
        <h3>Product & Strategy Q&A</h3>
      </div>

      <div className="faq-list">
        {faqData.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className={`faq-item ${isOpen ? 'active' : ''}`}>
              <button className="faq-question-btn" onClick={() => toggleItem(item.id)}>
                <span className="faq-question-text">{item.question}</span>
                {isOpen ? <ChevronUp size={16} className="text-primary" /> : <ChevronDown size={16} />}
              </button>

              <div className={`faq-answer-container ${isOpen ? 'open' : ''}`}>
                <div className="faq-answer-content">{item.answer}</div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .faq-card {
          margin-bottom: 1.5rem;
        }

        .faq-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 1.25rem;
        }

        .faq-header h3 {
          font-size: 1.1rem;
          color: var(--text-main);
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .faq-item {
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: var(--border-radius-md);
          background: rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: var(--transition-normal);
        }

        .faq-item:hover {
          border-color: rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.005);
        }

        .faq-item.active {
          border-color: rgba(59, 130, 246, 0.2);
          background: rgba(15, 23, 42, 0.4);
        }

        .faq-question-btn {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          background: transparent;
          border: none;
          color: var(--text-main);
          font-weight: 600;
          font-size: 0.875rem;
          text-align: left;
          cursor: pointer;
        }

        .faq-answer-container {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s cubic-bezier(0, 1, 0, 1);
        }

        .faq-answer-container.open {
          max-height: 1000px;
          transition: max-height 0.5s ease-in-out;
        }

        .faq-answer-content {
          padding: 0 16px 16px 16px;
          font-size: 0.85rem;
          color: var(--text-muted);
          line-height: 1.6;
          border-top: 1px solid rgba(255, 255, 255, 0.03);
          padding-top: 12px;
        }

        .faq-answer-content p {
          margin: 0;
        }

        .faq-answer-content ul {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};
