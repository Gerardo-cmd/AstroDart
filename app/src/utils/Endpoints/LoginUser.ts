const loginUser = async (email: string, password: string) => {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    const loginData = {
      email: email.trim().toLowerCase(),
      password: password.trim()
    };
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      mode: 'cors',
      headers: headers,
      body: JSON.stringify(loginData),
    })
    if (response.status === 400) {
        return "400"
    }
    if (response.status === 500) {
        return "500";
    }
    const data = await response.json();
    if (!data?.data) {
        return "Invalid credentials"
    }
    return data.data;
};

export default loginUser;