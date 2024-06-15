import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import OrderForm from './OrderForm';
import {FaArrowLeft} from "react-icons/fa6"

export default function CheckOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get('http://localhost:8081/api/v1/carts')
      .then(response => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the cart items!", error);
        setLoading(false);
      });
  };

  const calculateTotal = () => {
    const total = orders.reduce((total, item) => {
      return total + (item.price * item.count);
    }, 0);
    return total.toFixed(2);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content__check">
      
      <div className="form__check">
       <Link to={'/'} ><FaArrowLeft className="back_arrow" /></Link>
        <h2 className="form__title__check">Оформление заказа</h2>
        <div className="order-list__check">
          {orders.map(order => (
            <div key={order.id} className="item__check">
              <img src={order.image} alt={order.title} />
              <h2>{order.title}</h2>
              <p>{order.price}$</p>
              <p className='item__check__flex'>Количество: {order.count}</p>
            </div>
          ))}
        </div>
        <div className="total__check">
          <h2>Общая сумма: {calculateTotal()}$</h2>
        </div>
        <Link to={'/orderform'}><button className="form__btn__check">Оформить</button></Link>
      </div>
    </div>
  );
}
