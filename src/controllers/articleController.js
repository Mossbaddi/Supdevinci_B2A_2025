const { catchAsync } = require('../middlewares/ErrorHandler');
const Article = require('../models/Article')
const QueryFeatures = require('../utils/queryFeatures')


// CREATE
const createArticle = catchAsync(async (req, res) => {
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

})

// READ
const getAllArticles = catchAsync(async (req, res) => {
        // Récupérer tous les articles, triés par date de création (plus récent en premier)
        // const articles = await Article.find().sort({ createdAt: -1 });
        const totalCount = await Article.countDocuments()

        const features = new QueryFeatures(Article.find(), req.query)
            .filter()
            .search()
            .sort()
            .limitFields()
            .paginate();

        const articles = await features.query

        const paginationInfo = features.getPaginationInfo(totalCount)

        const response = {
            success: true,
            count: articles.length,
            totalCount: totalCount,
            data: articles,
            // pagination?
        }

        if (paginationInfo) {
            response.pagination = paginationInfo
        }

        // Retourner les articles avec leur nombre
        res.status(200).json(response);

})

const getArticleById = catchAsync(async (req, res) => {
        // Récupérer l'ID depuis les paramètres de l'URL
        const { id } = req.params;

        // Chercher l'article par ID
        const article = await Article.findById(id);

        // Vérifier si l'article existe
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        // Incrémenter le nombre de vues
        await article.incrementerVues();

        // Retourner l'article
        res.status(200).json({
            success: true,
            data: article
        });

})


// UPDATE
const updateArticle = catchAsync(async (req, res) => {
        const { id } = req.params;

        // Chercher et mettre à jour l'article
        // { new: true } retourne le document mis à jour
        // { runValidators: true } exécute les validations du schéma
        const article = await Article.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,              // Retourne le document modifié
                runValidators: true     // Exécute les validations
            }
        );

        // Vérifier si l'article existe
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Article mis à jour avec succès',
            data: article
        });
})
// DELETE

const deleteArticle = catchAsync(async (req, res) => {
        const { id } = req.params;

        // Chercher et supprimer l'article
        const article = await Article.findByIdAndDelete(id);

        // Vérifier si l'article existe
        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Article supprimé avec succès',
            data: article
        });

})



const getPublishedArticles = catchAsync(async (req, res) => {
        // Utiliser la méthode statique du modèle
        const articles = await Article.findPublies();

        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });

})


const publishArticle = catchAsync(async (req, res) => {
        const { id } = req.params;

        // Trouver l'article
        const article = await Article.findById(id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
        }

        // Utiliser la méthode d'instance pour publier
        await article.publier();

        res.status(200).json({
            success: true,
            message: 'Article publié avec succès',
            data: article
        });

})






module.exports = {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    getPublishedArticles,
    publishArticle
};


