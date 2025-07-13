import User from '../models/User.js';

// Get user portfolio
export const getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching portfolio', error: error.message });
  }
};

// Add stock to portfolio
export const addToPortfolio = async (req, res) => {
  try {
    const { symbol, shares, averagePrice } = req.body;
    const totalInvestment = shares * averagePrice;

    const user = await User.findById(req.user.id);
    
    // Check if stock already exists in portfolio
    const stockIndex = user.portfolio.findIndex(item => item.symbol === symbol);
    
    if (stockIndex > -1) {
      // Update existing stock
      const existingStock = user.portfolio[stockIndex];
      const newShares = existingStock.shares + shares;
      const newTotalInvestment = existingStock.totalInvestment + totalInvestment;
      const newAveragePrice = newTotalInvestment / newShares;

      user.portfolio[stockIndex] = {
        symbol,
        shares: newShares,
        averagePrice: newAveragePrice,
        totalInvestment: newTotalInvestment
      };
    } else {
      // Add new stock
      user.portfolio.push({
        symbol,
        shares,
        averagePrice,
        totalInvestment
      });
    }

    await user.save();
    res.json(user.portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to portfolio', error: error.message });
  }
};

// Remove stock from portfolio
export const removeFromPortfolio = async (req, res) => {
  try {
    const { symbol } = req.params;
    const user = await User.findById(req.user.id);
    
    user.portfolio = user.portfolio.filter(item => item.symbol !== symbol);
    await user.save();
    
    res.json(user.portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from portfolio', error: error.message });
  }
};

// Update portfolio item
export const updatePortfolioItem = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { shares, averagePrice } = req.body;
    
    const user = await User.findById(req.user.id);
    const stockIndex = user.portfolio.findIndex(item => item.symbol === symbol);
    
    if (stockIndex === -1) {
      return res.status(404).json({ message: 'Stock not found in portfolio' });
    }
    
    user.portfolio[stockIndex] = {
      symbol,
      shares,
      averagePrice,
      totalInvestment: shares * averagePrice
    };
    
    await user.save();
    res.json(user.portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Error updating portfolio', error: error.message });
  }
};
