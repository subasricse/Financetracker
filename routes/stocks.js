import express from 'express';
import {
  getStockQuote,
  getStockCandles,
  getCompanyProfile,
  searchStocks
} from '../controllers/stockController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/quote/:symbol', getStockQuote);
router.get('/candles/:symbol', getStockCandles);
router.get('/profile/:symbol', getCompanyProfile);
router.get('/search', searchStocks);

export default router;
