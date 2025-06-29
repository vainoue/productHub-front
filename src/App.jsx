import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Product from './pages/Product';
import EditProfile from './pages/EditProfile';
import NewProduct from './pages/NewProduct';
import EditProduct from './pages/EditProduct';
import Favorites from './pages/Favorites';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from './pages/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/products" 
              element={
                <PrivateRoute>
                  <Layout>
                    <Product />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route 
              path="/new-product" 
              element={
                <PrivateRoute>
                  <Layout>
                    <NewProduct />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/edit-product/:id" 
              element={
                <PrivateRoute>
                  <Layout>
                    <EditProduct />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/favorites" 
              element={
                <PrivateRoute>
                  <Layout>
                    <Favorites />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route 
              path="/edit-profile" 
              element={
                <PrivateRoute>
                  <Layout>
                    <EditProfile />
                  </Layout>
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer 
          position="top-right" 
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          className="mt-16"
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App

