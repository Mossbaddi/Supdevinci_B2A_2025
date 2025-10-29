const express = require('express')
const router = express.Router()


const {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle,
    getPublishedArticles,
    publishArticle
} = require('../controllers/articleController');


router.get('/',  getAllArticles)

router.get('/publies', getPublishedArticles)

router.get('/:id', getArticleById)

router.post('/', createArticle)

router.put('/:id', updateArticle)

router.delete('/:id', deleteArticle)


router.patch('/:id/publier', publishArticle)





module.exports = router