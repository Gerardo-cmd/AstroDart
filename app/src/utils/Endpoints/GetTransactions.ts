const getTransactions = async (email: string) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  const request = { email };
  const response = await fetch("http://localhost:5000/api/transactions", {
    method: "POST",
    mode: "cors",
    headers: headers,
    body: JSON.stringify(request)
  });

  if (!response.ok) {
    const message = await response.json();
    console.error(message);
    return message;
  }

  const data = await response.json();
  return data;
};

export default getTransactions;