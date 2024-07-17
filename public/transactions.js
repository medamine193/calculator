async function fetchTransactions() {
    try {
      const response = await fetch('/operations');
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const transactions = await response.json();
      console.log('Fetched transactions:', transactions); 
      displayTransactions(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }
  
  function displayTransactions(transactions) {
    const transactionsDiv = document.getElementById('transactions');
    transactionsDiv.innerHTML = '';
  
    transactions.forEach(transaction => {
      const div = document.createElement('div');
      div.className = 'transaction';
      div.textContent = `${transaction.expression} = ${transaction.result}`;
      transactionsDiv.appendChild(div);
    });
  }
  

  window.onload = fetchTransactions;
  
  