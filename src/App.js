import React from 'react';
import logo from './logo.svg';
import './App.css';

require('es6-promise').polyfill();
require('isomorphic-fetch');

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articulos: [],
      value:'',
      id:'',
      nombre:'',
      referencia:'',
      precio:'',
      peso:'',
      categoria:'',
      stock:''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateProduct = this.updateProduct.bind(this);
  }

  componentWillMount() {
    this.get_products()
  }

  get_products(){
     fetch('http://localhost:3001/productos')
      .then((response) => {
        return response.json()
      })
      .then((art) => {
        this.setState({ articulos: art })
      })  
  }


  // Captura de Datos
  handleChange(event, typeInput) {
    // console.log(`${event.target.value}, ${typeInput}`)
    this.setState({ ...this.state.data, [typeInput]: event.target.value })
  }

  // Captura de evento del formulario
  handleSubmit(event) {
    
    // Armamos la fecha con el formato deseado
    let n =  new Date();
    //Año
    let y = n.getFullYear();
    //Mes
    let m = n.getMonth() + 1;
    //Día
    let d = n.getDate();
    let fecha = y + "-" + m + "-" + d    

    event.preventDefault();


    let data = {
      "id": this.state.id,
      "nombre": this.state.nombre,
      "referencia": this.state.referencia,
      "precio": this.state.precio,
      "peso": this.state.peso,
      "categoria": this.state.categoria,
      "stock": this.state.stock,
      "fecha_creacion": fecha
    }

   fetch('http://localhost:3001/productos', {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => alert("Error al registrar"))
    .then(response => alert("Producto registrado"));

    event.preventDefault();
  }

  // Para editar
  editar(a){

    fetch('http://localhost:3001/productos/'+a)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        this.setState({ 
          ...this.state.id, id:data.id,
          ...this.state.nombre, nombre:data.nombre,
          ...this.state.referencia, referencia:data.referencia,
          ...this.state.precio, precio:data.precio,
          ...this.state.peso, peso:data.peso,
          ...this.state.categoria, categoria:data.categoria,
          ...this.state.stock, stock:data.stock
        })
      })  

  }

   // Para eliminar el producto
  eliminar(element){
    // alert(element)
    fetch('http://localhost:3001/productos/'+element, {
        method: 'DELETE', // or 'PUT'
      }).then(res => res.json())
      .catch(error => alert("Error al eliminar"))
      .then(response => alert("Producto eliminado"));

  }


  // FUNCIÓN QUE ACTUALIZA EL PRODUCTO
  updateProduct(event,id){
    let data = {
      "id": this.state.id,
      "nombre": this.state.nombre,
      "referencia": this.state.referencia,
      "precio": this.state.precio,
      "peso": this.state.peso,
      "categoria": this.state.categoria,
      "stock": this.state.stock,
    }

   fetch('http://localhost:3001/productos/'+id, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => alert("Error al actualizar"))
    .then(response => alert("Producto Actualizado"));

  }


  // FUNCIÓN QUE HACE LA COMPRA
  comprar(id){

    // Consultamos el stock de ese producto
    fetch('http://localhost:3001/productos/'+id)
      .then((response) => {
        return response.json()
      })
      .then((data) => {
        this.setState({ 
          ...this.state.stock, stock:data.stock
        })
      })

      alert(this.state.stock);

    if (this.state.stock==7) {
      alert("se puede comprar")
    }else{
      alert("no se puede comprar")
    }
  }

  render() {
    return (
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h2>Añadir producto</h2>
            <p>Los producto con * son obligatorios</p>
            <form onSubmit={this.handleSubmit}>
              <div class="row">
                <div class="col-md-6">
                  <label>ID *</label>
                  <input type="number" class="form-control" value={this.state.id} onChange={(event) => this.handleChange(event, 'id')}></input>
                </div>
                 <div class="col-md-6">
                  <label>NOMBRE *</label>
                  <input type="text" class="form-control" value={this.state.nombre} onChange={(event) => this.handleChange(event, 'nombre')} />
                </div>
                 <div class="col-md-6">
                  <label>REFERENCIA *</label>
                  <input type="text" class="form-control" value={this.state.referencia} onChange={(event) => this.handleChange(event, 'referencia')}></input>
                </div>
                 <div class="col-md-6">
                  <label>PRECIO *</label>
                  <input type="nymber" class="form-control" value={this.state.precio} onChange={(event) => this.handleChange(event, 'precio')}></input>
                </div>
                <div class="col-md-6">
                  <label>PESO *</label>
                  <input type="number" class="form-control" value={this.state.peso} onChange={(event) => this.handleChange(event, 'peso')}></input>
                </div>
                <div class="col-md-6">
                  <label>CATEGORÍA *</label>
                  <input type="text" class="form-control" value={this.state.categoria} onChange={(event) => this.handleChange(event, 'categoria')}></input>
                </div>
                <div class="col-md-12">
                  <label>STOCK</label>
                  <input type="number" class="form-control" value={this.state.stock} onChange={(event) => this.handleChange(event, 'stock')}></input>
                </div>
                <div class="col-md-12">
                  <label></label>
                  <button class="btn btn-success btn-block" type="submit">Guardar</button>
                </div>
              </div>
            </form>
            <label></label>
            <button class="btn btn-info btn-block" type="button" onClick={(event) => this.updateProduct(event,this.state.id)}>Editar Producto</button>
          </div>
           <div class="col-md-6">
            <h2>Lista de productos</h2>
            <table class="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Referencia</th>                    
                  <th>Precio</th>                  
                  <th>Peso</th>                 
                  <th>Categoría</th>                  
                  <th>Stock</th>               
                  <th>Creación</th>               
                  <th>Compra</th>             
                  <th>Editar</th>           
                  <th>Eliminar</th>           
                </tr>
              </thead>
              <tbody>  
                {this.state.articulos.map(art => {
                  return (
                    <tr key={art.id}>
                      <td>{art.id}</td>
                      <td>{art.nombre}</td>
                      <td>{art.referencia}</td>
                      <td>{art.precio}</td>
                      <td>{art.peso}</td>
                      <td>{art.categoria}</td>
                      <td>{art.stock}</td>
                      <td>{art.fecha_creacion}</td>
                      <td>{art.fecha_ultima_compra}</td>
                      <td><button class="btn btn-info" onClick={(event) => this.editar(art.id)}>Seleccionar</button></td>
                      <td><button class="btn btn-danger" onClick={(event) => this.eliminar(art.id)}>Eliminar</button></td>
                      <td><button class="btn btn-warning" onClick={(event) => this.comprar(art.id)}>Comprar</button></td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
          </div>
        </div>
      </div>
    );
  }
   
}

export default App;
