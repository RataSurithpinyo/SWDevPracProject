const express = require('express');
const {getMassages,getMassage,createMassage,updateMassage,deleteMassage} = //,getVacCenters
require('../controllers/massages');
const appointmentRouter = require('./appointments');
const router = express.Router();
const {protect,authorize} = require('../middleware/auth');
router.use('/:massageId/appointments/',appointmentRouter);
router.route('/').get(getMassages).post(protect,authorize('admin'),createMassage);
router.route('/:id').get(getMassage).put(protect,authorize('admin'),updateMassage).delete(protect,authorize('admin'),deleteMassage);

module.exports = router; //export to let other files see the router

/**
* @swagger
* components:
*   schemas:
*     Massages:
*       type: object
*       required:
*         - name
*         - address
*       properties:
*         id:
*           type: string
*           format: uuid
*           description: The auto-generated id of the massage shop
*           example: d290f1ee-6c54-4b01-90e6-d701748f0851
*         ลําดับ:
*           type: string
*           description: Ordinal number
*         name:
*           type: string
*           description: Massage shop name
*         address:
*           type: string
*           description: House No., Street, Road
*         district:
*           type: string
*           description: District
*         province:
*           type: string
*           description: province
*         postalcode:
*           type: string
*           description: 5-digit postal code 
*         tel:
*           type: string
*           description: telephone number
*         region:
*           type: string
*           description: region
*         limit:
*           type: number
*           description: The limit on how many appointment can the massage shop take
*         openHours:
*           type: json
*           description: The opening time and closing time of the shop
*       example:
*         id: 609bda561452242d88d36e37
*         ลําดับ: 121
*         name: Thai Massage Shop
*         address: 121 ถ.สุขุมวิท
*         district: บางนา
*         province: กรุงเทพมหานคร
*         postalcode: 10110
*         tel: 02-2187000
*         region: กรุงเทพมหานคร (Bangkok)
*         limit: 1
*         openHours:
*          { 
*            "open": 600,
*            "close": 1200 
*          }
*/

/**
* @swagger
* tags:
*   name: Massage
*   description: The massage shop managing API
*/

/**
* @swagger
* /massages:
*   get:
*     summary: Returns the list of all the massages
*     tags: [Massages]
*     responses:
*       200:
*         description: The list of the massages
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/components/schemas/Hospital'
*/

/**
* @swagger
* /massages/{id}:
*   get:
*     summary: Get the hospital by id
*     tags: [Massages]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The hospital id
*     responses:
*       200:
*         description: The hospital description by id
*         contents:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Massage'
*       404:
*         description: The hospital was not found
*/

/**
* @swagger
* /massages:
*   post:
*     summary: Create a new hospital
*     tags: [Massages]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Massage'
*     responses:
*       201:
*         description: The hospital was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Massage'
*       500:
*         description: Some server error
*/

//update
/**
* @swagger
* /massages/{id}:
*   put:
*     summary: Update the hospital by the id
*     tags: [Massages]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The hospital id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Massage'
*     responses:
*       200:
*         description: The hospital was updated
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Massage'
*       404:
*         description: The hospital was not found
*       500:
*         description: Some error happened
*/

//delete
/**
* @swagger
* /massages/{id}:
*   delete:
*     summary: Remove the hospital by id
*     tags: [Massages]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The hospital id
*
*     responses:
*       200:
*         description: The hospital was deleted
*       404:
*         description: The hospital was not found
*/

