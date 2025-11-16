import React, { useEffect, useState, useMemo } from "react";
import "./NewsTicker.css";
// Carrega todos os ícones SVG disponíveis em src/assets/icons
const ICONS = import.meta.glob("../assets/icons/*.svg", { eager: true, import: "default" });

const DEFAULT_IDS = [
  "bitcoin",
  "ethereum",
  "tether",
  "binancecoin",
  "solana",
  "cardano",
  "dogecoin",
  "ripple", // XRP
  "tron",
  "polkadot",
  "litecoin",
  "polygon", // MATIC (Polygon)
  "usd-coin",
];

function formatCurrency(value, currency = "BRL") {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
      minimumFractionDigits: value < 100 ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value?.toFixed?.(2) ?? value}`;
  }
}

export default function NewsTicker({ ids = DEFAULT_IDS, vsCurrency = "BRL", refreshMs = 60000 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setError(null);
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${encodeURIComponent(
          vsCurrency.toLowerCase()
        )}&ids=${encodeURIComponent(ids.join(","))}&order=market_cap_desc&per_page=${ids.length}&page=1&sparkline=false&price_change_percentage=24h`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao obter cotações");
        const data = await res.json();
        const mapped = data.map((c) => ({
          id: c.id,
          symbol: (c.symbol || "").toUpperCase(),
          name: c.name,
          price: c.current_price,
          change24h: c.price_change_percentage_24h,
          url: `https://www.coingecko.com/pt/moedas/${c.id}`,
        }));
        if (alive) setItems(mapped);
      } catch (e) {
        console.error(e);
        if (alive) setError("Não foi possível carregar cotações agora.");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    const t = setInterval(load, refreshMs);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [ids, vsCurrency, refreshMs]);

  // Resolve a URL de ícone local (src/assets/icons SVG) com base no id/símbolo do ativo
  const getIconUrl = useMemo(() => {
    const files = Object.keys(ICONS);
    return (id, symbol) => {
      const s = (symbol || "").toLowerCase();
      const i = (id || "").toLowerCase();
      // Sinônimos prioritários primeiro
      const synonymMap = {
        // BTC: use variante laranja quando disponível
        bitcoin: ["btc-orange.svg", "btc.svg", "bitcoin.svg"],
        // ETH
        ethereum: ["eth.svg", "ethereum.svg"],
        // USDT
        tether: ["usdt.svg", "tether.svg"],
        // BNB
        binancecoin: ["bnb.svg", "binance.svg", "binancecoin.svg"],
        // SOL
        solana: ["sol.svg", "solana.svg"],
        // ADA
        cardano: ["ada.svg", "cardano.svg"],
        // DOGE
        dogecoin: ["doge.svg", "dogecoin.svg"],
        // XRP
        ripple: ["xrp.svg", "ripple.svg"],
        // TRX
        tron: ["trx.svg", "tron.svg"],
        // DOT
        polkadot: ["dot.svg", "polkadot.svg"],
        // LTC
        litecoin: ["ltc.svg", "litecoin.svg"],
        // MATIC / POL
        polygon: ["matic.svg", "pol.svg", "poly.svg"],
        // USDC
        "usd-coin": ["usdc.svg", "usd-coin.svg"],
      };
      const candidates = [];
      if (synonymMap[i]) candidates.push(...synonymMap[i]);
      candidates.push(`${i}.svg`, `${s}.svg`);
      for (const name of candidates) {
        const match = files.find((p) => p.endsWith(`/icons/${name}`));
        if (match) return ICONS[match];
      }
      return undefined;
    };
  }, []);

  const rollingItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    return [...items, ...items]; // duplicado para rolagem contínua
  }, [items]);

  return (
    <section className="news-ticker" aria-label="Cotações de criptomoedas">
      <div className="container">
        <div className="news-ticker__viewport">
          <span
            className="news-ticker__label news-ticker__label--live"
            aria-label="Cotações em tempo real"
          >
            <span className="live-indicator" aria-hidden="true"></span>
            <span className="sr-only">Tempo real</span>
          </span>

          {loading && (
            <div className="news-ticker__loading" role="status" aria-live="polite">
              Carregando cotações...
            </div>
          )}

          {!loading && error && (
            <div className="news-ticker__error" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="news-ticker__track" aria-live="polite">
              <ul className="news-ticker__list">
                {rollingItems.map((item, idx) => {
                  const isUp = typeof item.change24h === "number" && item.change24h >= 0;
                  const changeStr =
                    typeof item.change24h === "number"
                      ? `${isUp ? "▲" : "▼"} ${Math.abs(item.change24h).toFixed(2)}%`
                      : "";
                  const iconUrl = getIconUrl(item.id, item.symbol);
                  return (
                    <li className="news-ticker__item" key={`${idx}-${item.id}`}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="news-ticker__link"
                      >
                        {iconUrl && (
                          <img
                            src={iconUrl}
                            alt=""
                            className="news-ticker__icon-img"
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                        <span className="news-ticker__symbol">{item.symbol}</span>
                        <span className="news-ticker__price">
                          {formatCurrency(item.price, vsCurrency.toUpperCase())}
                        </span>
                        <span className={`news-ticker__change ${isUp ? "up" : "down"}`}>
                          {changeStr}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
