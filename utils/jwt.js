const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

//CREATE A JWT TOKEN TAKING USER AS PARAMETER(PAYLOAD)
const createJWT = ({payload}) =>{
   const token = jwt.sign(payload, process.env.JWT_SECRET,
    {expiresIn: process.env.JWT_LIFETIME});
   return token
}


const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

//TAKES THE TOKEN AND ATTACH IT TO A COOKIE 
const attachCookiesToResponse = ({res,user})=>{

  const token = createJWT({payload:user});

  const oneDay = 1000 *60 *60 *24

  res.cookie('token',token,{
    httpOnly:true,
    expires: new Date(Date.now()+ oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed:true
  });

  res.status(StatusCodes.OK).json({user,token});
}


module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};
