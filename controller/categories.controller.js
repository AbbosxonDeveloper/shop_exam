import { InternalServerError } from '../utils/errors.js'
import { read, write } from '../utils/model.js'


const GET = (req, res, next) => {
    try {
        let categories = read('categories')
        let subcategories = read('sub_categories')
        let { cat_id } = req.params

        categories.map(categorie => {
            categorie.subcategories = subcategories.filter(category => category.category_id == categorie.category_id)
            return categorie
        })
        subcategories.map(subs => delete subs.category_id)
        if (!cat_id) {
            return res.send(categories)
        }

        let findCategory = categories.find(category => category.category_id == cat_id)
        if (!findCategory) {
            return res.send('category not found')
        }
        return res.send(findCategory)

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const POST = (req, res, next) => {
    try {
        let categories = read('categories')
        let { category_name } = req.body


        let newCategory = {
            category_id: categories.at(-1).category_id + 1 || 1,
            category_name
        }

        categories.push(newCategory)
        write('categories', categories)
        return res.status(201).json({
            status: 201,
            mesage: "created",
            data: newCategory
        })

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const PUT = (req, res, next) => {
    try {
        let categories = read('categories')
        let { category_id, category_name } = req.body

        let findCategory = categories.find(category => category.category_id == category_id)
        if (!findCategory) {
            res.status(404).json({
                status: 404,
                message: "category id not found"
            })
        }

        if (!category_name) {
            res.status(203).json({
                status: 203,
                message: "nothing to change"
            })
        }

        findCategory.category_name = category_name ? category_name : findCategory.category_name

        write('categories', categories)
        res.status(201).json({
            status: 201,
            message: "changed",
            data: {
                category_name
            }
        })

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const DELETE = (req, res, next) => {
    try {
        let categories = read('categories')
        let { category_id } = req.body

        let findCategory = categories.find(category => category.category_id == category_id)
        if (findCategory) {
            categories = categories.filter(category => category.category_id != category_id)
            write('categories', categories)
            res.status(202).json({
                status: 204,
                message: "deleted"
            })
        }
        res.status(404).json({
            status: 404,
            message: "id not found"
        })
    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}



export default {
    GET,
    POST,
    PUT,
    DELETE
}