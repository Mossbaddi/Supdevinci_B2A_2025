const { kMaxLength } = require('buffer')
const mongoose = require('mongoose')

const articleSchema = mongoose.Schema(
    {
        titre: {
            type: String,
            required: [true, 'le titre est obligatoire'],
            trim: true,
            minlength: [
                3,
                'Le titre doit contenir au moins trois caractères'
            ],
            maxlength: [200, 'le titre ne peut pas dépasser 200 caractères']
        
        },

        contenu: {
            type: String,
            required: [true, 'Le contenu est obligatoire'],
            trim: true,
            minlength: [10, 'Le contenu doit contenir au moins 10 caractères']
        },

        auteur: {
            type: String,
            required: [true, 'L\'auteur est obligatoire'],
            trim: true,
            maxlength: [100, 'Le nom de l\'auteur ne peut pas dépasser 100 caractères']
        },

        publie: {
            type: Boolean,
            default: false
        },

        categorie: {
            type: String,
            trim: true,
            enum: {
                values: ['Technologie', 'Lifestyle', 'Voyage', 'Cuisine', 'Autre'],
                message: '{VALUE} n\'est pas une catégorie valide'
            }
        },

        vues: {
            type: Number,
            default: 0,
            min: [0, 'Le nombre de vues ne peut pas être négatif']
        }
    }

)