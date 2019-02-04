import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Table, Button, Modal, ModalHeader, ModalBody,ModalFooter, Label, Input, FormGroup,DropdownMenu,DropdownItem,Dropdown,DropdownToggle } from 'reactstrap';



class Home extends Component {
    constructor() {
        super();
        this.toggle = this.toggle.bind(this);

        this.state = {
            itemlistid:'-1',
            dropdownOpen: false,
            filterstatus:'-1',
            filterword:'',
            email: '',
            password: '',
            name: '',
            hasAgreed: false,
            books: [],
            items:[],
            newItemData:{
                name:'',
                description:'',
                status:'',
                connected:'',
                createdDate:'',
                deadline:'',
                todo_item:'',
                todolist_id:'-1',
            },
            newBookData:{
                name:'',
                user_id:''
            },
            editBookData: {
                id:'',
                name:'',
            },
            editItemData:{
                name:'',
                description:'',
                status:'',
                createdDate:'',
                deadline:'',
                todo_item:'',
                todolist_id:'-1',
                connected:'',
            },
            showItemsData:{
                id:'',
                todo_item:'',
                name:'',
                description:'',
                status:'',
                createdDate:'',
                deadline:'',
            },
            addItemsData:{
                id:'',
            },
            newBookModal: false,
            editBookModal: false,
            showItemsModal: false,
            addItemsModal: false,
            editItemsModal: false,


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


    }
    toggleNewBookModal(){
        this.setState({
            newBookModal: !this.state.newBookModal,
        });
    }

    logout(){
        localStorage.setItem('user_id',"-1");
        this.props.history.push("/");
    }
    toggleEditBookModal() {
        this.setState({
            editBookModal: ! this.state.editBookModal
        });
    }
    toggleEditItemsModal(){
        this.setState({
            editItemsModal: !this.state.editItemsModal
        })
    }



    toggleItemsModal(){

        this.setState({
            showItemsModal: ! this.state.showItemsModal
        });
    }

    toggleAddItemModal(){
        this.setState({
            addItemsModal: !this.state.addItemsModal,
        });
    }

    editBook(id, name) {
        this.setState({
            editBookData: { id, name}, editBookModal: ! this.state.editBookModal
        });

    }
    editItem(todoitems){

        let id=todoitems.id;
        let name=todoitems.name;
        let description =todoitems.description;
        let status=todoitems.status;
        let createdDate=todoitems.createdDate;
        let deadline=todoitems.deadline;
        let todo_item=todoitems.todo_item;
        let todolist_id=todoitems.todolist_id;
        let connected = todoitems.connected;
        this.setState({
            editItemData: {id,name,description,status,createdDate,deadline,todo_item,todolist_id,connected }, editItemsModal: ! this.state.editItemsModal
        });
    }
    showItems(id, name) {
        //clear filter

        axios.get('http://localhost:8080/todoitem/' +  id).then((response) => {

            this.setState({
                items: response.data,
                filterword: '',
                filterstatus: '-1',
                itemlistid:id,
            });
        });

        this.setState({
            showItemsData: { id, name}, showItemsModal: ! this.state.showItemsModal
        });
    }
    updateBook() {
        let { name } = this.state.editBookData;

        axios.put('http://localhost:8080/todolist/list/' + this.state.editBookData.id, {
            name
        }).then((response) => {
            this._refreshBooks();

            this.setState({
                editBookModal: false, editBookData: { name: ''}
            })
        });
    }
    updateItem(){
        let { createdDate } = this.state.editItemData;
        let { deadline} = this.state.editItemData;
        let { description } = this.state.editItemData;
        let { name } = this.state.editItemData;
        let { todolist_id } = this.state.editItemData;
        let { connected } = this.state.editItemData;

        axios.put('http://localhost:8080/todoitem/' + this.state.editItemData.id, {
            name,createdDate,deadline,description,todolist_id,connected
        }).then((response) => {
            //this._refreshBooks();
            this.showItems(this.state.editItemData.id,"");
            this.setState({
                editItemsModal: false,
                editItemData: {
                    name:'',
                    description:'',
                    createdDate:'',
                    deadline:'',
                    todolist_id:'',
                    status:'',
                    connected:''
                }
            })
        });
    }

    completeItem(){
        let { createdDate } = this.state.editItemData;
        let { deadline} = this.state.editItemData;
        let { description } = this.state.editItemData;
        let { name } = this.state.editItemData;
        let { todolist_id } = this.state.editItemData;
        let { connected } = this.state.editItemData;
        let  status = 1;
        axios.put('http://localhost:8080/todoitem/' + this.state.editItemData.id, {
            status,name,createdDate,deadline,description,todolist_id,connected
        }).then((response) => {
            //this._refreshBooks();
            this.showItems(this.state.editItemData.id,"");
            this.setState({
                editItemsModal: false,
                editItemData: {
                    name:'',
                    description:'',
                    createdDate:'',
                    deadline:'',
                    todolist_id:'',
                    connected:'',
                    status:'',
                }
            })
        });

    }

    deleteBook(id) {
        axios.delete('http://localhost:8080/todolist/list/' + id).then((response) => {
            this._refreshBooks();
        })

        //delete all related items
        axios.delete('http://localhost:8080/todoitem/list/' + id).then((response) => {
            //this._refreshBooks();

        })
    }

    deleteItem() {
        axios.delete('http://localhost:8080/todoitem/item/' + this.state.editItemData.id).then((response) => {
            //this._refreshBooks();
            this.setState({editItemsModal: false,showItemsModal: false,
            });
        });
    }

    componentWillMount(){
        let user=localStorage.getItem('user_id');
        axios.get('http://localhost:8080/todolist/user/' +  user).then((response) => {

            this.setState({
                books: response.data
            })
        });
    }



    _refreshBooks() {
        let user=localStorage.getItem('user_id');

        axios.get('http://localhost:8080/todolist/user/' +  user).then((response) => {

            this.setState({
                books: response.data
            })
        });
    }

    _refreshItems(){

    }
    addStudent(){
        axios.post('http://localhost:8080/todolist/', this.state.newBookData).then((response) => {
            let { books } = this.state;

            books.push(response.data);

            this.setState({ books, newBookModal: false, newBookData: {
                    user_id: '',
                    name: ''
                }});
        });
    }
    addItem(){

        axios.post('http://localhost:8080/todoitem/', this.state.newItemData).then((response) => {
            let { items } = this.state;

            items.push(response.data);
            this.setState({items,addItemsModal:false,
                newItemData:{
                    name:'',
                    description:'',
                    status:'',
                    connected:'',
                    createdDate:'',
                    deadline:'',
                    todo_item:'',
                    todolist_id:'-1',
                }
            });
        });
        //refresh Items
        this.showItems(this.state.itemlistid);

    }
    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }
    setfilter(e){
        this.setState({

            filterstatus: e.target.value,
        })
    }

