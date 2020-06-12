import React, { Component } from "react";

import {
  Button, TableRow, Paper, TextField, Grid, Form,Container
} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './NewCustomer.css'
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import SendIcon from '@material-ui/icons/Send';
import CustomMessage from '../CustomMessage/CustomMessage';


import { appConfig } from '../../configs/app.config';
const { baseUrl } = appConfig;


export default class NewCustomer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uid: '',
      name: '',
      email: '',
      contact_number: '',
      address: '',
      show: false,
      errors:{
        uid:[],
        name:[],
        email:[],
        contact_number:[],
        address:[],
        show:[],
      }
    }
    this.submitCustomer = this.submitCustomer.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

  };

  handleInputChange(event) {
    const { value, name } = event.target;
    console.log('value', value);
    console.log('name', name);
    this.setState({ [name]: value });


  }

  resetState() {
    this.setState({
      id:'', uid: '', name: '', email: '', contact_number: '', address: ''
    })
  }

  componentDidMount(){
    const customerId = +this.props.match.params.id;

    if(customerId){
       this.findCustomerById(customerId);
    }
  }

  findCustomerById = (customerId) => {
    axios.get(`${baseUrl}/customer/list/`+customerId)
        .then(response => {
            if(response.data != null) {
                console.log('response',response);
                this.setState({
                    id: response.data.id,
                    uid: response.data.cus_unique_id,
                    name: response.data.customer_name,
                    email: response.data.email,
                    address: response.data.address,
                    contact_number: response.data.contact_number,
                });
            }
        }).catch((error) => {
            console.error("Error - "+error);
        });
  };

  updateCustomer = event => {
    event.preventDefault();

    const customer = {
        id: this.state.id,
        cus_unique_id: this.state.uid,
        customer_name: this.state.name,
        email: this.state.email,
        contact_number: this.state.contact_number,
        address: this.state.address
    };

    axios.put(`${baseUrl}/customer/add/` ,customer)
      .then(response => { 
        if (response.data != null) {
            this.setState({"show":true, "method":"put"});
        }
        else {
            this.setState({"show":false});
        }
      });
    this.setState(this.initialState);
  };

  submitCustomer = event => {
    event.preventDefault();

    const customer = {
      cus_unique_id: this.state.uid,
      customer_name: this.state.name,
      email: this.state.email,
      contact_number: this.state.contact_number,
      address: this.state.address
    };
    axios.post(`${baseUrl}/customer/add`, customer)
      .then(response => {
        if (response.data != null) {
          console.log(customer);
        }
        else {
          this.setState({ "show": false });
        }
      })
      .catch(error => {
        console.log(error)
      });
  };


  render() {
    
    return (
      <div>
        <div style={{"display":this.state.show ? "block" : "none"}}>
            <CustomMessage show ={ this.state.show } message= {this.state.method === "put" ? "Customer Updated Successfully." : "Customer Saved Successfully."} severity= {"success"}/>
        </div>
        <Container maxWidth="sm" style={{float:"left"}}>
        <form onSubmit={this.state.id ? this.updateCustomer : this.submitCustomer } >
          <TextField
            name="uid"
            value={this.state.uid}
            id="outlined-full-width"
            label="Customer ID"
            style={{ margin: 2 }}
            placeholder="Enter Customer ID"
            helperText="This field is required!"
            fullWidth
            onChange={this.handleInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
          <TextField
            name="name"
            value={this.state.name}
            onChange={this.handleInputChange}
            id="outlined-full-width"
            label="Customer Name"
            style={{ margin: 2 }}
            placeholder="Enter Customer Name"
            helperText="This field is required!"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
          <TextField
            name="email"
            value={this.state.email}
            onChange={this.handleInputChange}
            id="outlined-full-width"
            label="Email"
            style={{ margin: 2 }}
            placeholder="Enter Customer Email"
            helperText="This field is required!"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />
          <TextField
            name="contact_number"
            value={this.state.contact_number}
            onChange={this.handleInputChange}
            id="outlined-full-width"
            label="Contact Number"
            type="number"
            style={{ margin: 2 }}
            placeholder="Enter Customer Contact Number"
            helperText="This field is required!"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
          />

          <TextField
            name="address"
            value={this.state.address}
            onChange={this.handleInputChange}
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            fullWidth
            rows={4}
            placeholder="Enter Customer Address"
            helperText="This field is required"
            variant="outlined"
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            startIcon={<SendIcon />}
          >
            {this.state.id ? "Update" : "Save"}
                    </Button>
          {" "}
          <Button
            type="reset"
            variant="contained"
            color="primary"
            endIcon={<RotateLeftIcon />}
          >
            Reset</Button>
        </form>
       </Container>     
      </div>
    )
  }
}
