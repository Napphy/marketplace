import React, { useEffect, useState } from 'react';
import { Button, Card, Space, Modal, message, FloatButton  } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import getProduct from '../hooks/getProduct';
import  Footer  from './components/Footer';
import  NavBar  from './components/Navbar'
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './Home.css';

const Home = () => {
    const { userData, logout } = useAuth();
    const { fetchAllProducts, allProducts } = getProduct();

    useEffect(() => {

        const handleBeforeUnload = (e) => {
            e.preventDefault();
            logout(); 
        };

        fetchAllProducts();

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [logout]);
        

    const refreshItems = async () => {
        try {
            fetchAllProducts();
            console.log('refresh');
        } catch (error) {
            console.error(error);
        }
    };

    const truncateName = (name) => {
        const parts = name.split(' ');
        if (parts.length > 1) {
            return parts.slice(0, Math.ceil(parts.length / 2)).join(' ');
        } else {
            return name;
        }
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [canSendSMS, setCanSendSMS] = useState(true);

    const handleCancel = () => {
        setModalVisible(false);
    };    

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const debouncedSendNotif = async (item, number) => {

        if (number.startsWith('0')) {
            // Replace '0' with '+639'
            number = `+63${number.slice(1)}`;
        }
        
        const token = import.meta.env.VITE_SMS_API_TOKEN;

        const senderId = "PhilSMS";
        const recipient = number;
        const messageToSend = `${truncateName(userData.name)} is interested in your ${item}. Please send them an email ${userData.email}`;
        
        const sendData = {
            sender_id: senderId,
            recipient: recipient,
            message: messageToSend,
        };

        try {
            const response = await axios.post('https://app.philsms.com/api/v3/sms/send', sendData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            setCanSendSMS(false);
            message.success('SMS notification sent successfully. Please wait for an email from the seller.');
            message.warning('Please wait 1 minute before sending another SMS Notification. This is to prevent spams.');
        } catch (error) {
            console.error('Error:', error);
            message.error('SMS notification was not sent');
        }

        setModalVisible(false);

        setTimeout(() => {
            setCanSendSMS(true);
        }, 60000);
    };

    return (
        <>
            <NavBar />
            <Space direction="vertical" style={{ paddingTop: '130px' , margin: '20px' }}>
                <div className="product-grid">
                    {allProducts.map((product) => (
                        <Card
                            key={product._id} 
                            title={product.item}
                            className="product-card"
                            onClick={() => openModal(product)}
                        >
                            <p>Price: ₱{product.price}</p>
                            <p>Description: {product.description}</p>
                            <p>Seller: {truncateName(product.createdBy)}</p>
                            <img src={product.image} alt="Product" style={{ width: '100%', maxHeight: '350px', objectFit: 'contain' }} />
                        </Card>
                    ))}
                </div>
            </Space>
            <FloatButton 
            type="primary" 
            onClick={refreshItems}  
            icon = {<ReloadOutlined />}
            />
                
            
            <Modal 
                title="Interested?"
                open={modalVisible} 
                onCancel={handleCancel}
                footer={[
                    <Button key="sendEmail" type="primary" onClick={() => debouncedSendNotif(selectedProduct.item, selectedProduct.createdByNumber)} disabled={!canSendSMS}>
                        Send SMS Notification to the Seller
                    </Button>,
                    <Button key="cancel" onClick={handleCancel}>
                        Cancel
                    </Button>,
                ]}
            >
                {selectedProduct && (
                    <>
                        <p>Item: {selectedProduct.item}</p>
                        <p>Price: ₱{selectedProduct.price}</p>
                        <p>Description: {selectedProduct.description}</p>
                        <p>Seller: {truncateName(selectedProduct.createdBy)}</p>
                        <img src={selectedProduct.image} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </>
                )}
            </Modal>
            <Footer />
        </>
    );
};

export default Home;
