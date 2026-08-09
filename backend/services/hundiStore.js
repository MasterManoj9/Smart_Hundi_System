// In-Memory Hundi Data Store with initial rich dummy data

const defaultCapacities = {
  // Coins
  1: { max: 5000, type: 'COIN', label: '₹1 Coin Box' },
  2: { max: 4000, type: 'COIN', label: '₹2 Coin Box' },
  5: { max: 3000, type: 'COIN', label: '₹5 Coin Box' },
  10: { max: 2000, type: 'COIN', label: '₹10 Coin Box' },
  // Notes
  '10_note': { max: 1500, type: 'NOTE', label: '₹10 Note Vault', denom: 10 },
  20: { max: 1200, type: 'NOTE', label: '₹20 Note Vault' },
  50: { max: 1000, type: 'NOTE', label: '₹50 Note Vault' },
  100: { max: 1000, type: 'NOTE', label: '₹100 Note Vault' },
  200: { max: 800, type: 'NOTE', label: '₹200 Note Vault' },
  500: { max: 500, type: 'NOTE', label: '₹500 Note Vault' }
};

// Initial counts (realistic active temple vault)
let counts = {
  coin: {
    1: 3420,
    2: 2150,
    5: 1840,
    10: 1120
  },
  note: {
    10: 890,
    20: 740,
    50: 620,
    100: 510,
    200: 380,
    500: 240
  }
};

let machineStatus = {
  isOnline: true,
  lastUpdated: new Date().toISOString(),
  coinJam: false,
  noteJam: false,
  storageFullWarning: false,
  doorLocked: true,
  temperature: 32.5,
  sensorHealth: 'OPTIMAL',
  firmwareVersion: 'ESP32-S3-HUNDI-v2.8.4',
  ipAddress: '192.168.1.105',
  wifiSignal: -58, // dBm
  activeHundiId: 'TH-MAIN-01'
};

// Helper function to generate realistic past dates
const subtractDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

const subtractHours = (hours) => {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d;
};

// Initial Transactions seed (Rich history for today, last 7 days, and last 30 days)
let transactions = [
  {
    id: 'TXN-98401',
    timestamp: subtractHours(0.1).toISOString(),
    type: 'NOTE',
    denomination: 500,
    count: 4,
    amount: 2000,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  },
  {
    id: 'TXN-98402',
    timestamp: subtractHours(0.3).toISOString(),
    type: 'COIN',
    denomination: 10,
    count: 25,
    amount: 250,
    channel: 'Inductive Coin Counter',
    status: 'Verified'
  },
  {
    id: 'TXN-98403',
    timestamp: subtractHours(0.8).toISOString(),
    type: 'NOTE',
    denomination: 200,
    count: 5,
    amount: 1000,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  },
  {
    id: 'TXN-98404',
    timestamp: subtractHours(1.2).toISOString(),
    type: 'NOTE',
    denomination: 100,
    count: 15,
    amount: 1500,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  },
  {
    id: 'TXN-98405',
    timestamp: subtractHours(1.9).toISOString(),
    type: 'COIN',
    denomination: 5,
    count: 60,
    amount: 300,
    channel: 'Inductive Coin Counter',
    status: 'Verified'
  },
  {
    id: 'TXN-98406',
    timestamp: subtractHours(2.5).toISOString(),
    type: 'NOTE',
    denomination: 50,
    count: 12,
    amount: 600,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  },
  {
    id: 'TXN-98407',
    timestamp: subtractHours(3.4).toISOString(),
    type: 'COIN',
    denomination: 2,
    count: 150,
    amount: 300,
    channel: 'Inductive Coin Counter',
    status: 'Verified'
  },
  {
    id: 'TXN-98408',
    timestamp: subtractHours(4.1).toISOString(),
    type: 'COIN',
    denomination: 1,
    count: 200,
    amount: 200,
    channel: 'Inductive Coin Counter',
    status: 'Verified'
  },
  {
    id: 'TXN-98409',
    timestamp: subtractHours(5.2).toISOString(),
    type: 'NOTE',
    denomination: 500,
    count: 8,
    amount: 4000,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  },
  {
    id: 'TXN-98410',
    timestamp: subtractHours(6.7).toISOString(),
    type: 'NOTE',
    denomination: 20,
    count: 25,
    amount: 500,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  },
  {
    id: 'TXN-98411',
    timestamp: subtractDays(1).toISOString(),
    type: 'NOTE',
    denomination: 500,
    count: 10,
    amount: 5000,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  },
  {
    id: 'TXN-98412',
    timestamp: subtractDays(1).toISOString(),
    type: 'NOTE',
    denomination: 200,
    count: 12,
    amount: 2400,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  },
  {
    id: 'TXN-98413',
    timestamp: subtractDays(1).toISOString(),
    type: 'COIN',
    denomination: 10,
    count: 80,
    amount: 800,
    channel: 'Inductive Coin Counter',
    status: 'Verified'
  },
  {
    id: 'TXN-98414',
    timestamp: subtractDays(2).toISOString(),
    type: 'NOTE',
    denomination: 100,
    count: 30,
    amount: 3000,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  },
  {
    id: 'TXN-98415',
    timestamp: subtractDays(2).toISOString(),
    type: 'COIN',
    denomination: 5,
    count: 120,
    amount: 600,
    channel: 'Inductive Coin Counter',
    status: 'Verified'
  },
  {
    id: 'TXN-98416',
    timestamp: subtractDays(3).toISOString(),
    type: 'NOTE',
    denomination: 500,
    count: 15,
    amount: 7500,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  },
  {
    id: 'TXN-98417',
    timestamp: subtractDays(4).toISOString(),
    type: 'COIN',
    denomination: 2,
    count: 300,
    amount: 600,
    channel: 'Inductive Coin Counter',
    status: 'Verified'
  },
  {
    id: 'TXN-98418',
    timestamp: subtractDays(5).toISOString(),
    type: 'NOTE',
    denomination: 200,
    count: 20,
    amount: 4000,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  },
  {
    id: 'TXN-98419',
    timestamp: subtractDays(6).toISOString(),
    type: 'NOTE',
    denomination: 100,
    count: 45,
    amount: 4500,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  },
  {
    id: 'TXN-98420',
    timestamp: subtractDays(7).toISOString(),
    type: 'COIN',
    denomination: 10,
    count: 100,
    amount: 1000,
    channel: 'Inductive Coin Counter',
    status: 'Verified'
  },
  {
    id: 'TXN-98421',
    timestamp: subtractDays(12).toISOString(),
    type: 'NOTE',
    denomination: 500,
    count: 18,
    amount: 9000,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  },
  {
    id: 'TXN-98422',
    timestamp: subtractDays(15).toISOString(),
    type: 'NOTE',
    denomination: 200,
    count: 25,
    amount: 5000,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  },
  {
    id: 'TXN-98423',
    timestamp: subtractDays(20).toISOString(),
    type: 'COIN',
    denomination: 5,
    count: 200,
    amount: 1000,
    channel: 'Inductive Coin Counter',
    status: 'Verified'
  },
  {
    id: 'TXN-98424',
    timestamp: subtractDays(25).toISOString(),
    type: 'NOTE',
    denomination: 100,
    count: 50,
    amount: 5000,
    channel: 'Optical Vault Sensor',
    status: 'Verified'
  }
];

