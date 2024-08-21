import axios from 'axios';

export interface LoginData {
  idn: string;
  userName: string;
}

export const login = async (data: LoginData): Promise<boolean> => {
  try {
    const response = await axios.post('http://opntasks.us-east-1.elasticbeanstalk.com/api/Login', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Store token or session data as needed
    localStorage.setItem('userToken', response.data.token);

    return true;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error during login:', error.message);
    } else {
      console.error('Unexpected error during login:', error);
    }
    return false;
  }
};
