import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./SamarthChat.module.css";

const DEFAULT_NUMBER = "9560648813";
const LAZYPAY_URL = "https://lazypay.in";

type FlowStep =
  | "confirm-number"
  | "edit-number"
  | "products"
  | "actionables"
  | "nl-chat"
  | "ended";

type Cta = {
  id: string;
  label: string;
  variant?: "primary" | "green" | "disabled" | "link";
  href?: string;
  tooltip?: string;
  fullWidth?: boolean;
  half?: boolean;
};

type Message = {
  id: string;
  role: "bot" | "user";
  text?: string;
  ctas?: Cta[];
  timestamp: string;
};

const PRODUCTS = [
  { id: "paylater", label: "Paylater", active: true },
  { id: "xpressloan", label: "XpressLoan", active: false },
  { id: "paysense", label: "PaySense", active: false },
  { id: "checkout", label: "Checkout Finance", active: false },
  { id: "payin3", label: "Pay in 3", active: false },
] as const;

const ACTIONABLES = [
  { id: "transactions", label: "Transactions", half: true },
  { id: "repayments", label: "Repayments, charges & fees", fullWidth: true },
  { id: "prev-menu", label: "Previous Menu", half: true },
  { id: "main-menu", label: "Main Menu", half: true },
  { id: "end-chat", label: "End Chat", half: true },
] as const;

