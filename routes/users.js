import express from 'express';
import {
  getPortfolio,
  addToPortfolio,
  removeFromPortfolio,
  updatePortfolioItem
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/portfolio', getPortfolio);
router.post('/portfolio', addToPortfolio);
router.delete('/portfolio/:symbol', removeFromPortfolio);
router.put('/portfolio/:symbol', updatePortfolioItem);

export default router;
