import { WebsocketAPI } from "tradingview-api";

class TradingViewService {
  private api: WebsocketAPI | null = null;
  private isConnected = false;
  private subscriptions: Map<string, any> = new Map();

  async connect(): Promise<boolean> {
    try {
      this.api = new WebsocketAPI();
      await this.api.connect();
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error("Failed to connect to TradingView API:", error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.api && this.isConnected) {
      try {
        await this.api.disconnect();
        this.isConnected = false;
      } catch (error) {
        console.error("Error disconnecting from TradingView API:", error);
      }
    }
  }

  async subscribeToSymbol(
    symbol: string,
    timeframe: string,
    callback: (data: any) => void,
  ): Promise<boolean> {
    if (!this.api || !this.isConnected) {
      await this.connect();
    }

    try {
      // Format symbol for TradingView (e.g., BINANCE:BTCUSDT)
      const formattedSymbol = this.formatSymbol(symbol);

      // Map timeframe to TradingView format
      const tvTimeframe = this.mapTimeframe(timeframe);

      // Create a chart session
      const chart = await this.api!.createChart(formattedSymbol, tvTimeframe);

      // Subscribe to chart updates
      chart.onUpdate((data) => {
        callback(this.transformChartData(data, timeframe));
      });

      // Store subscription for later cleanup
      this.subscriptions.set(`${symbol}-${timeframe}`, chart);

      return true;
    } catch (error) {
      console.error(`Failed to subscribe to ${symbol}:`, error);
      return false;
    }
  }

  unsubscribeFromSymbol(symbol: string, timeframe: string): void {
    const key = `${symbol}-${timeframe}`;
    const subscription = this.subscriptions.get(key);

    if (subscription) {
      try {
        subscription.unsubscribe();
        this.subscriptions.delete(key);
      } catch (error) {
        console.error(`Error unsubscribing from ${symbol}:`, error);
      }
    }
  }

  private formatSymbol(symbol: string): string {
    // Map common crypto symbols to TradingView format
    const symbolMap: Record<string, string> = {
      BTC: "BINANCE:BTCUSDT",
      ETH: "BINANCE:ETHUSDT",
      SOL: "BINANCE:SOLUSDT",
      XRP: "BINANCE:XRPUSDT",
      ADA: "BINANCE:ADAUSDT",
      DOGE: "BINANCE:DOGEUSDT",
      DOT: "BINANCE:DOTUSDT",
      AVAX: "BINANCE:AVAXUSDT",
      MATIC: "BINANCE:MATICUSDT",
      LINK: "BINANCE:LINKUSDT",
    };

    // Extract symbol from format like "Bitcoin (BTC)"
    const match = symbol.match(/\((\w+)\)/);
    const extractedSymbol = match ? match[1] : symbol;

    return symbolMap[extractedSymbol] || `BINANCE:${extractedSymbol}USDT`;
  }

  private mapTimeframe(timeframe: string): string {
    // Map app timeframes to TradingView timeframes
    const timeframeMap: Record<string, string> = {
      "1D": "1", // 1 day
      "1W": "1W", // 1 week
      "1M": "1M", // 1 month
      "1Y": "12M", // 1 year
    };

    return timeframeMap[timeframe] || "1";
  }

  private transformChartData(data: any, timeframe: string): any[] {
    // Transform TradingView data to our app's format
    if (!data || !data.bars || !Array.isArray(data.bars)) {
      return [];
    }

    return data.bars.map((bar: any) => ({
      timestamp: bar.time * 1000, // Convert to milliseconds
      price: bar.close,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
      volume: bar.volume,
    }));
  }
}

// Create a singleton instance
const tradingViewService = new TradingViewService();
export default tradingViewService;