    render() {

        let books = this.state.books.map((todolists) => {
            return (
                <tr key={todolists.id}>
                    <td>{todolists.id} </td>

                    <td>{todolists.name}</td>
                    <td>
                        <Button color="success" size="sm" className="mr-2" onClick={this.showItems.bind(this, todolists.id, todolists.name)}>Show Items</Button>

                        <Button color="success" size="sm" className="mr-2" onClick={this.editBook.bind(this, todolists.id, todolists.name)}>Edit</Button>
                        <Button color="danger" size="sm" onClick={this.deleteBook.bind(this, todolists.id)}>Delete</Button>

                    </td>
                </tr>

            )
        });


        let items = this.state.items.map((todoitems) => {
            let deadDate = moment(todoitems.deadline, 'MM.DD.YYYY');
            let createDate =  moment().format('MM.DD.YYYY');
            if( ((this.state.filterword==="" && this.state.filterstatus!=="3") || this.state.filterstatus==="-1" ) ||
                (this.state.filterstatus==="1" && todoitems.name.toLowerCase()===this.state.filterword.toLowerCase()) ||
                (this.state.filterstatus==="2" && (todoitems.status === ((this.state.filterword.toLowerCase()==="active")?false : true))) ||
                (this.state.filterstatus==="3" && ((moment.duration(deadDate.diff(createDate)).asDays())<0))

            ){

            return (
                <tr key={todoitems.id}>
                    <td>{todoitems.id}</td>
                    <td>{todoitems.name}</td>
                    <td>{todoitems.description}</td>
                    <td>{todoitems.createdDate} </td>
                    <td>{todoitems.deadline} </td>
                    <td>{todoitems.connected} </td>
                    <td>{(todoitems.status===true)? "Closed":"Active"}</td>
                    <td><Button color="info" onClick={this.editItem.bind(this,todoitems)}>Open</Button></td>



                </tr>


                    )}
        });
        return (
        <div className="FormCenter">

            <h1>ToDoLists</h1><span><Button className="logout" onClick={this.logout.bind(this)}>Log out</Button></span>

            <Button className="my-3" color="primary" onClick={this.toggleNewBookModal.bind(this)}>Add a ToDoList</Button>

            <Modal isOpen={this.state.newBookModal} toggle={this.toggleNewBookModal.bind(this)}>
                <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Add a ToDoList</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input id="name" value={this.state.newBookData.name} onChange={(e) => {
                            let { newBookData } = this.state;

                            newBookData.name = e.target.value;
                            newBookData.user_id=localStorage.getItem('user_id');
                            this.setState({ newBookData });
                        }} />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>

                    <Button color="primary" onClick={this.addStudent.bind(this)}>Save</Button>{' '}
                    <Button color="secondary" onClick={this.toggleNewBookModal.bind(this)}>Cancel</Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={this.state.editBookModal} toggle={this.toggleEditBookModal.bind(this)}>
                <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Edit ToDoList</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input id="name" value={this.state.editBookData.name} onChange={(e) => {
                            let { editBookData } = this.state;

                            editBookData.name = e.target.value;

                            this.setState({ editBookData });
                        }} />
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.updateBook.bind(this)}>Update list name</Button>{' '}
                    <Button color="secondary" onClick={this.toggleEditBookModal.bind(this)}>Cancel</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.showItemsModal} toggle={this.toggleItemsModal.bind(this)}  size="lg">
                <ModalHeader toggle={this.toggleItemsModal.bind(this)}>Show ToDoList Items</ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <table>
                            <thead>
                            <tr>
                                <th> Filter </th>
                                <th>
                                    <FormGroup tag="fieldset" onChange={this.setfilter.bind(this)}>

