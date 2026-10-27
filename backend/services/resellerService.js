// In-memory / storage fallback for reseller hub
let resellerData = {
  accountHolder: 'Pooja Kadam',
  bankName: 'State Bank of India',
  accountNumber: '•••• •••• 8921',
  ifsc: 'SBIN0001234',
  upiId: 'pooja@sbi',
  pendingMargin: 2450,
  totalWithdrawn: 14800,
  tier: 'Gold Reseller',
  ordersResold: 28,
};

export const resellerService = {
  async getProfile() {
    return resellerData;
  },

  async updateBank(details) {
    resellerData = {
      ...resellerData,
      accountHolder: details.accountHolder || resellerData.accountHolder,
      bankName: details.bankName || resellerData.bankName,
      accountNumber: details.accountNumber || resellerData.accountNumber,
      ifsc: details.ifsc || resellerData.ifsc,
      upiId: details.upiId || resellerData.upiId,
    };
    return resellerData;
  },

  async withdraw(requestedAmount) {
    const amount = Number(requestedAmount) || resellerData.pendingMargin;
    if (amount <= 0 || amount > resellerData.pendingMargin) {
      throw new Error('INVALID_WITHDRAWAL_AMOUNT');
    }

    resellerData.pendingMargin -= amount;
    resellerData.totalWithdrawn += amount;

    return {
      success: true,
      withdrawnAmount: amount,
      remainingPending: resellerData.pendingMargin,
      payoutDestination: resellerData.upiId || `${resellerData.bankName} (${resellerData.accountNumber})`,
      transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      timestamp: new Date().toISOString(),
    };
  },
};
