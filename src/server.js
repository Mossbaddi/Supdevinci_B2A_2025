require('dotenv').config();

// Import d'express
const express = require('express')

const { connectDB } = require('./config/database')

// Routes imports
const articleRoutes = require('./routes/articles');
const { errorHandler, notFound } = require('./middlewares/ErrorHandler');

// Initialiser mon application 
const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json());


app.use(express.urlencoded({ extended: true}))

app.get('/', (req, res) => {
    res.json({
        message: `Bienvenue sur l'API exposée au port ${PORT}`
    })
})


app.use('/api/articles', articleRoutes)

app.use(notFound)

app.use(errorHandler)



async function startServer() {
    try {
    await connectDB()

    app.listen(PORT, () => {
        console.log(`Le serveur a bien démarré au port ${PORT}, youpi, hourra.`)
    })
    } catch (error) {
        console.error('Erreur au démarrage du serveur :', error);
        process.exit(1);
    }
}


startServer()