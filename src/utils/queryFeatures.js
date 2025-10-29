class QueryFeatures {

    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }


    filter() {
        const queryObj = {...this.queryString}

        { vues: {$gt: 100}}


        const excludedFields = ['page', 'sort', 'limit', 'fields', 'search']
        excludedFields.forEach(field => delete queryObj[field])

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        this.query = this.query.find(JSON.parse(queryStr))

        return this
    }

    search() {
        if (this.queryString.search) {

            const searchRegex = new RegExp(this.queryString.search, 'i')

            this.query = this.query.find({
                $or : [
                    {titre: searchRegex },
                    {contenu: searchRegex },
                    {auteur: searchRegex}
                ]
            })

        }

        return this
    }

    sort() {
        if (this.queryString.sort) {
            // "vues,createdAt" "vues createdAt" 
            const sortBy= this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    

}

module.exports = QueryFeatures