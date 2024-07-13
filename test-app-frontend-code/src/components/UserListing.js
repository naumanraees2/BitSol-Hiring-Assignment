import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap';
import { base_url } from '../contants';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import AddEditModal from './AddEditModal';
import { useNavigate } from 'react-router-dom';

const UserListing = () => {
    const [allUsers, setAllUsers] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    const [limit, setLimit] = useState(20)
    const [page, setPage] = useState(1)

    const myRef = useRef(null)

    const navigate = useNavigate(null)

    useEffect(() => {
        getAllUsers()

        const options = {
            root: null, // Use the viewport as the root
            rootMargin: '0px', // No margin around the viewport
            threshold: 0.5, // When at least 50% of the element is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {

                if (entry.isIntersecting) {
                    setLimit(limit => limit + 10)
                    setPage(page => page + 1)
                    // You can also perform any action you want when the element becomes visible here.
                }
            });
        }, options);

        // Start observing the target element
        observer.observe(myRef.current);

        console.log("observer here: ", observer)
        // Clean up the observer when the component unmounts
        return () => {
            observer.disconnect();
        };


    }, []);

    useEffect(() => {
        getAllUsers()
    }, [page, limit]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/')
    }

    const getAllUsers = async () => {
        const data = await axios({
            method: 'GET',
            url: `${base_url}/api/users/getAll?page=${page}&limit=${limit}`,
            headers: { 'Content-Type': 'application/json' },
        })
        if (data?.data?.status == 200) {
            setAllUsers(s => ([...s, ...data?.data?.response]))
        }
    }

    const handleEdit = (id) => {
        setShowModal(true)
        setSelectedItem(allUsers.find(user => user.id == id))
    }

    const handleDelete = async (id) => {
        try {
            const deleteUser = await axios({
                method: 'delete',
                url: `${base_url}/api/users/deleteUser/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    authorization: 'Bearer ' + localStorage.getItem('auth_token')
                },
            })
            if (deleteUser.data.status == 200) {
                alert('Successfully deleted user')
                setAllUsers(allUsers.filter(item => item.id != id))
            }
        } catch (e) {
        }
    }

    const handleClose = () => {
        setShowModal(false)
        setSelectedItem(null)
    }




    return (
        <>
            <Row>
                <div className='d-flex justify-content-between mb-3'>
                    <h3>
                        Users Listings
                    </h3>
                    <Button className="btn btn-danger " style={{ width: 120 }} onClick={handleLogout}>
                        Log Out
                    </Button>

                </div>
                <Col md={2} className='ms-auto text-end mb-3'>
                    <Button className='btn' onClick={() => setShowModal(true)}>
                        Add New
                    </Button>
                </Col>

            </Row>
            <div>
                <Table responsive="sm" bordered={true} striped>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            allUsers?.map((item, ind) => (<tr key={ind}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.phone_number}</td>
                                <td>{item.role}</td>
                                <td>{<div className='d-flex align-items-center justify-content-around' style={{ width: 70 }}>
                                    <Button className='btn btn-light p-0' onClick={() => { handleEdit(item.id) }}>
                                        <AiFillEdit size={25} color='#00c022' />
                                    </Button>
                                    <Button className='btn btn-light p-0' onClick={() => handleDelete(item.id)}>
                                        <AiFillDelete size={22} color='#ff0000' />
                                    </Button>
                                </div>}
                                </td>
                            </tr>))
                        }
                    </tbody>
                </Table>
                <div ref={myRef} className='mx-3' />
                {showModal && <AddEditModal showModal={showModal} handleClose={handleClose} selectedItem={selectedItem} edit={selectedItem ? true : false} />}
            </div >

        </>
    )
}

export default UserListing
