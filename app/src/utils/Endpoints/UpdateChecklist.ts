const updateChecklist = async (email: string, newChecklist: any) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  const checklistData = {
    email: email.trim().toLowerCase(),
    checklist: newChecklist
  };

  const response = await fetch('http://localhost:5000/api/checklist', {
    method: 'POST',
    mode: 'cors',
    headers: headers,
    body: JSON.stringify(checklistData),
  })
    
  if (response.status === 400) {
    console.error("Received a 400 error when updating the checklist");
  }
  if (response.status === 500) {
    console.error("Received a 500 error when updating the checklist");
  }
  
  const data = await response.json();
  console.log('Success:', data.msg);
  return data;
};

export default updateChecklist;