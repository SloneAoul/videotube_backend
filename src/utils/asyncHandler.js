//creating a wrapper functon becuase we would be doing async handling multiple times 

const asyncHandler=(requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
        .catch((err) => {
                console.error("💥 ERROR CAUGHT IN ASYNC HANDLER:")
                console.error(err)
                next(err)})
    }
    
}

export {asyncHandler}








//anoher method

// const asyncHandler = (fn) => async (req, res, next) => {
//     try{
//         await fn(req,res,next)

//     }
//     catch(error){
//         res.status(error.code || 500).json ({
//             success:false,
//             message:error.message
//         })
//     }
// }


