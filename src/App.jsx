import { useReducer, useState } from "react";

// ─── FONTS ────────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// ─── SIMULATED REDUX STORE (RTK patterns, real useReducer under the hood) ─────

// --- Counter Slice ---
const counterInitial = { value: 0, history: [] };
function counterReducer(state, action) {
  switch (action.type) {
    case "counter/increment":
      return { value: state.value + 1, history: [...state.history, `+1 → ${state.value + 1}`] };
    case "counter/decrement":
      return { value: state.value - 1, history: [...state.history, `-1 → ${state.value - 1}`] };
    case "counter/incrementByAmount":
      return {
        value: state.value + action.payload,
        history: [...state.history, `+${action.payload} → ${state.value + action.payload}`],
      };
    case "counter/reset":
      return { value: 0, history: [...state.history, `reset → 0`] };
    default:
      return state;
  }
}

// --- Todos Slice ---
const todosInitial = {
  items: [
    { id: 1, text: "Learn Redux Toolkit", completed: true },
    { id: 2, text: "Build a slice", completed: false },
    { id: 3, text: "Dispatch an action", completed: false },
  ],
  filter: "all",
};
function todosReducer(state, action) {
  switch (action.type) {
    case "todos/add":
      return {
        ...state,
        items: [...state.items, { id: Date.now(), text: action.payload, completed: false }],
      };
    case "todos/toggle":
      return {
        ...state,
        items: state.items.map((t) =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t
        ),
      };
    case "todos/remove":
      return { ...state, items: state.items.filter((t) => t.id !== action.payload) };
    case "todos/setFilter":
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}

// --- Cart Slice ---
const cartInitial = {
  items: [],
  products: [
    { id: 1, name: "Redux Handbook", price: 29 },
    { id: 2, name: "State Machine Tee", price: 24 },
    { id: 3, name: "Immutable Coffee Mug", price: 14 },
    { id: 4, name: "Middleware Hoodie", price: 49 },
  ],
};
function cartReducer(state, action) {
  switch (action.type) {
    case "cart/add": {
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists)
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case "cart/remove":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "cart/clear":
      return { ...state, items: [] };
    default:
      return state;
  }
}

// ─── CODE SNIPPETS ─────────────────────────────────────────────────────────────
const snippets = {
  store: `// store.js
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import todosReducer from './todosSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch`,

  slice: `// counterSlice.js
import { createSlice } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1 },
    decrement: (state) => { state.value -= 1 },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
    reset: (state) => { state.value = 0 },
  },
})

export const { increment, decrement,
  incrementByAmount, reset } = counterSlice.actions
export default counterSlice.reducer`,

  dispatch: `// In your component
import { useDispatch, useSelector } from 'react-redux'
import { increment, decrement } from './counterSlice'

function Counter() {
  const dispatch = useDispatch()
  const count = useSelector((state) => state.counter.value)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  )
}`,

  async: `// Async Thunk — API calls
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const fetchUser = createAsyncThunk(
  'users/fetchById',
  async (userId) => {
    const response = await fetch(\`/api/users/\${userId}\`)
    return response.json()
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState: { data: null, status: 'idle' },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = 'failed'
      })
  },
})`,
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div style={{ background: "#0d0d14", border: "1px solid #2a2a3a", borderRadius: 10, overflow: "hidden", marginTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", background: "#13131f", borderBottom: "1px solid #1e1e2e" }}>
        <span style={{ fontFamily: "Space Mono", fontSize: 11, color: "#6366f1", letterSpacing: 1 }}>{label}</span>
        <button
          onClick={copy}
          style={{ fontFamily: "Space Mono", fontSize: 10, color: copied ? "#22d3ee" : "#6b7280", background: "none", border: "none", cursor: "pointer", letterSpacing: 0.5 }}
        >
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "16px", fontFamily: "JetBrains Mono", fontSize: 12, lineHeight: 1.7, color: "#c9d1d9", overflowX: "auto", whiteSpace: "pre" }}>
        <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(code) }} />
      </pre>
    </div>
  );
}

