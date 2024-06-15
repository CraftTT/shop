import React, { Component } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export class Order extends Component {
  render() {
    return (
      <div className='item'>
        <img src={this.props.item.image} alt={this.props.item.title} />
        <h2>{this.props.item.title}</h2>
        <p>{this.props.item.price}$</p>
        <p>Количество: {this.props.item.count}</p>
        <FaTrash className='delete-icon' onClick={() => this.props.onDelete(this.props.item.id)} />
      </div>
    );
  }
}

export default Order;
