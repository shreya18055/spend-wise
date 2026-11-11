
const API_BASE_URL = "/api";

function mapTransaction(transaction) {
  return {
    id: transaction.id,
    title: transaction.description,
    category: transaction.category,
    amount: Number(transaction.amount),
    type: transaction.type.toLowerCase(),
    date: transaction.transactionDate,
  };
}

export async function getTransactions() {
  const response = await fetch(`${API_BASE_URL}/transactions`);

  if (!response.ok) {
    throw new Error("Unable to fetch transactions");
  }

  const data = await response.json();
  return data.map(mapTransaction);
}

export async function createTransaction(transaction) {
  const payload = {
    description: transaction.title,
    category: transaction.category,
    amount: Number(transaction.amount),
    type: transaction.type.toUpperCase(),
    transactionDate: transaction.date,
  };

  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to create transaction");
  }

  const data = await response.json();
  return mapTransaction(data);
}

export async function getSummary() {
  const response = await fetch(`${API_BASE_URL}/transactions/summary`);

  if (!response.ok) {
    throw new Error("Unable to fetch account summary");
  }

  return response.json();
}
