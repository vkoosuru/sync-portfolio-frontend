const stockData = {
    C: 20,
    AMZN: 15,
    TSLA: 10,
    FB: 25,
    AAPL: 30
};

const transactions = [];
const investments = [
    { name: 'Bond 1: $5000', amount: 5000 },
    { name: 'Bond 2: $3000', amount: 3000 },
    { name: 'Investment 1: $2000', amount: 2000 }
];

const livePrices = {};
const previousPrices = {};
const priceHistory = {};
const tickers = Object.keys(stockData);
let stockPriceCharts = {};
let pieChart = null;
let netWorthChartInstance = null;
let netWorthHistory = [10500];
let netWorthTimestamps = [new Date().toLocaleString()];
let currentTicker = null;
let isStockDetailsOpen = false;
let cashInHand = 5000;
let previousCashInHand = 5000;
let previousCashflow = 10500;

function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'flex';
}

function updateNetWorthGraph() {
    if (netWorthHistory.length > 20) {
        netWorthHistory.shift();
        netWorthTimestamps.shift();
    }

    const options = {
        chart: { type: 'line', height: 350 },
        series: [{ name: "Net Worth", data: netWorthHistory }],
        xaxis: {
            categories: netWorthTimestamps,
            labels: {
                rotate: -45,
                formatter: function(value) {
                    return new Date(value).toLocaleTimeString();
                }
            }
        },
        title: { text: 'Net Worth Over Time', align: 'left' },
        stroke: { curve: 'smooth' },
        colors: ['#00bcd4'],
        tooltip: {
            y: { formatter: val => "$" + val },
            x: { formatter: val => new Date(val).toLocaleString() }
        }
    };

    if (netWorthChartInstance) {
        netWorthChartInstance.updateOptions({
            xaxis: { categories: netWorthTimestamps },
            series: [{ name: "Net Worth", data: netWorthHistory }]
        });
    } else {
        netWorthChartInstance = new ApexCharts(document.querySelector("#netWorthChart"), options);
        netWorthChartInstance.render();
    }
}

