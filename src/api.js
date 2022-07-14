const API_KEY =
  "6c0dde852a9ca323232b3e732eba990601a677f4e6eb69717eb3fc9a7710cf95";

const tickersHandlers = new Map();
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const AGREGATE_INDEX = "5";
// const BITOC = "BTC";

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
    // MESSAGE: message,
    // PARAMETER: parameter,
  } = JSON.parse(e.data);

  if (type !== AGREGATE_INDEX || newPrice === undefined) {
    return;
  }

  const handlers = tickersHandlers.get(currency) ?? [];
  handlers.forEach((fn) => fn(newPrice));
});

//TODO: refactor to use URLSearchParams
// const loadTickers = () => {
//   if (tickersHandlers.size === 0) {
//     return;
//   }

//   fetch(
//     `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
//       ...tickersHandlers.keys(),
//     ].join(",")}&tsyms=USD&api_key=${API_KEY}`
//   )
//     .then((r) => r.json())
//     .then((rawData) => {
//       const updatedPrices = Object.fromEntries(
//         Object.entries(rawData).map(([key, value]) => [key, value.USD])
//       );

//       Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
//         const handlers = tickersHandlers.get(currency) ?? [];
//         handlers.forEach((fn) => fn(newPrice));
//       });
//     });
// };

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}

function subscribeToTickerOnWs(ticker, exchange = "USD") {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~${exchange}`],
  });
}

function unsubscribeFromTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  });
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWs(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWs(ticker);
};

export const loadCoins = async () => {
  const response = await fetch(
    "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"
  );

  const data = await response.json();
  return Object.values(data.Data);
};
