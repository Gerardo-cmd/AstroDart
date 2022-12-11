const deleteUser = async (email: string, password: string) => {
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  const deleteUserData = {
    email: email.trim().toLowerCase(),
    password: password.trim()
  };
  const response = await fetch('http://localhost:5000/api/user', {
    method: 'DELETE',
    mode: 'cors',
    headers: headers,
    body: JSON.stringify(deleteUserData),
  })
  if (response.status === 400) {
    return "400"
  }
  if (response.status === 500) {
    return "500";
  }
  const data = await response.json();
  if (data?.msg === "Invalid credentials") {
    return "Invalid credentials"
  }
  if (data?.msg === "There is not an accont registered with this email") {
    return "There is not an accont registered with this email";
  }
  if (data?.msg === "Account deleted") {
    return "Account deleted";
  }
};

export default deleteUser;