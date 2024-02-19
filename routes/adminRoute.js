const express = require('express')
const admin_route = express()


const adminController = require ('../controllers/adminControler')

admin_route.set('views',"./views/admin");

admin_route.get('/', adminController.loadAdmin)
admin_route.get('/admin', adminController.loadAdmin)

admin_route.post('/adminLogin', adminController.verifyAdmin)

admin_route.get('/adminPannel', adminController.loadAminPannel)
admin_route.get('/adminLogout',adminController.adminLogout)

admin_route.get('/addNewUser', adminController.loadAddNewUserPage)
admin_route.post('/addNewUser', adminController.insertNewUser)

 
admin_route.get('/editUser/:id', adminController.loadEditpage)
admin_route.post('/updateUser', adminController.updateUser)

admin_route.get('/deleteUser/:id', adminController.delUser)

//admin_route.post("/adminSearch", adminController.userSearch)







module.exports = admin_route