function syntaxHighlight(code) {
  return code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/('.*?'|`.*?`)/g, '<span style="color:#a5f3fc">$1</span>')
    .replace(/\b(import|export|from|const|function|return|default|async|await|if)\b/g, '<span style="color:#818cf8">$1</span>')
    .replace(/\b(createSlice|createAsyncThunk|configureStore|useDispatch|useSelector|createReducer|createAction)\b/g, '<span style="color:#f472b6">$1</span>')
    .replace(/\/\/.*/g, '<span style="color:#4b5563">$&</span>')
    .replace(/\b(\d+)\b/g, '<span style="color:#fb923c">$1</span>');
}

function Tag({ children, color = "#6366f1" }) {
  return (
    <span style={{ background: color + "22", color, fontFamily: "Space Mono", fontSize: 10, letterSpacing: 1, padding: "2px 8px", borderRadius: 4, border: `1px solid ${color}44` }}>
      {children}
    </span>
  );
}

function SectionTitle({ step, title, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <span style={{ fontFamily: "Space Mono", fontSize: 10, color: "#6366f1", letterSpacing: 2 }}>0{step}</span>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, #6366f155, transparent)" }} />
      </div>
      <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 28, color: "#f1f5f9", margin: 0, letterSpacing: -0.5 }}>{title}</h2>
      {sub && <p style={{ fontFamily: "Syne", color: "#64748b", fontSize: 14, marginTop: 6, margin: "6px 0 0" }}>{sub}</p>}
    </div>
  );
}

