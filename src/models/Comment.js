const mongoose = require('mongoose');



const commentSchema =  new mongoose.Schema(
    {
        contenu: {
            type: String,
            required: [true, "Le contenu du commentaire est obligatoire"],
            trim: true,
            minLength: [2, "Le commentaire doit faire au moins 2 caractères"],
            maxLength: [500, "Le commentaire doit faire moins de 500 caractères"]
        },

        auteur: {
            type: String, 
            required: [true, "Le contenu du commentaire est obligatoire"],
            trim: true,
            minLength: [2, "Le commentaire doit faire au moins 2 caractères"],
            maxLength: [50, "Le commentaire doit faire moins de 500 caractères"]
        },

        email: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Email invalide'
            ]

        },

        article: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Article',
            required: [true, 'Le commentaire doit être associé à un article']
        },

        approuve: {
            type: Boolean,
            default: false
        },

        signale: {
            type: Boolean,
            default: false
        },

    },
    {
        timestamps: true,
        toJSON: {virtuals: true}
    }
)



commentSchema.methods.approuver = function() {
    this.approuve = true;
    return this.save();
}

commentSchema.methods.signaler = function() {
    this.signale = true;
    return this.save()
}

commentSchema.methods.desapprouver = function() {
    this.approuve = false;
    return this.save();
}

commentSchema.methods.designaler = function() {
    this.signale = false;
    return this.save()
}

commentSchema.virtual('resume').get(function() {
    if (this.contenu.length <= 40) {
        return this.contenu;
    }
    return this.contenu.substring(0, 40) + '...';
});

commentSchema.pre('save', (next) => {
    console.log("Commentaire reçu")
    next()
})

commentSchema.post('save', function(doc) {
    console.log(`Commentaire sauvegardé : ${doc._id}`);
});

commentSchema.pre('remove', function(next) {
    console.log(`  Suppression du commentaire : ${this._id}`);
    next();
});


commentSchema.pre(/^find/, (next) => {
    this.populate({
        path: 'article',
        select: 'titre auteur'
    })
    next();
})



const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment;




