                                        <FormGroup check>
                                            <Label check>
                                                <Input type="radio"  value="1" name="radio1" />{' '}
                                                Name
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check>
                                            <Label check>
                                                <Input type="radio" value="2"  name="radio1" />{' '}
                                               Status
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check disabled>
                                            <Label check>
                                                <Input type="radio" value="3"  name="radio1"  />{' '}
                                                Expired
                                            </Label>
                                        </FormGroup>
                                        <FormGroup check disabled>
                                            <Label check>
                                                <Input type="radio" value="-1"  name="radio1"  />{' '}
                                                No filter
                                            </Label>
                                        </FormGroup>
                                    </FormGroup>
                                </th>
                                <th><Input id="name" value={this.state.filterword} onChange={(e) => {
                                    let { filterword } = this.state;

                                    filterword = e.target.value;

                                    this.setState({ filterword });
                                }} />
                                </th>

                                <th>  </th>
                                <th>{"    "}</th>
                                <th> Order By:</th>
                                <th>

                                    <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                        <DropdownToggle caret>
                                            ID
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem header>Options</DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem>Name</DropdownItem>
                                            <DropdownItem>Created Date</DropdownItem>
                                            <DropdownItem>Deadline</DropdownItem>
                                            <DropdownItem>Status</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>


                                </th>



                            </tr>

                            </thead>
                        </table>


