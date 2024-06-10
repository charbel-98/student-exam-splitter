import { useState } from 'react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        <button
          onClick={toggleAuthMode}
          className="text-blue-500 hover:underline mb-4 focus:outline-none"
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Login'}
        </button>
        <form>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full px-3 py-2 mb-4 border rounded"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-3 py-2 mb-4 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-3 py-2 mb-4 border rounded"
          />
          <button
            type="submit"
            className="w-full px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
