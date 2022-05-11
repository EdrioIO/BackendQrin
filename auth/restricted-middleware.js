module.exports = (req,res,next) =>{
    console.log('req.session : ', req.session)
    // if(req.session && req.session.user){// if there is user then next
        next();// continue to next route on server.js
//     }
//     else{
//         res.status(401).json({error : true, message : 'No cookie session when operating function'});
//     }
}