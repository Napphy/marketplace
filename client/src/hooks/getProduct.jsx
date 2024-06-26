import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const getProduct = () => {
    const { setUserData } = useAuth()
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProductsByUser = async (userId) => {
        try {
            setError(null);
            setLoading(true);
            const res = await fetch(`https://marketplace-3ph4.onrender.com/getProductsByUser?createdByID=${userId}`, {
                method: 'GET',
            });
            const data = await res.json();
            if (res.status === 200) {
                setProducts(data.products);
            } else if (res.status === 400) {
                setError(data.message);
            } else {
                setError('Error fetching products');
            }
        } catch (error) {
            setError('Error fetching products');
            setLoading(false);
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };


    const fetchUser = async (userID) => {
        try{
            setError(null);
            setLoading(true);

            const res = await fetch(`https://marketplace-3ph4.onrender.com/getUser/${userID}`, {
                method: 'GET',
            });

            const data = await res.json();
            if (res.status === 200) {
                const { user } = data;
                setUserData(user)
            } else if (res.status === 400) {
                setError(data.message);
            } else {
                setError('Error fetching products');
            }
        }catch (error) {
            setError('Error fetching User');
            setLoading(false);
            console.error('Error fetching user:', error);
        }
    }

    const fetchAllProducts = async () => {
        try{
            const res = await fetch(`https://marketplace-3ph4.onrender.com/getProducts`, {
                method: 'GET',
            });
            const data = await res.json();
            if (res.status=== 200) {
                setAllProducts(data.products);
            } else if (res.status === 400) {
                setError(data.message);
            } else {
                setError('Error fetching products');
            }
        }catch(error){
            message.error('Fetching all products failed because: ', error);
        } finally {
            setLoading(false);
        }
    }

    return { allProducts, products, loading, error, fetchProductsByUser, fetchAllProducts, fetchUser };
};

export default getProduct;
