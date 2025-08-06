# 📊 Investment Dashboard

## Overview

**Investment Dashboard** is a web-based application built using **HTML**, **JavaScript**, and **CSS**, with **ApexCharts** used for data visualization. It enables users to manage a **virtual investment portfolio**, track **stock holdings**, monitor **live stock prices**, and view **transaction histories**.

Key components include:

* **Settlement Account** for managing liquid cash.
* **Cashflow display** showing the total portfolio value (stocks + investments).
* **Transaction tracking** for both stock and cash activities.

---

## 🚀 Features

### 📌 Dashboard (Home Page)

* Displays **Settlement Account balance** with green/red indicators for increases or decreases.
* Shows **Cashflow** (total portfolio value: stocks + investments) with dynamic updates.
* Lists **bonds and investments** with options to add/remove entries.
* Visualizes:

  * **Net worth over time** (line chart)
  * **Stock holdings distribution** (pie chart)

### 📈 Holdings Page

* Table of stock holdings with:

  * Ticker symbol
  * Quantity
  * Current price (with color-coded changes)
* Live price updates every 5 seconds.
* Clickable tickers open a popup with:

  * Price history
  * Key metrics (open, close, high, low)
* Buttons to **Buy/Sell** stocks with updates to:

  * Settlement Account
  * Portfolio holdings

### 💼 Transactions Page

* **Settlement Account History**:

  * Logs all cash movements (e.g., Add/Remove Cash, Stock Buy/Sell)
  * Color-coded: Green for inflows, Red for outflows
* **Stock Transaction History**:

  * Details each stock trade (buy/sell)
  * Includes ticker, quantity, price, and total cost

### 🔄 Dynamic Updates

* Simulated stock price updates every 5 seconds
* Real-time updates to:

  * Settlement Account
  * Cashflow (with green/red indicators)
* Fully **responsive** for desktop and mobile

---

## 🛠 Setup Instructions

### 1. Clone or Download the Project

#### Clone the repository:

```bash
git clone https://github.com/your-username/investment-dashboard.git
```

#### Or download the following files manually:

* `index.html`
* `script.js`
* `styles.css`

---

### 2. Hosting the Files

Place the files in a web server directory using any of the following:


Open `index.html` directly in a browser

> ⚠️ Some features (e.g., live updates) may require a server due to **CORS** restrictions.

---

### 3. Dependencies

The project uses **ApexCharts**, loaded via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
```

> ✅ No additional installations are needed. This is a **fully client-side app**.

---

The app initializes with:

* Sample stock data
* A **Settlement Account** balance of `$5,000`
* A **Cashflow** total of `$10,500`

---

## 💡 Usage Guide

### 🔗 Navigation

* Use the **top navbar** to switch between:

  * Home
  * Holdings
  * Transactions

### 💰 Settlement Account

* View current balance at the top of the **Home page**
* Use **“Add Cash”** or **“Remove Cash”** to update balance
* All cash movements are logged in the **Settlement Account History**

### 💼 Cashflow

* Displays total portfolio value (Stocks + Investments)
* Automatically updates with stock price or investment changes

### 📊 Stock Transactions

* Navigate to **Holdings** page
* Use **“Buy Stock”** or **“Sell Stock”** to open trade popup
* Choose ticker and quantity
* Buying reduces Settlement Account, selling increases it
* All trades are logged in:

  * **Transaction History**
  * **Settlement Account History**

### 🏦 Investments

* Add bonds/investments via "+" button (e.g., `Bond 3: $4000`)
* Remove by clicking "×" next to an entry

### 📉 Live Prices

* Click a ticker to view historical data & metrics
* Stock prices update every **5 seconds**

---

## 📁 File Structure

| File         | Description                                           |
| ------------ | ----------------------------------------------------- |
| `index.html` | Main HTML structure & layout                          |
| `script.js`  | JavaScript logic: data handling, transactions, charts |
| `styles.css` | Styles for layout, responsiveness, and UI coloring    |

---

## ⚠ Notes

* **Data Persistence**: Data resets on reload. To persist data, add **`localStorage`** support.
* **Simulated Prices**: Prices change randomly for demonstration.
* **Color Indicators**: Green = Increase, Red = Decrease
* **Responsive Design**: Optimized for desktop & mobile devices.

---

## 🔮 Future Improvements

* ✅ Add **`localStorage`** for persistent data
* ✅ Integrate **real-time stock APIs** instead of simulated data
* ✅ Add filtering/sorting for transaction tables
* ✅ Add **export to CSV** functionality