function updateStocksPieChart() {
    const series = Object.values(stockData);
    const labels = Object.keys(stockData);

    if (pieChart) {
        pieChart.updateSeries(series);
        pieChart.updateOptions({ labels });
    } else {
        const options = {
            chart: { type: 'pie', height: 260 },
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

function updateCash() {
    const stockValue = Object.entries(stockData).reduce((sum, [ticker, qty]) => {
        const price = livePrices[ticker] || 100;
        return sum + price * qty;
    }, 0);

    const investmentValue = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const cashflow = stockValue + investmentValue;
    const roundedCashflow = parseFloat(cashflow.toFixed(2));
    const roundedCashInHand = parseFloat(cashInHand.toFixed(2));

    const cashflowElement = document.getElementById("settlement-cash");
    const cashInHandElement = document.getElementById("cash-in-hand");

    // Update Cashflow color
    cashflowElement.classList.remove('increase', 'decrease');
    if (roundedCashflow > previousCashflow) {
        cashflowElement.classList.add('increase');
    } else if (roundedCashflow < previousCashflow) {
        cashflowElement.classList.add('decrease');
    }
    cashflowElement.innerText = `$${roundedCashflow}`;

    // Update Settlement Account (Cash in Hand) color
    cashInHandElement.classList.remove('increase', 'decrease');
    if (roundedCashInHand > previousCashInHand) {
        cashInHandElement.classList.add('increase');
    } else if (roundedCashInHand < previousCashInHand) {
        cashInHandElement.classList.add('decrease');
    }
    cashInHandElement.innerText = `$${roundedCashInHand}`;

    previousCashflow = roundedCashflow;
    previousCashInHand = roundedCashInHand;

    netWorthTimestamps.push(new Date().toLocaleString());
    netWorthHistory.push(roundedCashflow);

    if (netWorthHistory.length > 20) {
        netWorthHistory.shift();
        netWorthTimestamps.shift();
    }

    updateNetWorthGraph();
}

function updateHoldingsTable() {
    const tableBody = document.querySelector("#holdingsTable tbody");
    tableBody.innerHTML = "";
    Object.entries(stockData).forEach(([ticker, qty]) => {
        const price = livePrices[ticker]?.toFixed(2) || '-';
        const prevPrice = previousPrices[ticker] || price;
        const diff = price - prevPrice;
        const color = diff > 0 ? 'green' : diff < 0 ? 'red' : 'black';
        const symbol = diff > 0 ? '↑' : diff < 0 ? '↓' : '';

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${ticker}</td>
            <td>${qty}</td>
            <td style="color:${color};">$${price} ${symbol}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateTransactionTable() {
    const table = document.getElementById('transactionTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    transactions.forEach(tr => {
        const row = document.createElement('tr');
        row.className = tr.action === 'Buy' ? 'buy-row' : 'sell-row';
        row.innerHTML = `
            <td>${tr.tickerId}</td>
            <td>${tr.ticker}</td>
            <td>${tr.quantity}</td>
            <td>${tr.timestamp}</td>
            <td>$${tr.buyPrice}</td>
            <td>$${tr.totalPrice.toFixed(2)}</td>
            <td>${tr.action}</td>
        `;
        table.appendChild(row);
    });
}

function generateInitialPrices() {
    for (const ticker of tickers) {
        const randomPrice = parseFloat((Math.random() * 100 + 50).toFixed(2));
        livePrices[ticker] = randomPrice;
        previousPrices[ticker] = randomPrice;
        priceHistory[ticker] = Array(10).fill(randomPrice).map((price, i) => ({
            time: new Date(Date.now() - (9-i) * 3600000).toLocaleTimeString(),
            price: parseFloat(price.toFixed(2))
        }));
    }
    renderLivePrices();
    updateCash();
}

function simulateLivePrices() {
    for (const ticker of tickers) {
        const oldPrice = livePrices[ticker];
        const randomChange = (Math.random() * 0.5 - 0.25).toFixed(2);
        const newPrice = parseFloat((oldPrice + parseFloat(randomChange)).toFixed(2));

        previousPrices[ticker] = oldPrice;
        livePrices[ticker] = newPrice;

        if (!priceHistory[ticker]) {
            priceHistory[ticker] = [];
        }
        priceHistory[ticker].push({
            time: new Date().toLocaleTimeString(),
            price: newPrice
        });
        if (priceHistory[ticker].length > 10) {
            priceHistory[ticker].shift();
        }
    }

    renderLivePrices();
    updateCash();
    updateHoldingsTable();
    updateStockDetailsChart();
}

function generateDummyStockData(ticker) {
    const history = priceHistory[ticker] || Array(10).fill({
        time: new Date().toLocaleTimeString(),
        price: livePrices[ticker] || 100
    });

    const prices = history.map(p => p.price);
    const open = parseFloat(prices[0]?.toFixed(2)) || 100;
    const close = parseFloat(prices[prices.length - 1]?.toFixed(2)) || 100;
    const high = parseFloat(Math.max(...prices).toFixed(2)) || 100;
    const low = parseFloat(Math.min(...prices).toFixed(2)) || 100;

    return { open, close, high, low, priceHistory: history };
}

function showStockDetails(ticker) {
    currentTicker = ticker;
    isStockDetailsOpen = true;
    const data = generateDummyStockData(ticker);
    document.getElementById('stockDetailsTitle').innerText = `${ticker} Details`;
    document.getElementById('stockOpen').innerText = `$${data.open}`;
    document.getElementById('stockClose').innerText = `$${data.close}`;
    document.getElementById('stockHigh').innerText = `$${data.high}`;
    document.getElementById('stockLow').innerText = `$${data.low}`;

    const overlay = document.getElementById('stockDetailsOverlay');
    const popup = document.getElementById('stockDetailsPopup');
    overlay.style.display = 'block';
    popup.style.display = 'block';

    if (stockPriceCharts[ticker]) {
        stockPriceCharts[ticker].destroy();
    }

    const options = {
        chart: { type: 'line', height: 200 },
        series: [{ name: 'Price', data: data.priceHistory.map(p => p.price) }],
        xaxis: { categories: data.priceHistory.map(p => p.time) },
        title: { text: 'Price History (Last 10 Updates)', align: 'center' },
        stroke: { curve: 'smooth' },
        colors: ['#007bff'],
        tooltip: { y: { formatter: val => `$${val}` } }
    };

    stockPriceCharts[ticker] = new ApexCharts(document.querySelector("#stockPriceChart"), options);
    stockPriceCharts[ticker].render();
}

function updateStockDetailsChart() {
    if (isStockDetailsOpen && currentTicker && stockPriceCharts[currentTicker]) {
        const data = generateDummyStockData(currentTicker);
        stockPriceCharts[currentTicker].updateOptions({
            series: [{ name: 'Price', data: data.priceHistory.map(p => p.price) }],
            xaxis: { categories: data.priceHistory.map(p => p.time) }
        });
        document.getElementById('stockOpen').innerText = `$${data.open}`;
        document.getElementById('stockClose').innerText = `$${data.close}`;
        document.getElementById('stockHigh').innerText = `$${data.high}`;
        document.getElementById('stockLow').innerText = `$${data.low}`;
    }
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

        const li = document.createElement("li");
        li.className = 'live-price-item';
        li.innerHTML = `
            <span class="ticker">${ticker}</span>
            <span class="price" style="color:${color};">$${price} ${symbol}</span>
            <span class="change">${Math.abs(diff).toFixed(2)}</span>
        `;
        li.onclick = () => showStockDetails(ticker);
        container.appendChild(li);
    });
}

function addCash() {
    const amount = parseFloat(prompt("Enter amount to add to Settlement Account:"));
    if (!isNaN(amount) && amount > 0) {
        cashInHand += amount;
        updateCash();
    } else {
        alert('Enter a valid positive amount.');
    }
}

function removeCash() {
    const amount = parseFloat(prompt("Enter amount to remove from Settlement Account:"));
    if (!isNaN(amount) && amount > 0 && amount <= cashInHand) {
        cashInHand -= amount;
        updateCash();
    } else {
        alert('Enter a valid amount not exceeding available cash.');
    }
}

document.getElementById('addStockBtn').addEventListener('click', () => {
    document.getElementById('popupTitle').innerText = 'Buy Stock';
    document.getElementById('confirmStockAction').dataset.action = 'add';
    togglePopup();
});

document.getElementById('removeStockBtn').addEventListener('click', () => {
    document.getElementById('popupTitle').innerText = 'Sell Stock';
    document.getElementById('confirmStockAction').dataset.action = 'remove';
    togglePopup();
});

document.getElementById('closePopupBtn').addEventListener('click', togglePopup);

document.getElementById('closeStockDetailsBtn').addEventListener('click', () => {
    const overlay = document.getElementById('stockDetailsOverlay');
    const popup = document.getElementById('stockDetailsPopup');
    overlay.style.display = 'none';
    popup.style.display = 'none';
    isStockDetailsOpen = false;
    currentTicker = null;
});

document.getElementById('confirmStockAction').addEventListener('click', () => {
    const action = document.getElementById('confirmStockAction').dataset.action;
    const stock = document.getElementById('stockSelect').value;
    const quantity = parseInt(document.getElementById('stockQuantity').value);

    if (!isNaN(quantity) && quantity > 0) {
        const price = livePrices[stock] || 100;
        const totalCost = price * quantity;

        if (action === 'add') {
            if (totalCost <= cashInHand) {
                stockData[stock] = (stockData[stock] || 0) + quantity;
                cashInHand -= totalCost;
                transactions.push({
                    tickerId: `${stock}${Date.now()}`,
                    ticker: stock,
                    quantity,
                    timestamp: new Date().toLocaleString(),
                    buyPrice: price,
                    totalPrice: totalCost,
                    action: 'Buy'
                });
            } else {
                alert('Insufficient cash to buy stocks.');
                return;
            }
        } else if (action === 'remove' && stockData[stock] >= quantity) {
            stockData[stock] -= quantity;
            cashInHand += totalCost;
            transactions.push({
                tickerId: `${stock}${Date.now()}`,
                ticker: stock,
                quantity,
                timestamp: new Date().toLocaleString(),
                buyPrice: price,
                totalPrice: totalCost,
                action: 'Sell'
            });
        } else {
            alert('Not enough stock to sell.');
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

function addStaticInvestment() {
    const item = prompt("Enter investment or bond (e.g., 'Bond 3: $4000'):");
    if (item) {
        const amountMatch = item.match(/\$(\d+)/);
        const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
        investments.push({ name: item, amount });
        const list = document.getElementById("investments-list");
        const li = document.createElement("li");
        li.innerHTML = `${item} <span class="delete-btn">×</span>`;
        li.dataset.amount = amount;
        li.onclick = function(e) {
            if (e.target.classList.contains('delete-btn')) {
                deleteInvestment(li);
            }
        };
        list.appendChild(li);
        updateCash();
    }
}

function deleteInvestment(element) {
    const text = element.textContent.split(' ×')[0];
    const index = investments.findIndex(inv => inv.name === text);
    if (index > -1) {
        investments.splice(index, 1);
        element.remove();
        updateCash();
    }
}

document.addEventListener('wheel', (event) => {
    const holdingsPage = document.getElementById('holdings');
    const transactionsPage = document.getElementById('transactions');
    const isHoldingsVisible = holdingsPage.style.display === 'flex';
    const isTransactionsVisible = transactionsPage.style.display === 'flex';

    if (event.deltaY > 0) {
        if (isHoldingsVisible) {
            showPage('transactions');
        }
    } else if (event.deltaY < 0) {
        if (isTransactionsVisible) {
            showPage('holdings');
        }
    }
});

updateNetWorthGraph();
updateStocksPieChart();
updateHoldingsTable();
updateTransactionTable();
generateInitialPrices();
setInterval(simulateLivePrices, 5000);
setInterval(updateStockDetailsChart, 60000);