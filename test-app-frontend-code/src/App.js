
import { Container } from 'react-bootstrap';
import LoginFormComponent from './components/Login';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserListing from './components/UserListing';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Container>
          <h1 className='text-center my-4'>BitSol Test Application</h1>
          <Routes>
            <Route path='/' element={<LoginFormComponent />} />
            <Route path='/user-listing' element={<UserListing />} />
          </Routes>

        </Container>

      </BrowserRouter>
    </div>
  );
}

export default App;
