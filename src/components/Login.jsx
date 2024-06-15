import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CustomContext } from '../utilits/Context';
import axios from 'axios';

const Login = () => {
  const { setUser } = useContext(CustomContext);
  const navigate = useNavigate();

  const loginUser = (e) => {
    e.preventDefault();
    let newUser = {
      email: e.target[0].value,
      password: e.target[1].value
    };

    axios.post('http://localhost:8081/api/v1/auth', newUser)
      .then(({ data }) => {
        setUser({
          token: data.accessToken,
          ...data.user
        });

        localStorage.setItem('user', JSON.stringify({
          token: data.accessToken,
          ...data.user
        })); 
        navigate('/');
        window.location.reload();
      })
      
      .catch((err) => console.log(err.message));
  };

  return (
    <div className='content'>
      <form className='form' onSubmit={loginUser}>
        <h2 className='form__title'>Вход на Home Stuff</h2>
        <input type='text' placeholder="Введите Email" className='form__field' />
        <input type='password' placeholder="Введите пароль" className='form__field' />
        <div className='form__create'>
          <Link to={"/form"} className="link__to">Создать аккаунт</Link>
        </div>
        <button className="form__btn" type="submit">Войти</button>
      </form>
    </div>
  );
}

export default Login;
