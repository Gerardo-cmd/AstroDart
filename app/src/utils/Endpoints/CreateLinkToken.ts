const createLinkToken = async (userToken: string, isPaymentInitiation: boolean) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  const body = { userToken };

  const path = isPaymentInitiation
    ? "/create_link_token_for_payment"
    : "/create_link_token";

  const response = await fetch(`http://localhost:5000/api${path}`, {
    method: "POST",
    mode: 'cors',
    headers: headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return false;
  }
  
  const data = await response.json();
  return data;
};

export default createLinkToken;