function formatTime(date = new Date()) {
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildConfirmCtAs(): Cta[] {
  return [
    { id: "correct", label: "Correct", variant: "primary", half: true },
    { id: "edit", label: "Edit", variant: "primary", half: true },
    { id: "end-chat", label: "End Chat", variant: "primary", fullWidth: true },
  ];
}

function buildProductCtAs(): Cta[] {
  const rows: Cta[] = PRODUCTS.map((p) =>
    p.active
      ? { id: p.id, label: p.label, variant: "green", half: true }
      : {
          id: p.id,
          label: p.label,
          variant: "disabled",
          href: LAZYPAY_URL,
          tooltip: "To know more, click",
          half: true,
        }
  );
  rows.push(
    { id: "prev-menu", label: "Previous Menu", variant: "primary", half: true },
    { id: "main-menu", label: "Main Menu", variant: "primary", half: true }
  );
  return rows;
}

function buildActionableCtAs(): Cta[] {
  return ACTIONABLES.map((a) => ({
    id: a.id,
    label: a.label,
    variant: "primary" as const,
    fullWidth: "fullWidth" in a && a.fullWidth,
    half: "half" in a && a.half,
  }));
}

function getNlReply(action: string, userText: string): string {
  const lower = userText.toLowerCase();
  if (lower.includes("thank")) {
    return "You're welcome! Is there anything else I can help you with regarding Paylater?";
  }
  if (lower.includes("status") || lower.includes("pending")) {
    return "I can help you check transaction status. Please share your transaction ID or the date of the transaction.";
  }
  if (lower.includes("repay") || lower.includes("due")) {
    return "Your repayment details can be viewed in the LazyPay app under Paylater → Repayments. Would you like steps to pay your due amount?";
  }
  if (lower.includes("fee") || lower.includes("charge")) {
    return "Paylater charges and fees depend on your usage and tenure. I can explain the fee structure — what would you like to know?";
  }

  const actionReplies: Record<string, string> = {
    transactions:
      "I'm here to help with your Paylater transactions. You can ask about recent payments, refunds, or failed transactions.",
    repayments:
      "I can assist with repayments, charges, and fees on your Paylater account. What would you like to know?",
  };

  const intro = actionReplies[action] ?? "How can I help you today?";
  return `${intro} You asked: "${userText}". Our team will assist you shortly — feel free to share more details.`;
}

export default function SamarthChat() {
  const [step, setStep] = useState<FlowStep>("confirm-number");
  const [phoneNumber, setPhoneNumber] = useState(DEFAULT_NUMBER);
  const [editDraft, setEditDraft] = useState(DEFAULT_NUMBER);
  const [, setSelectedProduct] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: uid(),
      role: "bot",
      text: `Hello! I'm Samarth, your LazyPay assistant.\n\nYour registered mobile number is **${DEFAULT_NUMBER}**. Is this correct?`,
      ctas: buildConfirmCtAs(),
      timestamp: formatTime(),
    },
  ]);
  const [chatOpen, setChatOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const appendBot = useCallback((text: string, ctas?: Cta[]) => {
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "bot", text, ctas, timestamp: formatTime() },
    ]);
  }, []);

  const appendUser = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", text, timestamp: formatTime() },
    ]);
  }, []);

  const resetToStart = useCallback(() => {
    setStep("confirm-number");
    setPhoneNumber(DEFAULT_NUMBER);
    setEditDraft(DEFAULT_NUMBER);
    setSelectedProduct(null);
    setSelectedAction(null);
    setInputValue("");
    const greeting: Message = {
      id: uid(),
      role: "bot",
      text: `Hello! I'm Samarth, your LazyPay assistant.\n\nYour registered mobile number is **${DEFAULT_NUMBER}**. Is this correct?`,
      ctas: buildConfirmCtAs(),
      timestamp: formatTime(),
    };
    setMessages([greeting]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, step]);

  useEffect(() => {
    if (step === "nl-chat") {
      inputRef.current?.focus();
    }
  }, [step]);

  const showProducts = useCallback(
    (number: string) => {
      setStep("products");
      appendBot(
        `Here is a list of your available products on LazyPay for **${number}**. Select a product you need help with, or choose another option below:`,
        buildProductCtAs()
      );
    },
    [appendBot]
  );

  const showActionables = useCallback(() => {
    setStep("actionables");
    appendBot("What do you need help with?", buildActionableCtAs());
  }, [appendBot]);

  const endChat = useCallback(() => {
    setStep("ended");
    appendBot(
      "Thank you for chatting with Samarth. Have a great day! You can close this window or start a new chat from the main menu."
    );
  }, [appendBot]);

  const handleConfirmCta = (ctaId: string) => {
    if (ctaId === "correct") {
      appendUser("Correct");
      showProducts(phoneNumber);
      return;
    }
    if (ctaId === "edit") {
      appendUser("Edit");
      setEditDraft(phoneNumber);
      setStep("edit-number");
      appendBot("Please enter your updated mobile number below and tap Save.");
      return;
    }
    if (ctaId === "end-chat") {
      appendUser("End Chat");
      endChat();
    }
  };

  const handleProductCta = (cta: Cta) => {
    if (cta.id === "prev-menu") {
      appendUser("Previous Menu");
      setStep("confirm-number");
      appendBot(
        `Your registered mobile number is **${phoneNumber}**. Is this correct?`,
        buildConfirmCtAs()
      );
      return;
    }
    if (cta.id === "main-menu") {
      appendUser("Main Menu");
      resetToStart();
      return;
    }

    const product = PRODUCTS.find((p) => p.id === cta.id);
    if (!product?.active) return;

    appendUser(product.label);
    setSelectedProduct(product.id);
    showActionables();
  };

  const handleActionableCta = (ctaId: string) => {
    const action = ACTIONABLES.find((a) => a.id === ctaId);
    if (!action) return;

    appendUser(action.label);

    if (ctaId === "prev-menu") {
      setSelectedProduct(null);
      showProducts(phoneNumber);
      return;
    }
    if (ctaId === "main-menu") {
      resetToStart();
      return;
    }
    if (ctaId === "end-chat") {
      endChat();
      return;
    }

    setSelectedAction(ctaId);
    setStep("nl-chat");
    appendBot(
      `Great! I'm ready to help you with **${action.label}** on Paylater. Type your question below — you can ask in natural language.`
    );
  };

  const lastBotCtaIndex = messages.reduce(
    (acc, m, i) => (m.role === "bot" && m.ctas?.length ? i : acc),
    -1
  );

  const handleCtaClick = (cta: Cta, messageIndex: number) => {
    const msg = messages[messageIndex];
    if (!msg?.ctas || messageIndex !== lastBotCtaIndex) return;

    if (step === "confirm-number" || step === "edit-number") {
      handleConfirmCta(cta.id);
    } else if (step === "products") {
      handleProductCta(cta);
    } else if (step === "actionables") {
      handleActionableCta(cta.id);
    }
  };

  const saveEditedNumber = () => {
    const trimmed = editDraft.replace(/\D/g, "");
    if (trimmed.length < 10) {
      appendBot("Please enter a valid 10-digit mobile number.");
      return;
    }
    setPhoneNumber(trimmed);
    appendUser(trimmed);
    showProducts(trimmed);
  };

  const sendNaturalLanguage = () => {
    const text = inputValue.trim();
    if (!text || step !== "nl-chat") return;

    appendUser(text);
    setInputValue("");

    const reply = getNlReply(selectedAction ?? "", text);
    setTimeout(() => appendBot(reply), 400);
  };

  if (!chatOpen) {
    return (
      <button
        type="button"
        className={styles.fab}
        onClick={() => setChatOpen(true)}
        aria-label="Open chat with Samarth"
      >
        Chat with Samarth
      </button>
    );
  }

  const nlEnabled = step === "nl-chat";

  return (
    <div className={styles.chatWrapper}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={() => setChatOpen(false)}
          aria-label="Close chat"
        >
          ✕
        </button>
        <h1 className={styles.headerTitle}>Chat with Samarth</h1>
      </header>

      <div className={styles.messages} ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={
              msg.role === "bot" ? styles.rowBot : styles.rowUser
            }
          >
            {msg.role === "bot" && (
              <div className={styles.avatar} aria-hidden>
                <span>S</span>
              </div>
            )}
            <div className={styles.bubbleCol}>
              <div
                className={
                  msg.role === "bot" ? styles.bubbleBot : styles.bubbleUser
                }
              >
                {msg.text && (
                  <p
                    className={styles.messageText}
                    dangerouslySetInnerHTML={{
                      __html: msg.text.replace(
                        /\*\*(.+?)\*\*/g,
                        "<strong>$1</strong>"
                      ),
                    }}
                  />
                )}
                {msg.ctas && msg.ctas.length > 0 && (
                  <div className={styles.ctaGrid}>
                    {msg.ctas.map((cta) => (
                      <CtaButton
                        key={cta.id}
                        cta={cta}
                        onClick={() => handleCtaClick(cta, idx)}
                      />
                    ))}
                  </div>
                )}
              </div>
              <span className={styles.timestamp}>{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {step === "edit-number" && (
          <div className={styles.editPanel}>
            <input
              type="tel"
              className={styles.editInput}
              value={editDraft}
              onChange={(e) => setEditDraft(e.target.value)}
              placeholder="Enter mobile number"
              maxLength={10}
            />
            <button
              type="button"
              className={styles.saveBtn}
              onClick={saveEditedNumber}
            >
              Save
            </button>
          </div>
        )}
      </div>

      {nlEnabled && (
        <footer className={styles.footer}>
          <input
            ref={inputRef}
            type="text"
            className={styles.nlInput}
            placeholder="Type your message…"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendNaturalLanguage();
            }}
          />
          <button
            type="button"
            className={styles.sendBtn}
            onClick={sendNaturalLanguage}
            disabled={!inputValue.trim()}
            aria-label="Send message"
          >
            ➤
          </button>
        </footer>
      )}

      {step === "ended" && (
        <div className={styles.endedBar}>
          <button type="button" className={styles.restartBtn} onClick={resetToStart}>
            Start new chat
          </button>
        </div>
      )}
    </div>
  );
}

function CtaButton({
  cta,
  onClick,
}: {
  cta: Cta;
  onClick: () => void;
}) {
  const classNames = [
    styles.cta,
    cta.fullWidth && styles.ctaFull,
    cta.half && styles.ctaHalf,
    cta.variant === "green" && styles.ctaGreen,
    cta.variant === "disabled" && styles.ctaDisabled,
    cta.variant === "primary" && styles.ctaPrimary,
  ]
    .filter(Boolean)
    .join(" ");

  if (cta.variant === "disabled" && cta.href) {
    return (
      <a
        href={cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className={classNames}
        title={cta.tooltip}
        data-tooltip={cta.tooltip}
      >
        {cta.label}
        <span className={styles.tooltip}>{cta.tooltip}</span>
      </a>
    );
  }

  return (
    <button type="button" className={classNames} onClick={onClick}>
      {cta.label}
    </button>
  );
}
