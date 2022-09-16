import { Router } from "express";
import categoriesController from "../controller/categories.controller.js";
import productController from "../controller/product.controller.js";
import sub_categoriesController from "../controller/sub_categories.controller.js";
import checkToken from "../middlewares/checkToken.js";
import validation from "../middlewares/validation.js";
import adminController from '../controller/admin.conroller.js'

const router = Router()

// admin
router.post('/login', validation, adminController.LOGIN);
// categories

router.get('/categories', categoriesController.GET)
router.get('/categories/:cat_id', categoriesController.GET)
router.post('/categories', checkToken, categoriesController.POST)
router.put('/categories', checkToken, categoriesController.PUT)
router.delete('/categories', checkToken, categoriesController.DELETE)


// sub_categories


router.get('/subcategories', sub_categoriesController.GET)
router.get('/subcategories/:sub_id', sub_categoriesController.GET)
router.post('/subcategories', checkToken, sub_categoriesController.POST)
router.put('/subcategories', checkToken, sub_categoriesController.PUT)
router.delete('/subcategories', checkToken, sub_categoriesController.DELETE)


// products


router.get('/products', productController.GET)
router.get('/products/:product_id', productController.GET)
router.post('/products', checkToken, productController.POST)
router.put('/products', checkToken, productController.PUT)
router.delete('/products', checkToken, productController.DELETE)

export default router