const loginUser = async (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate authentication
      if (username === 'admin' && password === 'password') {
        resolve({
          id: 1,
          username: 'admin',
          name: 'Administrator',
          role: 'admin',
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

export default loginUser;
