const userModel = require('../model/userModel')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRegister = async(req,res)=>{
    try{
        let data = req.body;
        const {firstname,lastname,email,password} = req.body;
        
        if(!(firstname && lastname && email && password)){
           return  res.status(400).send("all fielde are mandatory")

        }
        data.password =  bcrypt.hashSync(data.password);//for encrypted password
        const existingUSer = await userModel.findOne({email})
        if(existingUSer){
           return res.status(401).send("user already exist in this email")
        }
          
         const createData = await userModel.create(data);
         //console.log(createData);
         return res.status(201).send({status:true,message:"user created succesfully",createData});  
         

    }catch{

        return res.status(500).send({ status: false, message: error.message });
    };

};

    const userLogin = async(req,res)=>{

        try{
            let data = req.body;
               //get all data
            const {email,password} = data;
            if(!(email && password)){
                res.status(400).send("send all data")

            };
            //find user in db
            const user = await userModel.findOne({ email });

        if (user) {
            const validPassword =  bcrypt.compareSync(password, user.password);
                           
            if (!validPassword) {
                return res.status(401).send({ status: false, message: "Invalid Password Credential" });
            }
        }
        else {
            return res.status(401).send({ status: false, message: "Invalid email Credential" });
        }


             ///////////////////token generation/////////////////////////////////////////////////////
          const token = jwt.sign({
            userId: user._id,

          },"doneByBabu");
          res.setHeader("Authorization",token);
          res.status(200).send({ status:true,message:"you are successfully logged in", data:{token}} )

    

        }catch(error){
            return res.status(500).send({ status: false, message: error.message });
        }

    };


    const getUser = async(req,res)=>{

        try{
       let  userId = req.params.userId;
       
       let userData = await userModel.findById(userId).select({firstname: 1, lastname: 1, email: 1})
       return res.status(200).send({status:true,message:"find customer details",data:userData}) 
        }catch(error){
            return res.status(500).send({ status: false, message: error.message });
    
        }
    };

   

     



   




module.exports = {userRegister,userLogin,getUser};