// Dummy data
const stockData = {
    AAPL: 50,
    GOOG: 30,
    TSLA: 10
};

const netWorthData = [10500, 10700, 10650, 10900, 11050]; // Dummy net worth values for graph
let currentNetWorthIndex = 0;

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

// Toggle popup visibility
function togglePopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');
    overlay.style.display = overlay.style.display === 'block' ? 'none' : 'block';
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
}

// Handle Add/Remove Stock
document.getElementById('addStockBtn').addEventListener('click', () => {
    togglePopup();
});
document.getElementById('removeStockBtn').addEventListener('click', () => {
    togglePopup();
});

document.getElementById('confirmStockAction').addEventListener('click', () => {
    const stock = document.getElementById('stockSelect').value;
    const quantity = parseInt(document.getElementById('stockQuantity').value);
    if (!isNaN(quantity) && quantity > 0) {
        stockData[stock] += quantity;
        updateStocksPieChart();
        updateCash();
        togglePopup();
    } else {
        alert("Please enter a valid quantity");
    }
});

// Initializing charts and data
updateNetWorthGraph();
updateStocksPieChart();
updateCash();
