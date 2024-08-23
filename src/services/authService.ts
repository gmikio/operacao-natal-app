import axios from 'axios';

export interface LoginData {
  idn: string;
  userName: string;
}

export const login = async (data: LoginData): Promise<boolean> => {
  try {
    const response = await axios.post(
      'http://opntasks.us-east-1.elasticbeanstalk.com/api/Login',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('response.data = ', response.data);
    const { name, idn, task } = response.data;

    // Store session data as needed
    localStorage.setItem('userToken', 'alreadyLogged'); // Consider improving this if a real token becomes available
    localStorage.setItem('userName', name);
    localStorage.setItem('idn', idn);
    localStorage.setItem('task', JSON.stringify(task)); // Store task as a string if needed

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
