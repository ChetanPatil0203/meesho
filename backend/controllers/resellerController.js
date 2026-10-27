import { resellerService } from '../services/resellerService.js';

export const resellerController = {
  // GET /api/reseller/profile
  async getProfile(req, res) {
    try {
      const profile = await resellerService.getProfile();
      res.json(profile);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // PUT /api/reseller/bank
  async updateBank(req, res) {
    try {
      const { accountHolder, bankName, accountNumber, ifsc, upiId } = req.body;
      if (!accountHolder && !bankName && !accountNumber && !upiId) {
        return res.status(400).json({ error: 'At least one bank or UPI field is required' });
      }

      const updated = await resellerService.updateBank({
        accountHolder,
        bankName,
        accountNumber,
        ifsc,
        upiId,
      });

      res.json({ message: 'Reseller bank details updated', profile: updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/reseller/withdraw
  async withdraw(req, res) {
    try {
      const { amount } = req.body;
      const receipt = await resellerService.withdraw(amount);
      res.json({ message: 'Withdrawal processed successfully', receipt });
    } catch (err) {
      if (err.message === 'INVALID_WITHDRAWAL_AMOUNT') {
        return res.status(400).json({ error: 'Invalid withdrawal amount or insufficient pending margin' });
      }
      res.status(500).json({ error: err.message });
    }
  },
};