// ─── FLOW DIAGRAM ─────────────────────────────────────────────────────────────
function FlowDiagram() {
  const [active, setActive] = useState(null);
  const nodes = [
    { id: "ui", label: "UI Component", sub: "Button click / event", color: "#22d3ee", icon: "⬡" },
    { id: "dispatch", label: "dispatch()", sub: "Sends an action", color: "#818cf8", icon: "→" },
    { id: "action", label: "Action", sub: "{ type, payload }", color: "#f472b6", icon: "◈" },
    { id: "reducer", label: "Reducer/Slice", sub: "Pure function, Immer", color: "#4ade80", icon: "⚙" },
    { id: "store", label: "Store", sub: "Single source of truth", color: "#fb923c", icon: "◎" },
    { id: "selector", label: "useSelector()", sub: "Re-renders component", color: "#22d3ee", icon: "⬡" },
  ];
  const descriptions = {
    ui: "Your React component — a button, form, or any event that needs to update global state.",
    dispatch: "dispatch() sends the action to the Redux store. It's the only way to trigger a state change.",
    action: "An action is a plain object: { type: 'counter/increment', payload: 5 }. createSlice auto-generates these.",
    reducer: "The reducer is a pure function that takes current state + action and returns the next state. RTK uses Immer so you can write 'mutating' code safely.",
    store: "The single store holds your entire app state tree. configureStore() sets it up with good defaults.",
    selector: "useSelector() subscribes to the store. When state changes, it re-renders your component with fresh data.",
  };
  return (
    <div style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: "24px 20px" }}>
      <p style={{ fontFamily: "Space Mono", fontSize: 10, color: "#6366f1", letterSpacing: 2, margin: "0 0 20px", textAlign: "center" }}>CLICK ANY NODE TO LEARN MORE</p>
      <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
        {nodes.map((n, i) => (
          <div key={n.id} style={{ display: "flex", alignItems: "center", flex: "0 0 auto" }}>
            <button
              onClick={() => setActive(active === n.id ? null : n.id)}
              style={{
                background: active === n.id ? n.color + "22" : "#13131f",
                border: `2px solid ${active === n.id ? n.color : n.color + "55"}`,
                borderRadius: 10,
                padding: "12px 16px",
                cursor: "pointer",
                textAlign: "center",
                minWidth: 110,
                transition: "all 0.2s",
                transform: active === n.id ? "scale(1.05)" : "scale(1)",
              }}
            >
              <div style={{ fontSize: 18, marginBottom: 4 }}>{n.icon}</div>
              <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 13, color: n.color }}>{n.label}</div>
              <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#64748b", marginTop: 2 }}>{n.sub}</div>
            </button>
            {i < nodes.length - 1 && (
              <div style={{ padding: "0 4px" }}>
                <svg width="24" height="12" viewBox="0 0 24 12">
                  <path d="M0 6 L18 6 M14 2 L20 6 L14 10" stroke="#334155" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      {active && (
        <div style={{ marginTop: 16, padding: "12px 16px", background: "#13131f", borderRadius: 8, border: `1px solid ${nodes.find(n => n.id === active)?.color}44` }}>
          <span style={{ fontFamily: "Syne", fontWeight: 600, fontSize: 14, color: nodes.find(n => n.id === active)?.color }}>{nodes.find(n => n.id === active)?.label}: </span>
          <span style={{ fontFamily: "Syne", fontSize: 14, color: "#94a3b8" }}>{descriptions[active]}</span>
        </div>
      )}
    </div>
  );
}

// ─── COUNTER DEMO ─────────────────────────────────────────────────────────────
function CounterDemo() {
  const [state, dispatch] = useReducer(counterReducer, counterInitial);
  const [amount, setAmount] = useState(5);
  const [showLog, setShowLog] = useState(true);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: 24 }}>
        <p style={{ fontFamily: "Space Mono", fontSize: 10, color: "#6366f1", letterSpacing: 2, margin: "0 0 16px" }}>LIVE STORE STATE</p>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontFamily: "Space Mono", fontSize: 64, fontWeight: 700, color: state.value >= 0 ? "#4ade80" : "#f87171", lineHeight: 1, transition: "color 0.3s" }}>
            {state.value}
          </div>
          <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#334155", marginTop: 4 }}>counter.value</div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
          {[
            { label: "–", action: { type: "counter/decrement" }, color: "#f87171" },
            { label: "RESET", action: { type: "counter/reset" }, color: "#64748b" },
            { label: "+", action: { type: "counter/increment" }, color: "#4ade80" },
          ].map((b) => (
            <button
              key={b.label}
              onClick={() => dispatch(b.action)}
              style={{ fontFamily: "Space Mono", fontWeight: 700, fontSize: 16, color: b.color, background: b.color + "15", border: `1px solid ${b.color}44`, borderRadius: 8, padding: "10px 20px", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => (e.target.style.background = b.color + "30")}
              onMouseLeave={e => (e.target.style.background = b.color + "15")}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="range" min={1} max={20} value={amount}
            onChange={e => setAmount(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#818cf8" }}
          />
          <button
            onClick={() => dispatch({ type: "counter/incrementByAmount", payload: amount })}
            style={{ fontFamily: "Space Mono", fontSize: 11, color: "#818cf8", background: "#818cf815", border: "1px solid #818cf844", borderRadius: 8, padding: "8px 12px", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            +{amount}
          </button>
        </div>
        <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#334155", textAlign: "center", marginTop: 6 }}>dispatch(incrementByAmount({amount}))</div>
      </div>

      <div style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontFamily: "Space Mono", fontSize: 10, color: "#f472b6", letterSpacing: 2, margin: 0 }}>ACTION LOG</p>
          <button onClick={() => setShowLog(!showLog)} style={{ fontFamily: "Space Mono", fontSize: 9, color: "#4b5563", background: "none", border: "none", cursor: "pointer" }}>
            {showLog ? "HIDE" : "SHOW"}
          </button>
        </div>
        {showLog && (
          <div style={{ height: 180, overflowY: "auto", display: "flex", flexDirection: "column-reverse", gap: 4 }}>
            {state.history.length === 0 ? (
              <p style={{ fontFamily: "Space Mono", fontSize: 11, color: "#334155", textAlign: "center", marginTop: 60 }}>Dispatch an action...</p>
            ) : (
              [...state.history].reverse().map((h, i) => (
                <div key={i} style={{ fontFamily: "JetBrains Mono", fontSize: 11, color: i === 0 ? "#4ade80" : "#4b5563", background: i === 0 ? "#4ade8010" : "transparent", padding: "4px 8px", borderRadius: 4, borderLeft: i === 0 ? "2px solid #4ade80" : "2px solid #1e293b" }}>
                  {h}
                </div>
              ))
            )}
          </div>
        )}
        <div style={{ marginTop: 12, padding: "10px", background: "#13131f", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 11 }}>
          <span style={{ color: "#4b5563" }}>store.getState(): </span>
          <span style={{ color: "#a5f3fc" }}>{"{ counter: { value: "}</span>
          <span style={{ color: "#fb923c" }}>{state.value}</span>
          <span style={{ color: "#a5f3fc" }}>{"} }"}</span>
        </div>
      </div>
    </div>
  );
}

// ─── TODO DEMO ────────────────────────────────────────────────────────────────
function TodoDemo() {
  const [state, dispatch] = useReducer(todosReducer, todosInitial);
  const [input, setInput] = useState("");
  const filtered = state.items.filter(t =>
    state.filter === "all" ? true : state.filter === "done" ? t.completed : !t.completed
  );

  return (
    <div style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <p style={{ fontFamily: "Space Mono", fontSize: 10, color: "#22d3ee", letterSpacing: 2, margin: "0 0 4px" }}>TODOS SLICE — LIVE</p>
          <p style={{ fontFamily: "Space Mono", fontSize: 9, color: "#334155", margin: 0 }}>useSelector(state =&gt; state.todos)</p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "todo", "done"].map(f => (
            <button key={f} onClick={() => dispatch({ type: "todos/setFilter", payload: f })}
              style={{ fontFamily: "Space Mono", fontSize: 9, letterSpacing: 1, color: state.filter === f ? "#22d3ee" : "#4b5563", background: state.filter === f ? "#22d3ee15" : "transparent", border: `1px solid ${state.filter === f ? "#22d3ee44" : "#1e293b"}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", textTransform: "uppercase" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && input.trim()) { dispatch({ type: "todos/add", payload: input.trim() }); setInput(""); }}}
          placeholder="Add a todo... (Enter)"
          style={{ flex: 1, fontFamily: "JetBrains Mono", fontSize: 12, color: "#e2e8f0", background: "#13131f", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 14px", outline: "none" }}
        />
        <button
          onClick={() => { if (input.trim()) { dispatch({ type: "todos/add", payload: input.trim() }); setInput(""); }}}
          style={{ fontFamily: "Space Mono", fontSize: 12, color: "#22d3ee", background: "#22d3ee15", border: "1px solid #22d3ee44", borderRadius: 8, padding: "10px 16px", cursor: "pointer" }}>
          ADD
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, minHeight: 100 }}>
        {filtered.length === 0 && <p style={{ fontFamily: "Space Mono", fontSize: 11, color: "#334155", textAlign: "center", padding: 20 }}>No items</p>}
        {filtered.map(t => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "#13131f", borderRadius: 8, padding: "10px 12px", border: "1px solid #1e293b" }}>
            <button onClick={() => dispatch({ type: "todos/toggle", payload: t.id })}
              style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${t.completed ? "#4ade80" : "#334155"}`, background: t.completed ? "#4ade80" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {t.completed && <span style={{ color: "#0d0d14", fontSize: 10, fontWeight: 700 }}>✓</span>}
            </button>
            <span style={{ fontFamily: "Syne", fontSize: 14, color: t.completed ? "#334155" : "#e2e8f0", flex: 1, textDecoration: t.completed ? "line-through" : "none", transition: "all 0.2s" }}>{t.text}</span>
            <span style={{ fontFamily: "Space Mono", fontSize: 9, color: "#1e293b" }}>id:{t.id}</span>
            <button onClick={() => dispatch({ type: "todos/remove", payload: t.id })}
              style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: "0 4px" }}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, padding: "10px 12px", background: "#13131f", borderRadius: 8, fontFamily: "JetBrains Mono", fontSize: 11, lineHeight: 1.7 }}>
        <div><span style={{ color: "#4b5563" }}>items.length: </span><span style={{ color: "#fb923c" }}>{state.items.length}</span></div>
        <div><span style={{ color: "#4b5563" }}>completed: </span><span style={{ color: "#4ade80" }}>{state.items.filter(t => t.completed).length}</span></div>
        <div><span style={{ color: "#4b5563" }}>filter: </span><span style={{ color: "#a5f3fc" }}>"{state.filter}"</span></div>
      </div>
    </div>
  );
}

// ─── CART DEMO ────────────────────────────────────────────────────────────────
function CartDemo() {
  const [state, dispatch] = useReducer(cartReducer, cartInitial);
  const total = state.items.reduce((s, i) => s + i.price * i.qty, 0);
  const qty = state.items.reduce((s, i) => s + i.qty, 0);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: 20 }}>
        <p style={{ fontFamily: "Space Mono", fontSize: 10, color: "#f472b6", letterSpacing: 2, margin: "0 0 14px" }}>PRODUCTS</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {state.products.map(p => {
            const inCart = state.items.find(i => i.id === p.id);
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "#13131f", borderRadius: 8, padding: "10px 12px", border: `1px solid ${inCart ? "#f472b644" : "#1e293b"}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Syne", fontWeight: 600, fontSize: 13, color: "#e2e8f0" }}>{p.name}</div>
                  <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#4b5563" }}>${p.price}</div>
                </div>
                {inCart && <span style={{ fontFamily: "Space Mono", fontSize: 9, color: "#4ade80" }}>×{inCart.qty}</span>}
                <button
                  onClick={() => dispatch({ type: "cart/add", payload: p })}
                  style={{ fontFamily: "Space Mono", fontSize: 11, color: "#f472b6", background: "#f472b615", border: "1px solid #f472b644", borderRadius: 6, padding: "6px 12px", cursor: "pointer" }}>
                  ADD
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{ fontFamily: "Space Mono", fontSize: 10, color: "#fb923c", letterSpacing: 2, margin: 0 }}>CART STATE</p>
          <span style={{ fontFamily: "Space Mono", fontSize: 10, background: "#fb923c22", color: "#fb923c", padding: "2px 8px", borderRadius: 10, border: "1px solid #fb923c44" }}>{qty} items</span>
        </div>
        {state.items.length === 0 ? (
          <p style={{ fontFamily: "Space Mono", fontSize: 11, color: "#1e293b", textAlign: "center", padding: 30 }}>Cart is empty</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
            {state.items.map(i => (
              <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#13131f", borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "Syne", fontSize: 12, color: "#e2e8f0" }}>{i.name}</div>
                  <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#4b5563" }}>${i.price} × {i.qty}</div>
                </div>
                <span style={{ fontFamily: "Space Mono", fontSize: 11, color: "#fb923c" }}>${i.price * i.qty}</span>
                <button onClick={() => dispatch({ type: "cart/remove", payload: i.id })}
                  style={{ color: "#f87171", background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>✕</button>
              </div>
            ))}
          </div>
        )}
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 12, marginTop: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "Space Mono", fontSize: 10, color: "#4b5563" }}>TOTAL</div>
            <div style={{ fontFamily: "Space Mono", fontSize: 24, fontWeight: 700, color: "#fb923c" }}>${total}</div>
          </div>
          {state.items.length > 0 && (
            <button onClick={() => dispatch({ type: "cart/clear" })}
              style={{ fontFamily: "Space Mono", fontSize: 10, color: "#f87171", background: "#f8717115", border: "1px solid #f8717144", borderRadius: 8, padding: "8px 14px", cursor: "pointer" }}>
              CLEAR CART
            </button>
          )}
        </div>
        <div style={{ marginTop: 12, padding: "8px 10px", background: "#13131f", borderRadius: 6, fontFamily: "JetBrains Mono", fontSize: 10, color: "#4b5563", lineHeight: 1.6 }}>
          dispatch(&#123; type: 'cart/add', payload: product &#125;)
        </div>
      </div>
    </div>
  );
}

// ─── CONCEPTS CARDS ────────────────────────────────────────────────────────────
const concepts = [
  { icon: "◎", color: "#fb923c", title: "Store", desc: "The single source of truth. One store holds all your app's state. configureStore() creates it with Redux DevTools and middleware baked in." },
  { icon: "⬡", color: "#22d3ee", title: "Slice", desc: "A slice bundles name + initialState + reducers for one feature. createSlice() auto-generates action creators and action types." },
  { icon: "◈", color: "#f472b6", title: "Action", desc: "Plain objects with a type and optional payload. Slices auto-generate them. You dispatch them to trigger state changes." },
  { icon: "⚙", color: "#4ade80", title: "Reducer", desc: "Pure functions that take state + action → new state. RTK uses Immer, so you can 'mutate' state directly — it handles immutability." },
  { icon: "→", color: "#818cf8", title: "Dispatch", desc: "The only way to update state. Call dispatch(action) to send an action through the store's reducers." },
  { icon: "◉", color: "#fbbf24", title: "Selector", desc: "Functions that extract specific data from state. useSelector(fn) subscribes your component to re-render when that slice changes." },
  { icon: "⟳", color: "#a78bfa", title: "Thunk", desc: "createAsyncThunk handles async logic (API calls). It auto-dispatches pending/fulfilled/rejected actions for you." },
  { icon: "⬥", color: "#34d399", title: "Immer", desc: "RTK bundles Immer under the hood. Write reducers that look mutating but are actually immutable — no more spread operators everywhere." },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("concepts");
  const tabs = [
    { id: "concepts", label: "Core Concepts" },
    { id: "flow", label: "How It Works" },
    { id: "counter", label: "Counter Demo" },
    { id: "todos", label: "Todos Slice" },
    { id: "cart", label: "Cart Slice" },
    { id: "code", label: "Code Patterns" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#060609", fontFamily: "Syne, sans-serif", color: "#f1f5f9" }}>
      {/* Grid background */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(#6366f108 1px, transparent 1px), linear-gradient(90deg, #6366f108 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "#06060990", backdropFilter: "blur(20px)", borderBottom: "1px solid #1e1e2e", padding: "0 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #818cf8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>R</div>
            <div>
              <div style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 16, letterSpacing: -0.3 }}>Redux Toolkit</div>
              <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#6366f1", letterSpacing: 1 }}>INTERACTIVE GUIDE</div>
            </div>
          </div>
          <a
            href="https://redux-toolkit.js.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: "Space Mono", fontSize: 11, color: "#818cf8", background: "#818cf815", border: "1px solid #818cf844", borderRadius: 8, padding: "8px 14px", textDecoration: "none", letterSpacing: 0.5 }}
          >
            OFFICIAL DOCS ↗
          </a>
        </div>
      </header>

      {/* Hero */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px 0" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "inline-flex", gap: 8, marginBottom: 20 }}>
            <Tag color="#4ade80">v2.x</Tag>
            <Tag color="#22d3ee">React + RTK</Tag>
            <Tag color="#f472b6">Interactive</Tag>
          </div>
          <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1.05, margin: "0 0 16px", letterSpacing: -2 }}>
            Redux Toolkit
            <br />
            <span style={{ background: "linear-gradient(135deg, #6366f1, #818cf8, #22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>without the headache</span>
          </h1>
          <p style={{ fontFamily: "Syne", fontSize: 18, color: "#64748b", maxWidth: 560, margin: "0 auto 0", lineHeight: 1.6 }}>
            The official, opinionated way to write Redux. Less boilerplate, better defaults, fully interactive demos below.
          </p>
        </div>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#1e1e2e", borderRadius: 12, overflow: "hidden", marginBottom: 48 }}>
          {[
            { label: "Weekly Downloads", val: "~9M", color: "#4ade80" },
            { label: "Boilerplate Reduction", val: "~70%", color: "#22d3ee" },
            { label: "Core APIs", val: "7", color: "#f472b6" },
            { label: "Bundle Size", val: "~45kB", color: "#fb923c" },
          ].map(s => (
            <div key={s.label} style={{ background: "#0d0d14", padding: "20px 16px", textAlign: "center" }}>
              <div style={{ fontFamily: "Space Mono", fontWeight: 700, fontSize: 24, color: s.color }}>{s.val}</div>
              <div style={{ fontFamily: "Space Mono", fontSize: 9, color: "#334155", marginTop: 4, letterSpacing: 0.5 }}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Nav Tabs */}
        <div style={{ display: "flex", gap: 4, overflowX: "auto", marginBottom: 32, paddingBottom: 2 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ fontFamily: "Space Mono", fontSize: 11, letterSpacing: 0.5, color: activeTab === t.id ? "#818cf8" : "#4b5563", background: activeTab === t.id ? "#818cf815" : "transparent", border: `1px solid ${activeTab === t.id ? "#818cf844" : "transparent"}`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab: Concepts ── */}
        {activeTab === "concepts" && (
          <div>
            <SectionTitle step={1} title="Core Concepts" sub="The 8 building blocks of Redux Toolkit — click to explore." />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {concepts.map(c => (
                <div key={c.title} style={{ background: "#0d0d14", border: `1px solid ${c.color}22`, borderRadius: 12, padding: 20, transition: "border-color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = c.color + "66")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = c.color + "22")}>
                  <div style={{ fontSize: 24, marginBottom: 10 }}>{c.icon}</div>
                  <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, color: c.color, marginBottom: 6 }}>{c.title}</div>
                  <div style={{ fontFamily: "Syne", fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{c.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, padding: 24, background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 12 }}>
              <p style={{ fontFamily: "Space Mono", fontSize: 10, color: "#6366f1", letterSpacing: 2, margin: "0 0 12px" }}>WHY RTK OVER VANILLA REDUX?</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <p style={{ fontFamily: "Space Mono", fontSize: 10, color: "#f87171", margin: "0 0 8px" }}>❌ WITHOUT RTK</p>
                  {["Manual action type constants", "Separate action creators", "Verbose switch reducers", "Manual Immer / spread ops", "Setup middleware by hand", "No DevTools by default"].map(x => (
                    <div key={x} style={{ fontFamily: "Syne", fontSize: 13, color: "#4b5563", padding: "3px 0", borderBottom: "1px solid #0f172a" }}>{x}</div>
                  ))}
                </div>
                <div>
                  <p style={{ fontFamily: "Space Mono", fontSize: 10, color: "#4ade80", margin: "0 0 8px" }}>✓ WITH RTK</p>
                  {["Auto-generated action types", "Actions from slice.actions", "Concise createSlice reducers", "Immer built-in", "configureStore() defaults", "DevTools pre-configured"].map(x => (
                    <div key={x} style={{ fontFamily: "Syne", fontSize: 13, color: "#94a3b8", padding: "3px 0", borderBottom: "1px solid #0f172a" }}>{x}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Flow ── */}
        {activeTab === "flow" && (
          <div>
            <SectionTitle step={2} title="How Redux Works" sub="The unidirectional data flow — click each node to understand its role." />
            <FlowDiagram />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
              {[
                { step: "1", title: "User interaction", desc: "User clicks a button in the UI, triggering an event handler.", color: "#22d3ee" },
                { step: "2", title: "dispatch(action)", desc: "The component calls dispatch() with an action object.", color: "#818cf8" },
                { step: "3", title: "Reducer runs", desc: "The store passes the action to the relevant slice reducer.", color: "#4ade80" },
                { step: "4", title: "UI re-renders", desc: "useSelector detects state change and triggers a re-render.", color: "#fb923c" },
              ].map(s => (
                <div key={s.step} style={{ background: "#0d0d14", border: `1px solid ${s.color}22`, borderRadius: 10, padding: 16, display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "Space Mono", fontSize: 18, fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.step}</span>
                  <div>
                    <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 14, color: s.color, marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontFamily: "Syne", fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Counter ── */}
        {activeTab === "counter" && (
          <div>
            <SectionTitle step={3} title="Counter — Live Slice" sub="The classic Redux demo. Dispatches actions, updates state, logs every change." />
            <CounterDemo />
            <CodeBlock code={snippets.slice} label="counterSlice.js" />
            <CodeBlock code={snippets.dispatch} label="Counter Component" />
          </div>
        )}

        {/* ── Tab: Todos ── */}
        {activeTab === "todos" && (
          <div>
            <SectionTitle step={4} title="Todos — Slice with Filters" sub="Add, toggle, delete todos. See the live state object update in real time." />
            <TodoDemo />
            <CodeBlock
              code={`const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], filter: 'all' },
  reducers: {
    add: (state, action) => {
      state.items.push({
        id: Date.now(),
        text: action.payload,
        completed: false,
      })
    },
    toggle: (state, action) => {
      const item = state.items.find(t => t.id === action.payload)
      if (item) item.completed = !item.completed
    },
    remove: (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload)
    },
    setFilter: (state, action) => {
      state.filter = action.payload
    },
  },
})`}
              label="todosSlice.js"
            />
          </div>
        )}

        {/* ── Tab: Cart ── */}
        {activeTab === "cart" && (
          <div>
            <SectionTitle step={5} title="Shopping Cart — Multiple Slices" sub="Real-world pattern: products + cart as separate slices. Add, remove, clear." />
            <CartDemo />
            <CodeBlock
              code={`const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    add: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        existing.qty += 1        // Immer allows 'mutation'!
      } else {
        state.items.push({ ...action.payload, qty: 1 })
      }
    },
    remove: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload)
    },
    clear: (state) => {
      state.items = []
    },
  },
})

