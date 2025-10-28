// Import d'express
const express = require('express')


// Initialiser mon application 
const app = express()

const PORT = process.env.PORT || 3000


app.get('/', (req, res) => {
    res.json({
        message: `Bienvenue sur l'API exposée au port ${PORT}`
    })
})

app.listen(PORT, () => {
    console.log(`Le serveur a bien démarré au port ${PORT}, youpi, hourra.`)
})