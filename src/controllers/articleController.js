const Article = require('../models/Article')


// CREATE
async function createArticle(req, res) {
    try {
        // Je récupère le contenu de ma requête
        const {titre, contenu, auteur, categorie} = req.body;

        // J'instancie mon article
        const article = new Article({
            titre,
            contenu,
            auteur,
            categorie,
        })

        articleSauvegarde = await article.save()

        res.status(201).json({
            success: true,
            message: 'Article créé avec success',
            data: articleSauvegarde
        })
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Erreur de validation',
                errors: Object.values(error.errors).map(err => err.message)
            })
        }

        res.status(500).json({
            success: false,
            message: 'Erreur coté serveur',
            error: error.message
        })}

}

// READ
// UPDATE
// DELETE