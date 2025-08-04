// Dummy data
const stockData = {
    AAPL: 50,
    GOOG: 30,
    TSLA: 10
};

const netWorthData = [10500, 10700, 10650, 10900, 11050]; // Dummy net worth values for graph

// Dummy transactions data
const transactions = [
    {
        tickerId: 'AAPL123',
        ticker: 'AAPL',
        quantity: 10,
        timestamp: '2023-08-01 10:00:00',
        buyPrice: 140,
        totalPrice: 1400,
        action: 'buy'
    },
    {
        tickerId: 'GOOG456',
        ticker: 'GOOG',
        quantity: 5,
        timestamp: '2023-08-05 15:30:00',
        buyPrice: 2700,
        totalPrice: 13500,
        action: 'buy'
    },
    {
        tickerId: 'TSLA789',
        ticker: 'TSLA',
        quantity: 2,
        timestamp: '2023-08-07 09:45:00',
        buyPrice: 650,
        totalPrice: 1300,
        action: 'buy'
    }
];

// Function to update cash details
function updateCash() {
    document.getElementById("settlement-cash").innerText = `$${stockData.AAPL * 145 + stockData.GOOG * 2700 + stockData.TSLA * 650}`;
}

// Function to update the stocks chart
function updateStocksPieChart() {
    const ctx = document.getElementById('stocksPieChart').getContext('2d');
    const labels = Object.keys(stockData);
    const data = Object.values(stockData);
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#FF9999', '#66B2FF', '#FFCC00'],
            }]
        }
    });
}

// Function to update the net worth graph
function updateNetWorthGraph() {
    const ctx = document.getElementById('netWorthChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
            datasets: [{
                label: 'Net Worth',
                data: netWorthData,
                borderColor: '#00bcd4',
                fill: false,
                tension: 0.1
            }]
        }
    });
}

// Function to toggle the visibility of the transaction history modal
function toggleTransactionPopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('transactionPopup');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
}

// Function to display the transaction history in the modal
function showTransactions() {
    const transactionTable = document.getElementById('transactionTable').getElementsByTagName('tbody')[0];
    transactionTable.innerHTML = ''; // Clear previous table entries

    transactions.forEach(transaction => {
        const row = document.createElement('tr');

        const tickerIdCell = document.createElement('td');
        tickerIdCell.innerText = transaction.tickerId;
        row.appendChild(tickerIdCell);

        const tickerCell = document.createElement('td');
        tickerCell.innerText = transaction.ticker;
        row.appendChild(tickerCell);

        const quantityCell = document.createElement('td');
        quantityCell.innerText = transaction.quantity;
        row.appendChild(quantityCell);

        const timestampCell = document.createElement('td');
        timestampCell.innerText = transaction.timestamp;
        row.appendChild(timestampCell);

        const buyPriceCell = document.createElement('td');
        buyPriceCell.innerText = `$${transaction.buyPrice}`;
        row.appendChild(buyPriceCell);

        const totalPriceCell = document.createElement('td');
        totalPriceCell.innerText = `$${transaction.totalPrice}`;
        row.appendChild(totalPriceCell);

        const actionCell = document.createElement('td');
        actionCell.innerText = transaction.action.charAt(0).toUpperCase() + transaction.action.slice(1); // Capitalize "buy" or "sell"
        row.appendChild(actionCell);

        transactionTable.appendChild(row);
    });
}

// Event listeners for the modal
document.getElementById('transactionsLink').addEventListener('click', () => {
    toggleTransactionPopup();
    showTransactions();
});

document.getElementById('closeTransactionBtn').addEventListener('click', () => {
    toggleTransactionPopup();
});

// Function to toggle the visibility of the Add/Remove Stock pop-up
function togglePopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
}

// Event listener for Add Stock button
document.getElementById('addStockBtn').addEventListener('click', () => {
    document.getElementById('popupTitle').innerText = 'Add Stock';  // Set popup title
    document.getElementById('confirmStockAction').dataset.action = 'add';  // Set action type for button
    togglePopup();  // Show the popup
});

// Event listener for Remove Stock button
document.getElementById('removeStockBtn').addEventListener('click', () => {
    document.getElementById('popupTitle').innerText = 'Remove Stock';  // Set popup title
    document.getElementById('confirmStockAction').dataset.action = 'remove';  // Set action type for button
    togglePopup();  // Show the popup
});

// Event listener for closing the pop-up
document.getElementById('closePopupBtn').addEventListener('click', () => {
    togglePopup();  // Hide the popup when the "Close" button is clicked
});

// Event listener for confirming the Add/Remove Stock action
document.getElementById('confirmStockAction').addEventListener('click', () => {
    const action = document.getElementById('confirmStockAction').dataset.action;
    const stock = document.getElementById('stockSelect').value;
    const quantity = parseInt(document.getElementById('stockQuantity').value);

    if (!isNaN(quantity) && quantity > 0) {
        if (action === 'add') {
            // Add stock
            stockData[stock] = stockData[stock] + quantity;

            // Record the transaction
            transactions.push({
                tickerId: `${stock}${Date.now()}`,  // Generate unique ID for each transaction
                ticker: stock,
                quantity: quantity,
                timestamp: new Date().toLocaleString(),
                buyPrice: 145,  // Placeholder price
                totalPrice: 145 * quantity,
                action: 'buy'
            });
        } else if (action === 'remove') {
            // Remove stock (check if enough stock is available)
            if (stockData[stock] >= quantity) {
                stockData[stock] = stockData[stock] - quantity;

                // Record the transaction
                transactions.push({
                    tickerId: `${stock}${Date.now()}`,  // Generate unique ID for each transaction
                    ticker: stock,
                    quantity: quantity,
                    timestamp: new Date().toLocaleString(),
                    buyPrice: 145,  // Placeholder price
                    totalPrice: 145 * quantity,
                    action: 'sell'
                });
            } else {
                alert('You do not have enough stock to remove!');
                return;
            }
        }

        // Update the charts and cash details after action
        updateStocksPieChart();
        updateCash();
        togglePopup();  // Hide the popup
    } else {
        alert('Please enter a valid quantity.');
    }
});


// Initializing charts and data
updateNetWorthGraph();
updateStocksPieChart();
updateCash();
