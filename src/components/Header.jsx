import React, { useContext, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Order from "./Order";
import { Link, useNavigate } from "react-router-dom";
import { CustomContext } from "../utilits/Context";

const showOrders = (props) => {
  return (
    <div>
      {props.orders.map(el => (
        <Order onDelete={props.onDelete} key={el.id} item={el} />
      ))}
      <Link to={'checkorder'}><button className='btn__order'>Оформить заказ</button></Link>
    </div>
  );
}

const showNothing = () => {
  return (
    <div className="empty">
      <h2>Товаров нет</h2>
    </div>
  );
}

export default function Header(props) {
  const { user, setUser } = useContext(CustomContext);
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  const logOutUser = () => {
    setUser({ email: '' });
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  }

  return (
    <header>
      <div>
        <span className="logo">House Staff</span>
        <div className="nav">
          <div>
            {user.token ? (
              <span className="login" onClick={logOutUser}>Выйти</span>
            ) : (
              <Link className="login" to={'/form'}>Войти</Link>
            )}
          </div>
        </div>
        <FaShoppingCart
          onClick={() => setCartOpen(!cartOpen)}
          className={`shop-cart-button ${cartOpen && "active"}`}
        />
        {cartOpen && (
          <div className="shop-cart">
            {props.orders.length > 0 ? showOrders(props) : showNothing()}
          </div>
        )}
      </div>
      <div className="presentation"></div>
    </header>
  );
}