export const getHundiSummary = () => {
  // Coin stats
  const coinDenominations = [
    { denom: 1, count: counts.coin[1], max: defaultCapacities[1].max },
    { denom: 2, count: counts.coin[2], max: defaultCapacities[2].max },
    { denom: 5, count: counts.coin[5], max: defaultCapacities[5].max },
    { denom: 10, count: counts.coin[10], max: defaultCapacities[10].max }
  ];

  let totalCoinsCount = 0;
  let totalCoinsAmount = 0;

  const coinBoxes = coinDenominations.map(item => {
    const totalValue = item.denom * item.count;
    totalCoinsCount += item.count;
    totalCoinsAmount += totalValue;
    const percentage = Math.min(100, Number(((item.count / item.max) * 100).toFixed(1)));
    return {
      denomination: item.denom,
      type: 'COIN',
      count: item.count,
      totalValue,
      maxCapacity: item.max,
      percentage,
      isFull: percentage >= 90
    };
  });

  // Note stats
  const noteDenominations = [
    { denom: 10, count: counts.note[10], max: defaultCapacities['10_note'].max },
    { denom: 20, count: counts.note[20], max: defaultCapacities[20].max },
    { denom: 50, count: counts.note[50], max: defaultCapacities[50].max },
    { denom: 100, count: counts.note[100], max: defaultCapacities[100].max },
    { denom: 200, count: counts.note[200], max: defaultCapacities[200].max },
    { denom: 500, count: counts.note[500], max: defaultCapacities[500].max }
  ];

  let totalNotesCount = 0;
  let totalNotesAmount = 0;

  const noteBoxes = noteDenominations.map(item => {
    const totalValue = item.denom * item.count;
    totalNotesCount += item.count;
    totalNotesAmount += totalValue;
    const percentage = Math.min(100, Number(((item.count / item.max) * 100).toFixed(1)));
    return {
      denomination: item.denom,
      type: 'NOTE',
      count: item.count,
      totalValue,
      maxCapacity: item.max,
      percentage,
      isFull: percentage >= 90
    };
  });

  const totalDonationAmount = totalCoinsAmount + totalNotesAmount;

  // Check if any box is >85% full
  const anyBoxFull = [...coinBoxes, ...noteBoxes].some(b => b.percentage >= 85);
  machineStatus.storageFullWarning = anyBoxFull;

  return {
    totalDonationAmount,
    totalCoinsCount,
    totalCoinsAmount,
    totalNotesCount,
    totalNotesAmount,
    coinBoxes,
    noteBoxes,
    machineStatus,
    lastUpdated: machineStatus.lastUpdated
  };
};

