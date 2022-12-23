const getInvestments = async (accessToken: string) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  const accessTokenData = { accessToken }
  const response = await fetch("http://localhost:5000/api/investments", {
    method: "POST",
    mode: "cors",
    headers: headers,
    body: JSON.stringify(accessTokenData),
  });

  if (!response.ok) {
    const message = await response.json();
    console.error(message);
    return message;
  }

  const data = await response.json();
  return data;
};

export default getInvestments;