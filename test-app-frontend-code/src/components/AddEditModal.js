import axios from 'axios';
import { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { base_url } from '../contants';



function AddEditModal(props) {
    const [name, setName] = useState('')
    const [role, setRole] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [addressLine1, setAddressLine1] = useState('')
    const [addressLine2, setAddressLine2] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [country, setCountry] = useState('')
    const [allAddress, setAllAddress] = useState([])


    useEffect(() => {

        if (props?.edit) {
            getSingleUser(props?.selectedItem?.id)
        }
    }, [])

    const getSingleUser = async (id) => {
        try {
            const resp = await axios({
                method: 'GET',
                url: `${base_url}/api/users/getSingleUser/${id}`,
                headers: { 'Content-Type': 'application/json' },
            })
            if (resp.data.status == 200) {

                setName(resp.data.response.name)
                setRole(resp.data.response.role)
                setPhone(resp.data.response.phone_number)
                setEmail(resp.data.response.email)
                setAllAddress(resp.data.response.addresses)
            }
        } catch (e) { console.log(e); }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (props?.edit) {
            const data = {
                name: name,
                role: role,
                email: email,
                phone_number: phone,
                addresses: allAddress
            }
            const resp = await axios({
                method: 'put',
                url: `${base_url}/api/users/updateUser/${props?.selectedItem?.id}`,
                body: data,
                headers: {
                    "Content-Type": "application/json",
                    authorization: 'Bearer ' + localStorage.getItem('auth_token')
                },
            })
            if (resp.data.status == 200) {
                console.log('updated')
            }
        }

        else {
            const data = {
                name,
                role,
                email,
                phone_number: phone,
                addresses: allAddress
            }
            const resp = await axios({
                method: 'POST',
                url: `${base_url}/api/users/addUser`,
                headers: {
                    "Content-Type": "application/json",
                    "authorization": 'Bearer ' + localStorage.getItem('auth_token')
                },
                body: data
            })
            if (resp.data.status == 201) {
                alert("User added successfully")
                handleReset()
                props.handleClose();

            }

        }
    }

    const handleAddAddress = () => {
        if (!addressLine1) {
            alert('Please fill all the address fields')
            return
        }
        else if (!city) {
            alert('Please fill all the address fields')
            return

        }
        else if (!state) {
            alert('Please fill all the address fields')
            return

        }
        else if (!country) {
            alert('Please fill all the address fields')
            return
        }
        else {
            const obj = {
                addressLine1,
                addressLine2,
                city,
                country,
                state
            }
            setAllAddress(address => [...address, obj])
            handleReset()
        }
    }
    const editAddress = (ind) => {
        const address = allAddress[ind]
        setAddressLine1(address.addressLine1)
        setAddressLine2(address.addressLine2)
        setState(address.state)
        setCity(address.city)
        setCountry(address.country)

        setAllAddress(s => s.filter((item, index) => ind != index))
    }
    const handleReset = () => {
        setAddressLine1('')
        setAddressLine2('')
        setState('')
        setCity('')
        setCountry('')
    }

    return (
        <>
            <Modal centered show={props?.showModal} onHide={(e) => {
                console.log(e)
                props?.handleClose()
            }} size='lg'>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{props?.edit ? "Edit User" : 'Add User'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={name}
                                        placeholder="Enter name here"
                                        name="name"
                                        onChange={e => setName(e.target.value)}
                                        autoFocus
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        placeholder="Enter email here"
                                        name="email"
                                        onChange={e => setEmail(e.target.value)}
                                        autoFocus
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>User Role</Form.Label>
                                    <Form.Select aria-label="Default select example" value={role} name="role"
                                        onChange={e => setRole(e.target.value)}>
                                        <option value="" hidden>Select role here</option>
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Phone number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={phone}
                                        placeholder="Enter phone number here"
                                        name='phone_number'
                                        autoFocus
                                        onChange={e => setPhone(e.target.value)}
                                    />

                                </Form.Group>
                            </Col>
                        </Row>
                        <Modal.Header closeButton>
                            <Modal.Title>{'Address'}</Modal.Title>
                        </Modal.Header>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Address Line 1</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={addressLine1}
                                        placeholder="Enter address here"
                                        name='addressLine1'
                                        autoFocus
                                        onChange={e => setAddressLine1(e.target.value)}
                                    />

                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Address Line 2</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={addressLine2}
                                        placeholder="Enter address here"
                                        name='addresLine2'
                                        autoFocus
                                        onChange={e => setAddressLine2(e.target.value)}
                                    />

                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={city}
                                        placeholder="Enter city here"
                                        name='city'
                                        autoFocus
                                        onChange={e => setCity(e.target.value)}
                                    />

                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={state}
                                        placeholder="Enter state here"
                                        name='state'
                                        autoFocus
                                        onChange={e => setState(e.target.value)}
                                    />

                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={country}
                                        placeholder="Enter country name here"
                                        name='country'
                                        autoFocus
                                        onChange={e => setCountry(e.target.value)}
                                    />

                                </Form.Group>
                            </Col>


                            <Col md={6}>
                                <div className='bg-light border rounded w-100 h-100 overflow-scroll  '>
                                    <div className='d-flex flex-wrap gap-2 p-2'>
                                        {
                                            allAddress?.map((address, ind) => (
                                                <div key={ind} className='px-3 py-2  rounded bg-secondary text-white' onClick={() => editAddress(ind)}>address-{ind + 1}</div>))
                                        }
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3} onClick={handleAddAddress}><Button>Add Address</Button></Col>
                        </Row>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => props?.handleClose()}>
                            Close
                        </Button>
                        <Button type="submit" variant="primary">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal >
        </>
    );
}

export default AddEditModal;