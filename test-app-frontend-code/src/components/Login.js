import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { base_url } from '../contants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginFormComponent() {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Email pass:    ', email, pass)
        if (!email) {
            return alert("Email is required");
        }
        else if (!pass) {
            return alert("Pass is required");
        }
        const data = { email: email.trim(), password: pass.trim() }

        try {
            const response = await axios({
                method: "post",
                url: `${base_url}/api/login`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: data,
            });
            console.log(response)
            if (response?.data?.status == 200) {
                localStorage.setItem('auth_token', response.data.token)
                navigate('/user-listing')
            }
        } catch (err) {
            console.error(err)
        }

    }

    return (
        <Row className='justify-content-center mt-5'>
            <Col md={8}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Password" />
                    </Form.Group>
                    {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group> */}
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </Col>
        </Row>

    );
}

export default LoginFormComponent;