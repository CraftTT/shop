import React, { useContext, useState } from "react";
import { Link, useNavigate, } from "react-router-dom";
import {FaPencilAlt} from 'react-icons/fa'
import {AiFillEye, AiFillEyeInvisible} from 'react-icons/ai'
import axios from "axios";
import { CustomContext } from "../utilits/Context";


function Form() {

    const [status, setStatus] = useState(false)
    const [email, setEmail] = useState('')

    const navigate = useNavigate()

    const [eye, setEye] = useState(false)

    const {user, setUser} = useContext(CustomContext)

    
    const registerUser = (e) => {
      e.preventDefault()
    

      let newUser = {
        email,
        password: e.target[0].value
      }
      axios.post('http://localhost:8081/api/v1/register' , newUser)
      .then(({data})=>{
        setUser({
          token: data.accessToken,
          ...data.user
          
        }) 

        localStorage.setItem('user',JSON.stringify({
          token: data.accessToken,
          ...data.user
          
        })) 
        console.log(newUser)
        navigate('/login')
      })
      .catch((err) => console.log(err.message))

      
    }

  return (
    <div className="content">
      <form action="" className="form" onSubmit={registerUser}>
    
    {
      status && <p onClick={() => setStatus(false)} className="form__email">{email}<FaPencilAlt/></p> 
          }

        <h2 className="form__title">
          {
            status ? 'Придумайте пароль для входа' : 'Регистрация'
          }
          
          
          </h2>

          {
            status && <>
           
            <div className="form__password">

              <input className="form__field" placeholder="Введите пароль" type={eye ? 'text' : 'password' } />
              <span onClick={() =>setEye(prev=>!prev)} className="form__eye">
                {
                  eye ? <AiFillEye/> : <AiFillEyeInvisible/>
                }
                
              </span>
            </div>
            
            <button className="form__btn" type="submit">Создать аккаунт</button>
           
           </> 
          } 

          {
            !status &&
            <>
            <input value = {email} onChange={(e) => setEmail(e.target.value)} className="form__field" placeholder="Введите email" type="text" />
            <div  onClick={() => setStatus(true)} className="form__btn"> Продолжить</div>
            <Link to={"/login"} className="link__to">У меня есть аккаунт</Link>
            </>
           
          }

       
      </form>
    </div>
  );
}

export default Form;
