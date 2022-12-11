const createUser = async (firstName: string, lastName: string, email: string, password: string, confirmPassword: string) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  const createUserData = {
    firstName,
    lastName,
    email,
    password, 
    confirmPassword
  };
  const response = await fetch('http://localhost:5000/api/user', {
    method: 'PUT',
    mode: 'cors',
    headers: headers,
    body: JSON.stringify(createUserData),
  });

  if (response.status === 400) {
    return "400";
  }
  if (response.status === 500) {
    return "500";
  }

  const data = await response.json();

  if (!data?.data) {
    return "Email taken";
  }
  return data.data;
};

export default createUser;