// Selector with derived data
export const selectTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0)`}
              label="cartSlice.js"
            />
          </div>
        )}

        {/* ── Tab: Code ── */}
        {activeTab === "code" && (
          <div>
            <SectionTitle step={6} title="Essential Code Patterns" sub="Copy-paste ready snippets for every RTK use case." />
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Tag color="#fb923c">STORE SETUP</Tag>
                  <span style={{ fontFamily: "Syne", fontSize: 14, color: "#64748b" }}>Start every project here</span>
                </div>
                <CodeBlock code={snippets.store} label="store.js" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Tag color="#f472b6">CREATE SLICE</Tag>
                  <span style={{ fontFamily: "Syne", fontSize: 14, color: "#64748b" }}>One slice per feature</span>
                </div>
                <CodeBlock code={snippets.slice} label="counterSlice.js" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Tag color="#818cf8">IN COMPONENTS</Tag>
                  <span style={{ fontFamily: "Syne", fontSize: 14, color: "#64748b" }}>useDispatch + useSelector</span>
                </div>
                <CodeBlock code={snippets.dispatch} label="Counter.jsx" />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Tag color="#a78bfa">ASYNC THUNK</Tag>
                  <span style={{ fontFamily: "Syne", fontSize: 14, color: "#64748b" }}>API calls made easy</span>
                </div>
                <CodeBlock code={snippets.async} label="usersSlice.js" />
              </div>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div style={{ margin: "60px 0 40px", padding: 32, background: "linear-gradient(135deg, #6366f115, #818cf810)", border: "1px solid #6366f133", borderRadius: 16, textAlign: "center" }}>
          <p style={{ fontFamily: "Space Mono", fontSize: 10, color: "#6366f1", letterSpacing: 2, margin: "0 0 12px" }}>READY TO GO DEEPER?</p>
          <h3 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 24, margin: "0 0 10px", color: "#f1f5f9" }}>Official Documentation</h3>
          <p style={{ fontFamily: "Syne", fontSize: 14, color: "#64748b", margin: "0 0 20px" }}>API reference, migration guides, TypeScript setup, RTK Query, and more — all on the official site.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://redux-toolkit.js.org/introduction/getting-started" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "Space Mono", fontSize: 12, color: "#060609", background: "#818cf8", borderRadius: 10, padding: "12px 24px", textDecoration: "none", fontWeight: 700 }}>
              GET STARTED ↗
            </a>
            <a href="https://redux-toolkit.js.org/api/configureStore" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "Space Mono", fontSize: 12, color: "#818cf8", background: "#818cf815", border: "1px solid #818cf844", borderRadius: 10, padding: "12px 24px", textDecoration: "none" }}>
              API REFERENCE ↗
            </a>
            <a href="https://redux.js.org/tutorials/essentials/part-1-overview-concepts" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "Space Mono", fontSize: 12, color: "#22d3ee", background: "#22d3ee15", border: "1px solid #22d3ee44", borderRadius: 10, padding: "12px 24px", textDecoration: "none" }}>
              FULL TUTORIAL ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
