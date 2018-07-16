// ContentScript for FaucetHub
import { calcPercentage, calcWithdrawalFee } from "./utils";

const withdrawals = {
  bitcoin: {
    symbol: 'BTC',
    minimum: 0.0002,
    fees: [
      { amount: 0.00020000, fee: 0.00000400 },
      { amount: 0.00050000, fee: 0.00000300 },
      { amount: 0.00075000, fee: 0.00000200 },
      { amount: 0.00100000, fee: 0.00000100 },
      { amount: 0.00250000, fee: 0.00000050 },
      { amount: 0.00500000, fee: 0.00000025 },
      { amount: 0.01000000, fee: 0.00000010 }
    ]
  },
  ethereum: {
    symbol: 'ETH',
    minimum: 0.01000000,
    fees: [
      { amount: 0.01000000, fee: 0.00100000 },
      { amount: 0.05000000, fee: 0.00075000 },
      { amount: 0.10000000, fee: 0.00025000 }
    ]
  },
  monero: {
    symbol: 'XMR',
    minimum: 0.01000000,
    fees: [
      { amount: 0.01000000, fee: 0.00050000 },
      { amount: 0.05000000, fee: 0.00030000 },
      { amount: 0.10000000, fee: 0.00010000 }
    ]
  },
  litecoin: {
    symbol: 'LTC',
    minimum: 0.01000000,
    fees: [
      { amount: 0.01000000, fee: 0.00080000 },
      { amount: 0.05000000, fee: 0.00060000 },
      { amount: 0.10000000, fee: 0.00040000 },
      { amount: 0.15000000, fee: 0.00020000 },
      { amount: 0.20000000, fee: 0.00010000 },
      { amount: 0.50000000, fee: 0.00005000 },
      { amount: 1.00000000, fee: 0.00002000 },
    ]
  },
  dogecoin: {
    symbol: 'DOGE',
    minimum: 10.00000000,
    fees: [
      { amount: 10.00000000, fee: 0.08000000 },
      { amount: 15.00000000, fee: 0.06000000 },
      { amount: 20.00000000, fee: 0.04000000 },
      { amount: 50.00000000, fee: 0.02000000 },
      { amount: 100.00000000, fee: 0.01000000 },
      { amount: 250.00000000, fee: 0.00500000 },
      { amount: 500.00000000, fee: 0.00200000 }
    ]
  },
  'bitcoin-cash': {
    symbol: 'BCH',
    minimum: 0.0002,
    fees: [
      { amount: 0.00020000, fee: 0.00000400 },
      { amount: 0.00050000, fee: 0.00000300 },
      { amount: 0.00075000, fee: 0.00000200 },
      { amount: 0.00100000, fee: 0.00000100 },
      { amount: 0.00250000, fee: 0.00000050 },
      { amount: 0.00500000, fee: 0.00000025 },
      { amount: 0.01000000, fee: 0.00000010 }
    ]
  },
  zcash: {
    symbol: 'ZEC',
    minimum: 0.01000000,
    fees: [
      { amount: 0.01000000, fee: 0.00080000 },
      { amount: 0.05000000, fee: 0.00060000 },
      { amount: 0.10000000, fee: 0.00040000 },
      { amount: 0.15000000, fee: 0.00020000 },
      { amount: 0.20000000, fee: 0.00010000 },
      { amount: 0.50000000, fee: 0.00005000 },
      { amount: 1.00000000, fee: 0.00002000 }
    ]
  },
  digibyte: {
    symbol: 'DGB',
    minimum: 1.00000000,
    fees: [
      { amount: 1.00000000, fee: 0.00800000 },
      { amount: 1.50000000, fee: 0.00600000 },
      { amount: 2.00000000, fee: 0.00400000 },
      { amount: 5.00000000, fee: 0.00200000 },
      { amount: 10.00000000, fee: 0.00100000 },
      { amount: 25.00000000, fee: 0.00050000 },
      { amount: 50.00000000, fee: 0.00020000 }
    ]
  },
  bitcore: {
    symbol: 'BTX',
    minimum: 0.01000000,
    fees: [
      { amount: 0.01000000, fee: 0.00080000 },
      { amount: 0.05000000, fee: 0.00060000 },
      { amount: 0.10000000, fee: 0.00040000 },
      { amount: 0.15000000, fee: 0.00020000 },
      { amount: 0.20000000, fee: 0.00010000 },
      { amount: 0.50000000, fee: 0.00005000 },
      { amount: 1.00000000, fee: 0.00002000 }
    ]
  },
  blackcoin: {
    symbol: 'BLK',
    minimum: 2.00000000,
    fees: [
      { amount: 2.00000000, fee: 0.00800000 },
      { amount: 10.00000000, fee: 0.00600000 },
      { amount: 15.00000000, fee: 0.00400000 },
      { amount: 20.00000000, fee: 0.00200000 },
      { amount: 30.00000000, fee: 0.00100000 },
      { amount: 50.00000000, fee: 0.00050000 },
      { amount: 100.00000000, fee: 0.00020000 }
    ]
  },
  dash: {
    symbol: 'DASH',
    minimum: 0.00100000,
    fees: [
      { amount: 0.00100000, fee: 0.00008000 },
      { amount: 0.00500000, fee: 0.00006000 },
      { amount: 0.01000000, fee: 0.00004000 },
      { amount: 0.01500000, fee: 0.00002000 },
      { amount: 0.02000000, fee: 0.00001000 },
      { amount: 0.05000000, fee: 0.00000500 },
      { amount: 1.00000000, fee: 0.00000200 }
    ]
  },
  peercoin: {
    symbol: 'PCC',
    minimum: 1.00000000,
    fees: [
      { amount: 5.00000000, fee: 0.00800000 },
      { amount: 10.00000000, fee: 0.00600000 },
      { amount: 15.00000000, fee: 0.00400000 },
      { amount: 20.00000000, fee: 0.00200000 },
      { amount: 30.00000000, fee: 0.00100000 },
      { amount: 50.00000000, fee: 0.00050000 },
      { amount: 100.00000000, fee: 0.00020000 },
    ]
  },
  primecoin: {
    symbol: 'XPM',
    minimum: 2.00000000,
    fees: [
      { amount: 5.00000000, fee: 0.00800000 },
      { amount: 10.00000000, fee: 0.00600000 },
      { amount: 15.00000000, fee: 0.00400000 },
      { amount: 20.00000000, fee: 0.00200000 },
      { amount: 30.00000000, fee: 0.00100000 },
      { amount: 50.00000000, fee: 0.00050000 },
      { amount: 100.00000000, fee: 0.00020000 },
    ]
  },
  potcoin: {
    symbol: 'POT',
    minimum: 1.00000000,
    fees: [
      { amount: 1.00000000, fee: 0.00800000 },
      { amount: 5.00000000, fee: 0.00600000 },
      { amount: 10.00000000, fee: 0.00400000 },
      { amount: 15.00000000, fee: 0.00200000 },
      { amount: 30.00000000, fee: 0.00100000 },
      { amount: 50.00000000, fee: 0.00050000 },
      { amount: 100.00000000, fee: 0.00020000 }
    ]
  }
};

const targetPages = [
  '/dashboard',
  '/dashboard/'
];

export function main() {
  if (location.hostname === 'faucethub.io' && targetPages.indexOf(location.pathname) >= 0) {
    const root = document.querySelector('#content > div > div > div.col-md-9.col-md-push-3 > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2)')
    let index = 1;
    for (let key in withdrawals) {
      // root element
      const currency = root.querySelector(`div.col-md-4:nth-child(${index++}) > div > div`)
      if (!currency) {
        continue;
      }
      // Add percentage and fee on title.
      // Example:
      //  Bitcoin - 60% (fee: 0.000004 BTC)
      //  Litecoin - 512% (fee: 0.0006 LTC)
      const withdraw = withdrawals[key];
      const balance = 0.0 + currency.querySelector('span').innerText.split(' ')[0];
      const percentage = calcPercentage(withdraw, balance);
      const fee = calcWithdrawalFee(withdraw, balance);

      const content = currency.querySelector('span');
      const classes = []
      if (percentage >= 100) {
        classes.push('text-success');
      }
      content.innerHTML += `<br><span class="${classes.join(' ')}" style="font-size: 85%">${percentage} % / fee: ${fee} ${withdraw.symbol}</span>`
    }
  }
}