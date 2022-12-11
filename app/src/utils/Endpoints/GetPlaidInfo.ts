const getPlaidInfo = async () => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  const response = await fetch("http://localhost:5000/api/info", { 
    method: "GET",
    mode: 'cors',
    headers: headers,
  });

  if (!response.ok) {
    return false;
  }

  const data = await response.json();
  return data;
};

export default getPlaidInfo;
