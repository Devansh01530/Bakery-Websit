/* ================================================
   Fresh Bakes — Chatbot
   ================================================ */

(function () {
  /* ---- Bot rules ---- */
  const RULES = [
    { p: /timing|hour|open|close|when/i,    r: "We're open Mon–Sat 8am–9pm and Sunday 9am–7pm. 🕗" },
    { p: /birthday|bday/i,                  r: "🎂 For birthdays try our Chocolate Fudge (₹899) or Vanilla Dream (₹799). Custom designs available!" },
    { p: /price|cost|how much|rate/i,       r: "Cakes from ₹599, Cupcakes ₹49 each, Cookies ₹299/box. 💛" },
    { p: /deliver|home|ship/i,              r: "Yes! We deliver within 10km. Free delivery above ₹599. 🛵" },
    { p: /custom|design/i,                  r: "We love custom orders! 🎨 WhatsApp us 2 days in advance." },
    { p: /payment|pay|upi|cash|card/i,      r: "We accept Cash, UPI, and Cards. 💳" },
    { p: /recommend|suggest|best|popular/i, r: "Our bestsellers: Chocolate Fudge Cake 🍫, Red Velvet Cupcakes 🧁, Butter Cookies 🍪!" },
    { p: /hello|hi|hey|namaste/i,           r: "Hello! 👋 I'm Baky, your Fresh Bakes assistant! How can I help?" },
    { p: /thank/i,                          r: "You're welcome! 😊 Happy baking!" },
    { p: /location|address|where/i,         r: "📍 12 MG Road, Ghaziabad, UP. Near City Mall!" },
    { p: /cake|menu|available/i,            r: "🎂 We have: Cakes, Cupcakes, Cookies, Pastries & Bread! Check our Products page." },
    { p: /order/i,                          r: "To place an order, visit our Products page or WhatsApp us! 📱" },
  ];

  let chatOpen = false;
  let isTyping = false;

  /* ---- Inject chatbot HTML into page ---- */
  document.body.insertAdjacentHTML("beforeend", `
    <button class="chatbot-toggle" id="chatToggle" aria-label="Open chat">🍰</button>
    <div class="chatbot-window" id="chatWindow" role="dialog" aria-label="Baky Chatbot">
      <div class="chat-header">
        <div class="chat-avatar">🍰</div>
        <div class="chat-header-info">
          <h4>Baky — Fresh Bakes Bot</h4>
          <p>Usually replies instantly</p>
        </div>
        <button class="chat-close" id="chatClose" aria-label="Close chat">✕</button>
      </div>
      <div class="chat-messages" id="chatMessages"></div>
      <div class="chat-input-row">
        <input class="chat-input" id="chatInput" type="text" placeholder="Ask me anything..." autocomplete="off"/>
        <button class="chat-send" id="chatSend" aria-label="Send">➤</button>
      </div>
    </div>`);

  const chatWindow  = document.getElementById("chatWindow");
  const chatMsgsEl  = document.getElementById("chatMessages");
  const chatInputEl = document.getElementById("chatInput");

  /* ---- Helpers ---- */
  function appendMsg(text, sender) {
    const d = document.createElement("div");
    d.className = "msg " + sender;
    d.innerHTML = text.replace(/\n/g, "<br>");
    chatMsgsEl.appendChild(d);
    chatMsgsEl.scrollTop = chatMsgsEl.scrollHeight;
  }

  function showTypingDots() {
    const d = document.createElement("div");
    d.className = "msg bot";
    d.id = "typingDots";
    d.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
    chatMsgsEl.appendChild(d);
    chatMsgsEl.scrollTop = chatMsgsEl.scrollHeight;
  }

  function removeTypingDots() {
    const e = document.getElementById("typingDots");
    if (e) e.remove();
  }

  function showSuggestions() {
    const suggestions = ["What cakes do you have?", "Birthday cake suggestion", "Delivery info", "Bakery timings", "How to order?"];
    const w = document.createElement("div");
    w.className = "chat-suggestions";
    suggestions.forEach(s => {
      const b = document.createElement("button");
      b.className = "chat-suggest-btn";
      b.textContent = s;
      b.onclick = () => { w.remove(); handleMsg(s); };
      w.appendChild(b);
    });
    chatMsgsEl.appendChild(w);
    chatMsgsEl.scrollTop = chatMsgsEl.scrollHeight;
  }

  async function handleMsg(msg) {
    if (!msg.trim() || isTyping) return;
    chatInputEl.value = "";
    appendMsg(msg, "user");
    isTyping = true;
    showTypingDots();
    await new Promise(r => setTimeout(r, 700));
    removeTypingDots();
    const rule = RULES.find(r => r.p.test(msg));
    appendMsg(rule ? rule.r : "I'm not sure about that 😊 Please call us at +91-9876543210!", "bot");
    isTyping = false;
  }

  /* ---- Events ---- */
  document.getElementById("chatToggle").addEventListener("click", () => {
    chatOpen = !chatOpen;
    chatWindow.classList.toggle("open", chatOpen);
    if (chatOpen && chatMsgsEl.children.length === 0) {
      appendMsg("Hello! 👋 I'm <b>Baky</b>, your Fresh Bakes assistant! How can I help?", "bot");
      setTimeout(showSuggestions, 400);
    }
  });

  document.getElementById("chatClose").addEventListener("click", () => {
    chatOpen = false;
    chatWindow.classList.remove("open");
  });

  document.getElementById("chatSend").addEventListener("click", () => handleMsg(chatInputEl.value));
  document.getElementById("chatInput").addEventListener("keydown", e => {
    if (e.key === "Enter") handleMsg(chatInputEl.value);
  });

})();
