
const updateItems = async (email: string, newItems: any) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  const itemsData = {
    email,
    items: newItems
  }

  const itemsResponse = await fetch('http://localhost:5000/api/items', {
    method: 'POST',
    mode: 'cors',
    headers,
    body: JSON.stringify(itemsData),
  });

  if (itemsResponse.status === 400) {
    console.error("There was a 400 error when storing the items in the database");
  }
  if (itemsResponse.status === 500) {
    console.error("There was a 500 error when storing the items in the database");
  }

  await itemsResponse.json();
  return;
};

export default updateItems;