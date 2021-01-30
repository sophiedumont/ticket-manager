const authProvider = {
  login: ({ username, password }: { username: string; password: string }) => {
    const request = new Request('http://localhost:3000/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem('auth', data.access_token);
      })
      .catch(() => {
        throw new Error('Network error');
      });
  },

  logout: () => {
    localStorage.removeItem('auth');
    return Promise.resolve();
  },

  checkError: (error: any) => {
    const status = error.status;
    console.log(status);
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  checkAuth: () =>
    localStorage.getItem('auth') ? Promise.resolve() : Promise.reject(),

  getPermissions: () =>
    localStorage.getItem('auth') ? Promise.resolve() : Promise.reject(),
};

export default authProvider;
