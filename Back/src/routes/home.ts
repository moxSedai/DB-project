import express from 'express'
import Config from '../config/enviormentVariables'
import Settings from '../settings.json'
import LoginController from '../controllers/login'
import RegisterController from '../controllers/registerCustomer'
import RegisterEmployee from '../controllers/registerEmployee'
import RegisterSupplier from '../controllers/registerSupplier'
import CreateProduct from '../controllers/createProduct'
import ProductsListing from '../controllers/productsListing'
import CheckoutPopulate from '../controllers/checkoutPopulate'
import Checkout from '../controllers/checkout'
import PurchaseHistoryLoad from '../controllers/purchaseHistoryLoad'


export const HomeRoutes = express.Router()

HomeRoutes.get('/', async (req, res, next) => {
	res.send({
		name: Settings.ProjectName,
		version: Settings.ProjectVersion,
		port: Config.server.PORT
	})
})

HomeRoutes.post('/login', LoginController.login)

HomeRoutes.post('/registercustomer', RegisterController.registercustomer)

HomeRoutes.post('/registeremployee', RegisterEmployee.registeremployee)

HomeRoutes.post('/registersupplier', RegisterSupplier.registersupplier)

HomeRoutes.post('/createproduct', CreateProduct.createProduct)

HomeRoutes.post('/productslisting', ProductsListing.productsListing)

HomeRoutes.post('/checkoutPopulate', CheckoutPopulate.checkoutPopulate)

HomeRoutes.post('/checkout', Checkout.checkout)

HomeRoutes.post('/purchaseHistoryLoad', PurchaseHistoryLoad.purchaseHistoryLoad)




// Add routes using above syntax
