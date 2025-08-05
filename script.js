// ==== GLOBAL STATE ====
const stockData = {
    C: 20,
    AMZN: 15,
    TSLA: 10,
    FB: 25,
    AAPL: 30
  };
  
  const transactions = [];
  const investments = [
    'Bond 1: $5000',
    'Bond 2: $3000',
    'Investment 1: $2000'
  ];
  
  let pieChart = null;
  const livePrices = {};
  const previousPrices = {};
  const API_BASE = "https://c4rm9elh30.execute-api.us-east-1.amazonaws.com/default/cachedPriceData?ticker=";
  const tickers = Object.keys(stockData);
  
  
  // ==== PAGE SWITCHING ====
  function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
  }
  
  
  // ==== CHARTS ====
  function updateNetWorthGraph() {
    const options = {
      chart: { type: 'line', height: 350 },
      series: [{ name: "Net Worth", data: [10500, 10700, 10650, 10900, 11050] }],
      xaxis: { categories: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'] },
      title: { text: 'Net Worth Over Time', align: 'left' },
      stroke: { curve: 'smooth' },
      colors: ['#00bcd4'],
      tooltip: {
        y: { formatter: val => "$" + val }
      }
    };
    const chart = new ApexCharts(document.querySelector("#netWorthChart"), options);
    chart.render();
  }
  
  function updateStocksPieChart() {
    const series = Object.values(stockData);
    const labels = Object.keys(stockData);
  
    if (pieChart) {
      pieChart.updateSeries(series);
      pieChart.updateOptions({ labels });
    } else {
      const options = {
        chart: { type: 'pie', height: 450 },
        series,
        labels,
        title: { text: 'Stock Holdings Distribution', align: 'center' },
        colors: ['#FF9999', '#66B2FF', '#FFCC00', '#8BC34A', '#FF5722'],
        tooltip: {
          y: { formatter: val => val + ' shares' }
        }
      };
      pieChart = new ApexCharts(document.querySelector("#stocksPieChart"), options);
      pieChart.render();
    }
  }
  
  
  // ==== CASH + HOLDINGS ====
  function updateCash() {
    const value = Object.entries(stockData).reduce((sum, [ticker, qty]) => {
      const price = livePrices[ticker] || 100;
      return sum + price * qty;
    }, 0);
    document.getElementById("settlement-cash").innerText = `$${value.toFixed(2)}`;
  }
  
  function updateHoldingsTable() {
    const tableBody = document.querySelector("#holdingsTable tbody");
    tableBody.innerHTML = "";
    Object.entries(stockData).forEach(([ticker, qty]) => {
      const price = livePrices[ticker]?.toFixed(2) || '-';
      const row = document.createElement("tr");
      row.innerHTML = `<td>${ticker}</td><td>${qty}</td><td>$${price}</td>`;
      tableBody.appendChild(row);
    });
  }
  
  function updateTransactionTable() {
    const table = document.getElementById('transactionTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    transactions.forEach(tr => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${tr.tickerId}</td>
        <td>${tr.ticker}</td>
        <td>${tr.quantity}</td>
        <td>${tr.timestamp}</td>
        <td>$${tr.buyPrice}</td>
        <td>$${tr.totalPrice}</td>
        <td>${tr.action}</td>
      `;
      table.appendChild(row);
    });
  }
  
  
  // ==== LIVE PRICES ====
  async function fetchLivePrices() {
    for (const ticker of tickers) {
      try {
        const res = await fetch(API_BASE + ticker);
        const data = await res.json();
        const currentPrice = parseFloat(data.price);
  
        const change = (Math.random() * 2 - 1).toFixed(2);
        const simulated = parseFloat((currentPrice + parseFloat(change)).toFixed(2));
  
        previousPrices[ticker] = livePrices[ticker] || simulated;
        livePrices[ticker] = simulated;
      } catch (e) {
        console.error(`Error fetching price for ${ticker}`, e);
      }
    }
    renderLivePrices();
    updateCash();
    updateHoldingsTable();
  }
  
  function renderLivePrices() {
    const container = document.getElementById("livePrices");
    container.innerHTML = "";
    tickers.forEach(ticker => {
      const price = livePrices[ticker]?.toFixed(2) || "-";
      const prev = previousPrices[ticker] || price;
      const diff = price - prev;
  
      const color = diff > 0 ? 'green' : diff < 0 ? 'red' : 'black';
      const symbol = diff > 0 ? '↑' : diff < 0 ? '↓' : '';
  
      const div = document.createElement("div");
      div.innerHTML = `${ticker}: <span style="color:${color}">$${price} ${symbol}</span>`;
      container.appendChild(div);
    });
  }
  
  
  // ==== STOCK MODAL ====
  document.getElementById('addStockBtn').addEventListener('click', () => {
    document.getElementById('popupTitle').innerText = 'Add Stock';
    document.getElementById('confirmStockAction').dataset.action = 'add';
    togglePopup();
  });
  
  document.getElementById('removeStockBtn').addEventListener('click', () => {
    document.getElementById('popupTitle').innerText = 'Remove Stock';
    document.getElementById('confirmStockAction').dataset.action = 'remove';
    togglePopup();
  });
  
  document.getElementById('closePopupBtn').addEventListener('click', togglePopup);
  
  document.getElementById('confirmStockAction').addEventListener('click', () => {
    const action = document.getElementById('confirmStockAction').dataset.action;
    const stock = document.getElementById('stockSelect').value;
    const quantity = parseInt(document.getElementById('stockQuantity').value);
  
    if (!isNaN(quantity) && quantity > 0) {
      const price = livePrices[stock] || 100;
  
      if (action === 'add') {
        stockData[stock] = (stockData[stock] || 0) + quantity;
        transactions.push({
          tickerId: `${stock}${Date.now()}`,
          ticker: stock,
          quantity,
          timestamp: new Date().toLocaleString(),
          buyPrice: price,
          totalPrice: price * quantity,
          action: 'Buy'
        });
      } else if (action === 'remove' && stockData[stock] >= quantity) {
        stockData[stock] -= quantity;
        transactions.push({
          tickerId: `${stock}${Date.now()}`,
          ticker: stock,
          quantity,
          timestamp: new Date().toLocaleString(),
          buyPrice: price,
          totalPrice: price * quantity,
          action: 'Sell'
        });
      } else {
        alert('Not enough stock to remove.');
        return;
      }
  
      updateStocksPieChart();
      updateHoldingsTable();
      updateCash();
      updateTransactionTable();
      togglePopup();
    } else {
      alert('Enter valid quantity.');
    }
  });
  
  function togglePopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
  }
  
  
  // ==== STATIC INVESTMENTS ====
  function addStaticInvestment() {
    const item = prompt("Enter investment or bond (e.g., 'Bond 3: $4000'):");
    if (item) {
      investments.push(item);
      const list = document.getElementById("investments-list");
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    }
  }
  
  
  // ==== INIT ====
  updateNetWorthGraph();
  updateStocksPieChart();
  updateHoldingsTable();
  updateTransactionTable();
  fetchLivePrices();
  setInterval(fetchLivePrices, 5000);
  