import { useWebSocket, UseWebSocketReturn } from "@vueuse/core";

let wsInstance: UseWebSocketReturn<any>;
const listeners = new Map();

/**
 * 开启 WebSocket 链接，全局只需执行一次
 * @param url
 */
export function connectWebSocket(url: string) {
  wsInstance = useWebSocket(url, {
    heartbeat: {
      interval: 60000
    },
    autoReconnect: {
      retries: 5,
      delay: 5000
    },
    onError,
    onMessage,
    onConnected
  });
}

// 连接成功事件
const onConnected = ws => {
  console.log("WebSocket 连接成功！url=" + ws.url);
};

// 连接失败事件
const onError = (ws, e) => {
  console.log("[WebSocket] 连接发生错误: ", e);
};

// 收到消息事件
function onMessage(ws, e) {
  try {
    const data = JSON.parse(e.data);
    for (const callback of listeners.keys()) {
      try {
        callback(data);
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error("[WebSocket] data解析失败：", err);
  }
}

/**
 * 添加 WebSocket 消息监听
 * @param callback
 */
export function onWebSocket(callback: (data: object) => any) {
  if (!listeners.has(callback)) {
    if (typeof callback === "function") {
      listeners.set(callback, null);
    } else {
      console.log("[WebSocket] 添加 WebSocket 消息监听失败：传入的参数不是一个方法");
    }
  }
}

/**
 * 解除 WebSocket 消息监听
 *
 * @param callback
 */
export function offWebSocket(callback: (data: object) => any) {
  listeners.delete(callback);
}

export function useMyWebSocket() {
  return wsInstance;
}
