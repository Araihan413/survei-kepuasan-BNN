
const refreshToken = async () => {
  const urlApi = 'http://localhost:2100';
  try {
    const response = await fetch(`${urlApi}/api/auth/refresh-token`, {
      method: 'POST',
      credentials: 'include' // Kirim HTTP-only cookie
    });

    if (!response.ok) throw new Error('Refresh token gagal');

    const { accessToken } = await response.json();
    
    // Update access token di state
    const accessTokenLocal = localStorage.getItem('accessToken');
    if (accessTokenLocal) {
      localStorage.setItem('accessToken', accessToken);
    }
    
    return accessToken;
  } catch (error) {
    console.error('Error:', error.message);
    logout(); // Force logout jika refresh gagal
    throw error;
  }
};

const logout = async () => {
  localStorage.removeItem('accessToken');
  const urlApi = 'http://localhost:2100';
  try {
    await fetch(`${urlApi}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include' // Hapus HTTP-only cookie
    });

    // Clear access token dari state
    // setAuthState({ accessToken: null, isAuthenticated: false });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

export { refreshToken, logout };