const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderController");

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/customer/:userId", controller.getByCustomer);
router.get("/courier/:courierId", controller.getByCourier);
router.patch("/:id/status", controller.updateStatus);
router.patch("/:id/assign-courier", controller.assignCourier);
router.patch("/:id/delivery-status", controller.updateDeliveryStatus);

module.exports = router;
