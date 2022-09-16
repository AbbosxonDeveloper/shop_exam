import { read, write } from '../utils/model.js'

const GET = (req, res, nezt) => {
    try {
        let sub_categories = read('sub_categories')
        let products = read('products')
        let { sub_id } = req.params

        sub_categories.map(subs => {
            delete subs.category_id
            subs.products = products.filter(product => product.sub_category_id == subs.sub_category_id)
        })
        products.map(product => delete product.sub_category_id)
        if (!sub_id) {
            return res.send(sub_categories)
        }

        let findSub = sub_categories.find(subs => subs.sub_category_id == sub_id)
        if (!findSub) {
            return res.send('category not found')
        }
        return res.send(findSub)

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const POST = (req, res, next) => {
    try {
        let sub_categories = read('sub_categories')
        let categories = read('categories')
        let { category_id, sub_category_name } = req.body

        let findCategory = categories.find(category => category.category_id == category_id)

        if (!findCategory) {
            return res.send('sub category not found')
        }

        let newSub_category = {
            category_id,
            sub_category_id: sub_categories.at(-1).sub_category_id + 1 || 1,
            sub_category_name
        }

        sub_categories.push(newSub_category)
        write('sub_categories', sub_categories)
        return res.status(201).json({
            status: 201,
            mesage: "created",
            data: newSub_category
        })

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const PUT = (req, res, next) => {
    try {
        let sub_categories = read('sub_categories')
        let { sub_category_id, sub_category_name, category_id } = req.body

        let findSubs = sub_categories.find(subs => subs.sub_category_id == sub_category_id)
        if (!findSubs) {
            res.status(404).json({
                status: 404,
                message: "product id not found"
            })
        }

        if (!sub_category_name && !category_id && !model) {
            res.status(203).json({
                status: 203,
                message: "nothing to change"
            })
        }

        findSubs.sub_category_name = sub_category_name ? sub_category_name : findSubs.sub_category_name
        findSubs.category_id = category_id ? category_id : findSubs.category_id

        write('sub_categories', sub_categories)
        res.status(201).json({
            status: 201,
            message: "changed",
            data: {
                sub_category_name,
                category_id
            }
        })

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const DELETE = (req, res, next) => {
    try {
        let sub_categories = read('sub_categories')
        let { sub_category_id } = req.body

        let findSub_cat = sub_categories.find(subs => subs.sub_category_id == sub_category_id)
        if (findSub_cat) {
            sub_categories = sub_categories.filter(subs => subs.sub_category_id != sub_category_id)
            write('sub_categories', sub_categories)
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
    DELETE,
    PUT
}