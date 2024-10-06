import { memo, useEffect, useRef } from "react";

function TradingViewWidget({ symbol }: { symbol: string }) {
  const container = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
          "autosize": true,
          "width": "100%",
          "height": "100%",
          "symbol": "${symbol}",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "3",
          "locale": "en",
          "backgroundColor": "rgba(20, 20, 20, 1)",
          "hide_top_toolbar": false,
          "withdateranges": true,
          "allow_symbol_change": false,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
    if (container.current) container.current.appendChild(script);
    scriptLoaded.current = true;

    return () => {
      if (container.current && script.parentNode === container.current) {
        container.current.removeChild(script);
      }
      scriptLoaded.current = false;
    };
  }, [symbol]);

  return (
    <div className="tradingview-widget-container " ref={container}>
      <div className="tradingview-widget-container__widget rounded"></div>
      <div className="tradingview-widget-copyright"></div>
    </div>
  );
}

export default memo(TradingViewWidget);