                        <Table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Created Date </th>
                                <th>DeadLine </th>
                                <th>Connected Item</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                            </thead>
                        <tbody>
                        {items}
                        </tbody>
                        </Table>
                    </FormGroup>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.toggleAddItemModal.bind(this)}>Add Item</Button>{' '}
                    <Button color="secondary" onClick={this.toggleItemsModal.bind(this)}>Cancel</Button>
                </ModalFooter>
            </Modal>


            <Modal isOpen={this.state.addItemsModal} toggle={this.toggleAddItemModal.bind(this)}>
                <ModalHeader toggle={this.toggleAddItemModal.bind(this)}>Add a new Item</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input id="name" value={this.state.newItemData.name} onChange={(e) => {
                            let { newItemData } = this.state;

                            newItemData.name = e.target.value;
                            newItemData.todolist_id = this.state.itemlistid;
                            newItemData.status=false;
                            this.setState({ newItemData });
                        }} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>

                        <Input id="description" value={this.state.newItemData.description} onChange={(e) => {
                            let { newItemData } = this.state;

                            newItemData.description = e.target.value;

                            this.setState({ newItemData });
                        }} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="createdDate">CreatedDate (MM.DD.YYYY)</Label>
                        <Input id="createdDate" value={this.state.newItemData.createdDate} onChange={(e) => {
                            let { newItemData } = this.state;

                            newItemData.createdDate = e.target.value;


                            this.setState({ newItemData });
                        }} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="deadline">Deadline (MM.DD.YYYY)</Label>
                        <Input id="createdDate" value={this.state.newItemData.deadline} onChange={(e) => {
                            let { newItemData } = this.state;

                            newItemData.deadline = e.target.value;


                            this.setState({ newItemData });
                        }} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="connected">Connected Item</Label>
                        <Input id="connected" value={this.state.newItemData.connected} onChange={(e) => {
                            let { newItemData } = this.state;

                            newItemData.connected = e.target.value;


                            this.setState({ newItemData });
                        }} />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.addItem.bind(this)}>Save</Button>{' '}
                    <Button color="secondary" onClick={this.toggleAddItemModal.bind(this)}>Cancel</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.editItemsModal} toggle={this.toggleEditItemsModal.bind(this)}>
                <ModalHeader toggle={this.toggleEditItemsModal.bind(this)}>Edit Item</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input id="name" value={this.state.editItemData.name|| ''} onChange={(e) => {
                            let { editItemData } = this.state;

                            editItemData.name = e.target.value;

                            this.setState({ editItemData });
                        }} />
                    </FormGroup>

                    <FormGroup>
                        <Label for="description">Description</Label>

                        <Input id="description" value={this.state.editItemData.description|| ''} onChange={(e) => {
                            let { editItemData } = this.state;

                            editItemData.description = e.target.value;

                            this.setState({ editItemData });
                        }} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="createdDate">CreatedDate (MM.DD.YYYY)</Label>
                        <Input id="createdDate" value={this.state.editItemData.createdDate|| ''} onChange={(e) => {
                            let { editItemData } = this.state;

                            editItemData.createdDate = e.target.value;


                            this.setState({ editItemData });
                        }} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="deadline">Deadline (MM.DD.YYYY)</Label>
                        <Input id="createdDate" value={this.state.editItemData.deadline|| ''} onChange={(e) => {
                            let { editItemData } = this.state;

                            editItemData.deadline = e.target.value;


                            this.setState({ editItemData });
                        }} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="connected">Connected Item</Label>
                        <Input id="connected" value={this.state.editItemData.connected || ''} onChange={(e) => {
                            let { editItemData } = this.state;

                            editItemData.connected = e.target.value;


                            this.setState({ editItemData });
                        }} />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary"  size="sm" onClick={this.updateItem.bind(this)}>Update</Button>{' '}

                    <Button color="primary"  size="sm" onClick={this.completeItem.bind(this)}>Complete</Button>{' '}
                    <Button color="danger" size="sm" onClick={this.deleteItem.bind(this)}>Delete</Button>

                    <Button color="secondary"  size="sm" onClick={this.toggleEditItemsModal.bind(this)}>Cancel</Button>
                </ModalFooter>
            </Modal>
















            <Table>
                <thead>
                <tr>
                    <th>id</th>
                    <th>To Do lists</th>

                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {books}
                </tbody>

            </Table>


          </div>
        );
    }
}

export default Home;
