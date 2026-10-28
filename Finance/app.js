const DB = {
    getUsers: () => JSON.parse(localStorage.getItem("finance_users")) || [],
    saveUsers: (users) => localStorage.setItem("finance_users", JSON.stringify(users)),
    
    getCurrentUser: () => localStorage.getItem("finance_current_user"),
    setCurrentUser: (username) => localStorage.setItem("finance_current_user", username),
    
    getTransactions: (username) => JSON.parse(localStorage.getItem(`finance_tx_${username}`)) || [],
    saveTransactions: (username, txs) => localStorage.setItem(`finance_tx_${username}`, JSON.stringify(txs)),
    
    getCash: (username) => {
        const users = DB.getUsers();
        const user = users.find(u => u.username === username);
        return user ? user.cash : 10000.00;
    },
    updateCash: (username, newCash) => {
        let users = DB.getUsers();
        users = users.map(u => u.username === username ? { ...u, cash: newCash } : u);
        DB.saveUsers(users);
    }
};
async function lookup(symbol) {
    try {
        const response = await fetch(`https://finance.cs50.io/quote?symbol=${symbol.toUpperCase()}`);
        if (!response.ok) return null;
        const data = await response.json();
        return {
            name: data.companyName,
            price: data.latestPrice,
            symbol: symbol.toUpperCase()
        };
    } catch (error) {
        console.error("Error fetching quote:", error);
        return null;
    }
}
