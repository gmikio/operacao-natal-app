import axios from 'axios';

// Fetch the current task for the user
export const fetchTask = async (token: string, idn: string) => {
  try {
    const response = await axios.get(
      `http://opntasks.us-east-1.elasticbeanstalk.com/api/Tasks/CreateRandomTask?idn=${idn}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data; // Adjust based on your API response structure
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};

// Mark the task as completed
export const completeTask = async (idn: string) => {
  try {
    const response = await axios.post(
      `http://opntasks.us-east-1.elasticbeanstalk.com/api/Tasks/CompleteTask?idn=${idn}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error completing task:', error);
    throw error;
  }
};

// Fetch completed tasks
export const getCompletedTasks = async (idn: string) => {
  try {
    const response = await axios.get(
      `http://opntasks.us-east-1.elasticbeanstalk.com/api/Tasks/GetUserCompletedTasks?idn=${idn}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching completed tasks:', error);
    throw error;
  }
};

// Cancel the current task
export const cancelTask = async (idn: string) => {
  try {
    const response = await axios.put(
      `http://opntasks.us-east-1.elasticbeanstalk.com/api/Tasks/CancelTask?idn=${idn}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error cancelling task:', error);
    throw error;
  }
};

// Get the ranking
export const getRanking = async () => {
  try {
    const response = await axios.get(
      `http://opntasks.us-east-1.elasticbeanstalk.com/api/Tasks/GetRanking`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching ranking:', error);
    throw error;
  }
};
