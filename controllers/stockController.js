import axios from 'axios';

const finnhubClient = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  params: {
    token: process.env.FINNHUB_API_KEY
  }
});

// Get real-time stock quote
export const getStockQuote = async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await finnhubClient.get(`/quote`, {
      params: { symbol: symbol.toUpperCase() }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stock data', error: error.message });
  }
};

// Get stock candles (historical data)
export const getStockCandles = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { from, to, resolution } = req.query;
    
    const response = await finnhubClient.get(`/stock/candle`, {
      params: {
        symbol: symbol.toUpperCase(),
        resolution,
        from,
        to
      }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching historical data', error: error.message });
  }
};

// Get company profile
export const getCompanyProfile = async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await finnhubClient.get(`/stock/profile2`, {
      params: { symbol: symbol.toUpperCase() }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company profile', error: error.message });
  }
};

// Search stocks
export const searchStocks = async (req, res) => {
  try {
    const { query } = req.query;
    const response = await finnhubClient.get(`/search`, {
      params: { q: query }
    });
    
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error searching stocks', error: error.message });
  }
};
