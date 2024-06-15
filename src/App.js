import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Items from "./components/Items";
import Checkorder from "./components/Checkorder";
import Form from "./components/Form";
import OrderForm from "./components/OrderForm";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import axios from "axios";


axios.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      items: [],
      loading: true,
      currentPage: 1,
      totalPages: 6, 
    };

    this.addToOrder = this.addToOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.increaseCount = this.increaseCount.bind(this);
    this.calculateTotal = this.calculateTotal.bind(this);
    this.changePage = this.changePage.bind(this);
    this.fetchOrders = this.fetchOrders.bind(this);
  }

  componentDidMount() {
    this.fetchItems(this.state.currentPage);
    this.fetchOrders();
  }

  fetchItems(page) {
    axios.get(`http://localhost:8081/api/v1/products/page/${page}`)
      .then(response => {
        this.setState({ items: response.data, loading: false });
      })
      .catch(error => {
        console.error("There was an error fetching the items!", error);
      });
  }

  fetchOrders() {
    axios.get('http://localhost:8081/api/v1/carts')
      .then(response => {
        this.setState({ orders: response.data, loading: false });
      })
      .catch(error => {
        console.error("There was an error fetching the cart items!", error);
      });
  }

  deleteOrder(id) {
    const itemToDelete = this.state.orders.find((el) => el.id === id);

    const data = {
      cartProductId: itemToDelete.id,
      count: 1
    };

    axios({
      method: 'delete',
      url: 'http://localhost:8081/api/v1/carts',
      data: data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('user')}`
      }
    })
      .then(res => {
        this.setState(prevState => ({
          orders: prevState.orders.filter((el) => el.id !== id)
        }), this.fetchOrders);
      })
      .catch(error => {
        console.error("There was an error deleting the item from the cart!", error);
      });
  }

  addToOrder(item) {
    const data = {
      productId: item.id,
      count: 1
    };

    axios({
      method: 'post',
      url: 'http://localhost:8081/api/v1/carts',
      data: data,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('user')}`
      }
    })
    .then(response => {
      this.setState(prevState => {
        const existingOrder = prevState.orders.find(order => order.id === item.id);
        if (existingOrder) {
          return {
            orders: prevState.orders.map(order =>
              order.id === item.id ? { ...order, count: order.count + 1 } : order
            )
          };
        } else {
          return {
            orders: [...prevState.orders, { ...item, count: 1 }]
          };
        }
      }, this.fetchOrders);
    })
    .catch(error => {
      console.error("There was an error adding the item to the cart!", error);
    });
  }

  increaseCount(id) {
    this.setState(prevState => ({
      orders: prevState.orders.map(item =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      )
    }), this.fetchOrders);
  }

  calculateTotal() {
    const total = this.state.orders.reduce((total, item) => {
      return total + (item.price * item.count);
    }, 0);
    return total.toFixed(2); 
  }

  changePage(page) {
    this.setState({ currentPage: page, loading: true });
    this.fetchItems(page);
  }

  render() {
    return (
      <div className="wrapper">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                orders={this.state.orders}
                items={this.state.items}
                onDelete={this.deleteOrder}
                onAdd={this.addToOrder}
                onIncreaseCount={this.increaseCount}
                total={this.calculateTotal()}
                currentPage={this.state.currentPage}
                totalPages={this.state.totalPages}
                onChangePage={this.changePage}
                fetchOrders={this.fetchOrders}
              />
            }
          />
          <Route path="form" element={<Form />} />
          <Route path="login" element={<Login />} />
          <Route path="checkorder" element={<Checkorder />} />
          <Route path="orderform" element={<OrderForm fetchOrders={this.fetchOrders}/>} />
        </Routes>
      </div>
    );
  }
}

const Home = ({ orders, items, onDelete, onAdd, onIncreaseCount, total, currentPage, totalPages, onChangePage, fetchOrders }) => {
  return (
    <>
      <Header orders={orders} onDelete={onDelete} onIncreaseCount={onIncreaseCount} total={total} fetchOrders={fetchOrders} />
      <Items items={items} onAdd={onAdd} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onChangePage={onChangePage} />
      <Footer />
    </>
  );
};

const Pagination = ({ currentPage, totalPages, onChangePage }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      {pages.map(page => (
        <span
          key={page}
          className={`page-number ${page === currentPage ? 'active' : ''}`}
          onClick={() => onChangePage(page)}
        >
          {page}
        </span>
      ))}
    </div>
  );
};

export default App;
