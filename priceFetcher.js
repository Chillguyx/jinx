const axios = require('axios');
const calculateRSI = require('./rsiCalculator');  // Import the RSI calculation function

// Fetch Solana price
async function fetchSolanaPrice() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    return response.data.solana.usd;
  } catch (error) {
    console.error("Error fetching Solana price:", error);
    return null;
  }
}

module.exports = { fetchSolanaPrice };

// Calculate RSI (Relative Strength Index)
function calculateRSI(prices, period = 14) {
  let gains = 0;
  let losses = 0;

  // Calculate the gains and losses for the initial period
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }

  // Average gain and loss
  let averageGain = gains / period;
  let averageLoss = losses / period;

  // Initialize RSI value to 0
  let rsi = 0;

  // Calculate RSI for the rest of the data
  for (let i = period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      averageGain = ((averageGain * (period - 1)) + change) / period;
      averageLoss = (averageLoss * (period - 1)) / period;
    } else {
      averageLoss = ((averageLoss * (period - 1)) - change) / period;
      averageGain = (averageGain * (period - 1)) / period;
    }

    // Avoid division by zero
    const rs = averageLoss === 0 ? 100 : averageGain / averageLoss;
    rsi = 100 - (100 / (1 + rs));
  }

  return rsi; // Return the last calculated RSI value
}
