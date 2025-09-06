"use client";
import config from "@/config";
import { useUser } from "@auth0/nextjs-auth0";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";


// interface Message {
//   from: string;
//   text: string;
//   data?: {
//     message_date?: string;
//     [key: string]: any;
//   };
//   id?: string;
//   client_msg_id?: string;
// }

interface MessageData {
  message_date?: string;
  username?: string;
  gmail?: string;
  image?: string;
  messageid?: string;
  fromType?: string;
}

interface Message {
  from: string;
  text: string;
  data?: MessageData;
  id?: string;
  client_msg_id?: string;
}


const ChatWidget: React.FC = () => {
  const { user} = useUser();
    console.log("user as status",user)
  const clientId = user?.email;
  const username = user?.name;

  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const ws = useRef<WebSocket | null>(null);

  const toggleChat = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    // ws.current = new WebSocket(`ws://${config.apiUrl}/api/ws/client/${clientId}`);
    ws.current = new WebSocket(`ws://${config.apiUrl.replace(/^http(s)?:\/\//, "")}/api/ws/client/${clientId}`);


    ws.current.onopen = () => {
      console.log("✅ Client connected");
    };

    ws.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log("messagess", data);

      if (data.type === "message") {
        setMessages((prev) => [
          ...prev,
          { from: "agent", text: data.message, data },
        ]);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [clientId]);

  const sendMessage = (text: string) => {
    if (!ws.current) return;

    ws.current.send(
      JSON.stringify({
        fromType: "client",
        message: text,
        username: username,
        gmail: "user123@gmail.com",
        image:user?.picture,
        messageid: uuidv4(),
      })
    );

    setMessages((prev) => [...prev, { from: username as string, text }]);
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 999 }}>
      {open ? (
        <div
          style={{
            width: 320,
            height: 420,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              background: "#4462ff",
              color: "#fff",
              padding: 10,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Chat with us</span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
            {messages.map((m, i) => {
              const agent = m.from === "agent";
              return (
                <div
                  key={m.id || m.client_msg_id || i}
                  style={{
                    display: "flex",
                    justifyContent: agent ? "flex-start" : "flex-end",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      background: agent ? "#4462ff" : "#f4f4f4",
                      color: agent ? "#fff" : "#000",
                      padding: "8px 10px",
                      borderRadius: 10,
                      maxWidth: "75%",
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: m.text.replace(
                          /(https?:\/\/[^\s]+)/g,
                          "<a href='$1' target='_blank' style='text-decoration: underline; word-break:break-all;'>$1</a>"
                        ),
                      }}
                    />
                    {m?.data?.message_date && (
                      <div
                        style={{
                          fontSize: 10,
                          opacity: 0.75,
                          marginTop: 4,
                        }}
                      >
                        {new Date(m.data.message_date).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", padding: 10, gap: 6 }}>
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const target = e.target as HTMLInputElement;
                  if (target.value.trim()) {
                    sendMessage(target.value);
                    target.value = "";
                  }
                }
              }}
              placeholder="Type a message…"
              style={{
                flex: 1,
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: "8px 10px",
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector(
                  "input[placeholder='Type a message…']"
                ) as HTMLInputElement | null;
                if (input && input.value.trim()) {
                  sendMessage(input.value);
                  input.value = "";
                }
              }}
              style={{
                background: "#4462ff",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          style={{
            background: "#4462ff",
            color: "#fff",
            border: "none",
            width: 56,
            height: 56,
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: 22,
          }}
        >
          💬
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
