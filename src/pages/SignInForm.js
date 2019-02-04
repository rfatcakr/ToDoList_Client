import React, { Component } from 'react';
import {  Link,NavLink} from 'react-router-dom';
import axios from "axios";


class SignInForm extends Component {

    constructor() {
        super();

        this.state = {
            books: [],
            email: '',
            password: '',
            id: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        let target = e.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;

        this.setState({
          [name]: value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log('The form wasr submitted with the following data:');
        console.log("->"+this.state+this.state.email);

        let  username = this.state.email;
        let password = this.state.password;
        let id=this.state.id;

        axios.get('http://localhost:8080/user/' + username, {
           id,username, password
        }).then((response) => {
            //qeuery and sent
            //veriyfy same type
            let pass1 =password+'';
            let pass2 =response.data.password+'';
            if(pass1 === pass2){
                localStorage.setItem('user_id', response.data.id);

                this.props.history.push("/path");
            }

        });
    }


    render() {
        return (

        <div className="FormCenter">
            <div className="PageSwitcher">
                <NavLink to="/sign-in" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign In</NavLink>
                <NavLink exact to="/" activeClassName="PageSwitcher__Item--Active" className="PageSwitcher__Item">Sign Up</NavLink>
            </div>
            <div className="FormTitle">
                <NavLink to="/sign-in" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign In</NavLink> or <NavLink exact to="/" activeClassName="FormTitle__Link--Active" className="FormTitle__Link">Sign Up</NavLink>
            </div>
            <form onSubmit={this.handleSubmit} className="FormFields" >
            <div className="FormField">
                <label className="FormField__Label" htmlFor="email">E-Mail Address</label>
                <input type="text" id="email" className="FormField__Input" placeholder="Enter your email" name="email" value={this.state.email} onChange={this.handleChange} />
              </div>

              <div className="FormField">
                <label className="FormField__Label" htmlFor="password">Password</label>
                <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} />
              </div>

              <div className="FormField">
                  <button className="FormField__Button mr-20">Sign In</button> <Link to="/" className="FormField__Link">Create an account</Link>
              </div>
            </form>
          </div>
        );
    }
}

export default SignInForm;
