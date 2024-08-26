import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import opnIcon from '../assets/opnIcon.svg'; // Import the SVG file

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object({
    idn: Yup.string()
      .required('Campo obrigatório')
      .matches(/^[0-9]+$/, 'IDN deve conter apenas números'),
    userName: Yup.string()
      .required('Nome obrigatório')
      .min(3, 'Nome deve possuir no mínimo 3 caracteres'),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      idn: '',
      userName: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      const success = await login(values);
      setSubmitting(false);

      if (success) {
        navigate('/tasks');
      } else {
        setFieldError('idn', 'Login failed. Please check your credentials.');
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center bg-white p-6 rounded shadow-md w-full max-w-sm">
        <img src={opnIcon} alt="Operação Natal Icon" className="w-24 mb-4" /> {/* Add the SVG here */}
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={formik.handleSubmit} className="w-full">
          <div className="mb-4">
            <label
              htmlFor="idn"
              className="block text-sm font-medium text-gray-700"
            >
              IDN
            </label>
            <input
              type="text"
              id="idn"
              {...formik.getFieldProps('idn')}
              className={`mt-1 block w-full p-2 border ${
                formik.touched.idn && formik.errors.idn
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md`}
            />
            {formik.touched.idn && formik.errors.idn ? (
              <div className="text-red-500 text-sm">{formik.errors.idn}</div>
            ) : null}
          </div>

          <div className="mb-4">
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              type="text"
              id="userName"
              {...formik.getFieldProps('userName')}
              className={`mt-1 block w-full p-2 border ${
                formik.touched.userName && formik.errors.userName
                  ? 'border-red-500'
                  : 'border-gray-300'
              } rounded-md`}
            />
            {formik.touched.userName && formik.errors.userName ? (
              <div className="text-red-500 text-sm">{formik.errors.userName}</div>
            ) : null}
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 ${
              formik.isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
