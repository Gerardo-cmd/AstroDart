const createLinkToken = async (userToken: string, type: string) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  const body = { 
    userToken,
    type 
  };

  const response = await fetch(`http://localhost:5000/api/create_link_token`, {
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