import React, { Component } from 'react';
import './App.css';
import {Container} from 'semantic-ui-react'
import axios from "axios"
import ItemForm from "./components/ItemForm"
import Item from "./components/Item"

export default class App extends Component {
  state = {
    items: [],
    loadItemError: false,
    errorStatusCode: null
  }

  addItem = (item) => {
    axios
    .post("api/items", {
      name: item.name,
      description: item.description,
      price: item.price,
      meal: item.meal,
      course: item.course,
      v: item.v,
      veg: item.veg,
      nuts: item.nuts,
      dairy: item.dairy,
      soy: item.soy,
      gluten: item.gluten
    }).then(res => {
      const newArray = [res.data, ...this.state.items];
      this.setState({
        items: newArray
      })
    }).catch(err => {
      console.log(err)
    })
  }

  updateItem = (itemForm, id) => {
    axios
    .put(`/api/items/${id}`, {
      name: itemForm.name,
      description: itemForm.description,
      price: itemForm.price,
      meal: itemForm.meal,
      course: itemForm.course,
      v: itemForm.v,
      veg: itemForm.veg,
      nuts: itemForm.nuts,
      dairy: itemForm.dairy,
      soy: itemForm.soy,
      gluten: itemForm.gluten
    }).then(res => {
      const newArray = this.state.items.map( update =>{
        if(update.id != id){
          return update
        } return {...update, ...itemForm};
      })
    this.setState({
      items: newArray
    })  
    }).catch(err => {
      console.log(err)
    })
  }

  deleteItem = (id) => {
    axios.delete(`/api/items/${id}`)
      .then (res => {
        const { items } = this.state;
        this.setState({ items: items.filter(i => i.id !== id )})
      })
  }

  renderItems() {
    if (this.state.loading){
      return "loading"
    }
    if (this.state.loadItemError) {
      return (
        <>
        <h2 style={{color: 'red' }}>error</h2>
        <h3>{this.state.errorStatusCode}</h3>
        <p> {this.state.toString()}</p>
        </>
      )
    }
    return this.state.items.map( item => {
      return (
        <Item key={`item-${item.id}`}{...item} id={item.id} deleteItem= {this.deleteItem} updateItem={this.updateItem} />
      );
    });
  }

  componentDidMount() {
    axios
    .get('api/items')
    .then(res => {
      this.setState({
        loading: false,
        items: res.data
      })
    }).catch(error => {
      this.setState({
        loadItemError: true,
        errorStatusCode: error.toString()
      })
    })
    
  }
  render () {
  return (
    <Container>
      <div>
        Allergys Info:
        <br />
        GF: Gluten Free
        <br />
        V: Vegan
        <br />
        VEG: Vegetarian
        <br />
        NF: Nut Free <br />
        DF: Dairy Free <br />
        SF: Soy Free
      </div>
      <div className="App">
        <ItemForm addItem={this.addItem} />
        {this.renderItems()}
      </div>
    </Container>
  );
  }
}