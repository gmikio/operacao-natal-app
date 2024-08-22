import axios from 'axios';

export const fetchTasks = async (token: string, idn: string) => {
  try {
    const response = await axios.get(
      `http://opntasks.us-east-1.elasticbeanstalk.com/api/Tasks/CreateRandomTask?idn=${idn}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};
