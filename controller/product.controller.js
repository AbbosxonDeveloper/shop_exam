import { read, write } from '../utils/model.js'

const GET = (req, res, next) => {
    try {
        let products = read("products");
        let { category_id, model, sub_category_id } = req.query;
        let params = req.params.product_id
        if (req.url == '/products') {
            res.send([])
        } else {
            let filteredProducts = products.filter(product => {
                let by_params = params ? params == product.product_id : true
                let byModel = model ? product.model.toLowerCase().includes(model.toLowerCase()) : true
                let by_categoryId = category_id ? product.category_id == category_id : true
                let by_subCatId = sub_category_id ? product.sub_category_id == sub_category_id : true

                return byModel && by_categoryId && by_subCatId && by_params
            })
            res.send(filteredProducts)
        }
    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const POST = (req, res, next) => {
    try {
        let products = read('products')
        let { sub_category_id, model, product_name, price, color } = req.body
        let sub_categories = read('sub_categories')

        let findProduct = sub_categories.find(subs => subs.sub_category_id == sub_category_id)

        if (!findProduct) {
            return res.send('sub category not found')
        }

        let newProduct = {
            sub_category_id,
            product_id: products.at(-1).product_id + 1 || 1,
            model,
            product_name,
            color,
            price
        }

        products.push(newProduct)
        write('products', products)
        return res.status(201).json({
            status: 201,
            mesage: "created",
            data: newProduct
        })

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const PUT = (req, res, next) => {
    try {
        let products = read('products')
        let { product_id, product_name, price, model } = req.body

        let findProduct = products.find(product => product.product_id == product_id)
        if (!findProduct) {
            res.status(404).json({
                status: 404,
                message: "product id not found"
            })
        }

        if (!product_name && !price && !model) {
            res.status(203).json({
                status: 203,
                message: "nothing to change"
            })
        }

        findProduct.product_name = product_name ? product_name : findProduct.product_name
        findProduct.price = price ? price : findProduct.price
        findProduct.model = model ? model : findProduct.model

        write('products', products)
        res.status(201).json({
            status: 201,
            message: "changed",
            data: {
                product_name,
                price
            }
        })

    } catch (error) {
        return next(new InternalServerError(500, error.message))
    }
}

const DELETE = (req, res, next) => {
    try {
        let products = read('products')
        let { product_id } = req.body

        let findProduct = products.find(product => product.product_id == product_id)
        if (findProduct) {
            products = products.filter(product => product.product_id != product_id)
            write('products', products)
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
    DELETE,
}