import React, { Component } from 'react';
import {Link, NavLink} from 'react-router-dom';
import axios from "axios";

class SignUpForm extends Component {
    constructor() {
        super();

        this.state = {
            password: '',
            username: '',
            hasAgreed: false,


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

        console.log('The form wasww submitted with the following data:');
        console.log(this.state);

        axios.post('http://localhost:8080/user/', this.state).then((response) => {

            console.log(response);
            console.log(response.data);
            localStorage.setItem('user_id', response.data.id);

            this.props.history.push("/path");
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
                <form onSubmit={this.handleSubmit} className="FormFields">
                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="name">Full Name</label>
                        <input type="text" id="name" className="FormField__Input" placeholder="Enter your full name" name="username" value={this.state.username} onChange={this.handleChange} />
                    </div>
                    <div className="FormField">
                        <label className="FormField__Label" htmlFor="password">Password</label>
                        <input type="password" id="password" className="FormField__Input" placeholder="Enter your password" name="password" value={this.state.password} onChange={this.handleChange} />
                    </div>


                    <div className="FormField">
                        <label className="FormField__CheckboxLabel">
                            <input className="FormField__Checkbox" type="checkbox" name="hasAgreed" value={this.state.hasAgreed} onChange={this.handleChange} /> I agree all statements in <a href="google.com" className="FormField__TermsLink">terms of service</a>
                        </label>
                    </div>

                    <div className="FormField">
                        <button className="FormField__Button mr-20">Sign Up</button> <Link to="/sign-in" className="FormField__Link">I'm already member</Link>
                    </div>
                </form>
            </div>
        );
    }
}

export default SignUpForm;
