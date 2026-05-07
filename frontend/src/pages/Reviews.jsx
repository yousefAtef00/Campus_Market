import { useState } from "react";

function Reviews() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;
    const userMsg = message;
    setMessage("");
    setLoading(true);
    setChat(prev => [...prev, { user: userMsg, bot: null }]);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();

      setChat(prev =>
        prev.map((c, i) =>
          i === prev.length - 1 ? { ...c, bot: data.reply } : c
        )
      );
    } catch {
      setChat(prev =>
        prev.map((c, i) =>
          i === prev.length - 1
            ? { ...c, bot: "⚠️ Failed to connect to server" }
            : c
        )
      );
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💬 Chat</h2>

      <div style={styles.messages}>
        {chat.length === 0 && (
          <div style={styles.empty}>🤖 Start the conversation...</div>
        )}

        {chat.map((c, i) => (
          <div key={i}>
            <div style={{ ...styles.bubble, ...styles.userBubble }}>
              {c.user}
            </div>

            <div style={{ ...styles.bubble, ...styles.botBubble }}>
              {c.bot ?? (
                <span style={{ color: "#999", fontStyle: "italic" }}>
                  thinking...
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />

        <button
          style={styles.btn}
          onClick={sendMessage}
          disabled={loading}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "90vh",
    maxWidth: 480,
    margin: "0 auto",
    border: "1px solid #eee",
    borderRadius: 16,
    overflow: "hidden",
    fontFamily: "sans-serif",
    background: "#fff",
  },

  title: {
    padding: "16px 20px",
    borderBottom: "1px solid #eee",
    fontSize: 16,
    fontWeight: 500,
    margin: 0,
  },

  messages: {
    flex: 1,
    overflowY: "auto",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  empty: {
    textAlign: "center",
    color: "#bbb",
    marginTop: 80,
  },

  bubble: {
    maxWidth: "75%",
    padding: "10px 14px",
    borderRadius: 16,
    fontSize: 14,
    marginBottom: 4,
  },

  userBubble: {
    marginLeft: "auto",
    background: "#534AB7",
    color: "#fff",
    borderBottomRightRadius: 4,
  },

  botBubble: {
    background: "#f4f4f4",
    color: "#333",
    borderBottomLeftRadius: 4,
  },

  inputArea: {
    padding: 12,
    borderTop: "1px solid #eee",
    display: "flex",
    gap: 8,
  },

  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid #ddd",
    fontSize: 14,
    outline: "none",
  },

  btn: {
    padding: "10px 18px",
    background: "#534AB7",
    color: "#fff",
    border: "none",
    borderRadius: 999,
    cursor: "pointer",
    fontSize: 14,
  },
};

export default Reviews;