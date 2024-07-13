const express = require('express');
const app = express();
const cors = require('cors');


app.use(express.json()) //by default json max size limit = 4mb
app.use(express.urlencoded({ extended: true }))
app.use(cors())

require('./models');

//SERVER TESTING API
app.get('/', (req, res) => {
    return res.status(200).json({ message: 'Welcome to Testing Application' })
})

const authRoute = require('./routes/authRoutes');
app.use('/api', authRoute)


const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes)




const PORT = 8080
app.listen(PORT, () => { console.log("Server is running on port " + PORT + "") })