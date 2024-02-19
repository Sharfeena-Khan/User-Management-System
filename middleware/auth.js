const isLogin = async(req, res, next)=>{

    try {
        if(req.session.auth){
            next()
        }
        else{
            res.redirect('/')
        }
        
        
    } catch (error) {
        console.log(error.message);
        
    }
    next()
}


const isLogout = async(req, res, next)=>{

    try {
        if(req.session.user_id){
        
            res.redirect('/')
        }
        else{
            next()
        }
        
        
    } catch (error) {
        console.log(error.message);
        
    }
}


module.exports = {
    isLogin,
    isLogout
}