export const getCollectionGraphs = () => {
  // Daily Graph (Hourly breakdown for today)
  const hours = ['06:00 AM', '08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM'];
  const dailyData = hours.map((hour, idx) => ({
    time: hour,
    coins: 520 + idx * 110 + (idx % 2 === 0 ? 150 : 50),
    notes: 3200 + idx * 850 + (idx === 6 ? 4500 : idx * 300),
    total: 3720 + idx * 960 + (idx === 6 ? 4650 : idx * 350)
  }));

  // Weekly Graph (Mon to Sun)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyData = days.map((day, idx) => ({
    day,
    coins: 3800 + (idx >= 5 ? 5200 : idx * 750),
    notes: 16500 + (idx >= 5 ? 35000 : idx * 3100),
    total: 20300 + (idx >= 5 ? 40200 : idx * 3850)
  }));

  // Monthly Graph (Week 1 to Week 4)
  const monthlyData = [
    { week: 'Week 1', coins: 28500, notes: 124000, total: 152500 },
    { week: 'Week 2', coins: 31200, notes: 142000, total: 173200 },
    { week: 'Week 3', coins: 34800, notes: 158500, total: 193300 },
    { week: 'Week 4', coins: 42100, notes: 198000, total: 240100 }
  ];

  return { dailyData, weeklyData, monthlyData };
};

export const getTransactions = (search = '', filterDate = 'all') => {
  let filtered = [...transactions];

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      t =>
        t.id.toLowerCase().includes(s) ||
        t.type.toLowerCase().includes(s) ||
        String(t.denomination).includes(s) ||
        String(t.amount).includes(s)
    );
  }

  if (filterDate && filterDate !== 'all') {
    const now = new Date();
    filtered = filtered.filter(t => {
      const tDate = new Date(t.timestamp);
      if (filterDate === 'today') {
        return tDate.toDateString() === now.toDateString();
      }
      if (filterDate === '7days') {
        const diffDays = (now - tDate) / (1000 * 3600 * 24);
        return diffDays <= 7;
      }
      if (filterDate === '30days') {
        const diffDays = (now - tDate) / (1000 * 3600 * 24);
        return diffDays <= 30;
      }
      return true;
    });
  }

  return filtered;
};

export const addDonation = ({ type, denomination, count }) => {
  const numDenom = Number(denomination);
  const numCount = Number(count);
  if (!numDenom || !numCount || numCount <= 0) return { error: 'Invalid denomination or count' };

  if (type === 'COIN') {
    if (!counts.coin[numDenom] && counts.coin[numDenom] !== 0) return { error: 'Invalid coin denomination' };
    counts.coin[numDenom] += numCount;
  } else if (type === 'NOTE') {
    if (!counts.note[numDenom] && counts.note[numDenom] !== 0) return { error: 'Invalid note denomination' };
    counts.note[numDenom] += numCount;
  } else {
    return { error: 'Type must be COIN or NOTE' };
  }

  const amount = numDenom * numCount;
  const newTxn = {
    id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
    timestamp: new Date().toISOString(),
    type,
    denomination: numDenom,
    count: numCount,
    amount,
    channel: type === 'COIN' ? 'Inductive Coin Counter' : 'Optical Vault Sensor',
    status: 'Verified'
  };

  transactions.unshift(newTxn);
  machineStatus.lastUpdated = new Date().toISOString();

  return { success: true, transaction: newTxn };
};

export const toggleMachineAlert = ({ alertType, value }) => {
  if (alertType in machineStatus) {
    machineStatus[alertType] = Boolean(value);
    machineStatus.lastUpdated = new Date().toISOString();
    return { success: true, machineStatus };
  }
  return { error: 'Unknown alert type' };
};

export const resetCounts = () => {
  counts = {
    coin: { 1: 0, 2: 0, 5: 0, 10: 0 },
    note: { 10: 0, 20: 0, 50: 0, 100: 0, 200: 0, 500: 0 }
  };
  machineStatus.lastUpdated = new Date().toISOString();
  machineStatus.coinJam = false;
  machineStatus.noteJam = false;
  machineStatus.storageFullWarning = false;
  
  const resetTxn = {
    id: `SYS-RESET-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString(),
    type: 'SYSTEM',
    denomination: 0,
    count: 0,
    amount: 0,
    channel: 'Admin Maintenance Reset',
    status: 'Completed'
  };
  transactions.unshift(resetTxn);
  return { success: true };
};
