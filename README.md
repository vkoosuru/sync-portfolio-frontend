# sync-portfolio-frontend

# Stock Portfolio Web Application

This is a simple stock portfolio management web application that allows users to track their stocks, investments, net worth, and more. The app displays various data visualizations, including a pie chart for stock holdings and a line chart for net worth over time.

## Features
- **Settlement Account Cash**: Displays the total cash balance in the settlement account.
- **Investments and Bonds**: Lists the user's investments and bonds (currently static).
- **Stock Holdings**: Displays stock holdings with a pie chart showing the total stocks in the portfolio.
- **Net Worth Graph**: A line graph showing the change in net worth over time.
- **Add and Remove Stocks**: Functionality to add or remove stocks from the portfolio. (need to work on this) 
- **Transaction History**: View a table of previous stock transactions, including the stock ticker, quantity, price, and action (buy/sell).

## To Do
- **Add/Remove Stock**: This feature is working, but the integration with a real stock API to get the live stock prices is still to be done.
  - **Add Stock**: Allows users to increase their stock holdings by specifying the stock symbol and quantity.
  - **Remove Stock**: Allows users to decrease their stock holdings by specifying the stock symbol and quantity (if they have enough of the stock).


## Requirements
- Modern web browser (Chrome, Firefox, Safari, etc.)
- The application uses **Chart.js** for visualizing data.

## Getting Started

1. Clone or download the repository.
2. Open the `index.html` file in your web browser to start the application.
3. Modify the `script.js` file if you'd like to customize the stock portfolio and transactions.

## Future Enhancements

- **Real-time Stock Prices**: Fetch real-time data from a stock API.
- **User Authentication**: Implement a login system to store user-specific portfolios.
- **Backend Database**: Connect to a backend system to store and manage users' portfolios and transactions.
- **Advanced Analytics**: Provide advanced charts and performance metrics for users' investments.

