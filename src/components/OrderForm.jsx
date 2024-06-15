import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";

const OrderForm = ({ fetchOrders }) => { 
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpirationDate, setCardExpirationDate] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardOwnerName, setCardOwnerName] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = {
      cardNumber: cardNumber,
      cardExpirationDate: cardExpirationDate,
      cardCvv: cardCvv,
      cardOwnerName: cardOwnerName
    };

    axios.post('http://localhost:8081/api/v1/orders', dataToSend)
      .then(response => {
        console.log('Payment information successfully submitted:', response.data);
        fetchOrders(); 
        navigate('/');
      })
      .catch(error => {
        console.error('Error submitting payment information:', error);
      });

    setCardNumber('');
    setCardExpirationDate('');
    setCardCvv('');
    setCardOwnerName('');
  };

  return (
    <div className="payment-form">
      <Link to={'/checkorder'} ><FaArrowLeft className="back_arrow" /></Link>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="card-number">Номер карты:</label>
          <input
            type="text"
            id="card-number"
            name="card-number"
            placeholder="Введите номер карты"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            maxLength="16"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiry-date">Дата окончания (MM/YY):</label>
          <input
            type="text"
            id="expiry-date"
            name="expiry-date"
            placeholder="ММ/YY"
            value={cardExpirationDate}
            onChange={(e) => setCardExpirationDate(e.target.value)}
            pattern="(0[1-9]|1[0-2])\/[0-9]{4}"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV-код:</label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            placeholder="CVV"
            value={cardCvv}
            onChange={(e) => setCardCvv(e.target.value)}
            minLength="3"
            maxLength="4"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="card-owner">Имя владельца карты:</label>
          <input
            type="text"
            id="card-owner"
            name="card-owner"
            placeholder="Введите имя владельца карты"
            value={cardOwnerName}
            onChange={(e) => setCardOwnerName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <button className='payment-form__link' type='submit'> Оплатить</button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
