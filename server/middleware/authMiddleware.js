// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const protect = async (req, res, next) => {
//   try {
//     let token;

//     // 1. Check if token exists in headers
//     if (req.headers.authorization && 
//         req.headers.authorization.startsWith('Bearer')) {
//       token = req.headers.authorization.split(' ')[1];
//     }

//     // 2. If no token found
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: 'Not authorized, no token provided'
//       });
//     }

//    const decoded = jwt.verify(token, process.env.JWT_SECRET);

// const user = await User.findById(decoded.id).select('-password');

// console.log("TOKEN:", token);
// console.log("DECODED:", decoded);
// console.log("USER:", req.user);

// if (!user) {
//   return res.status(401).json({
//     success: false,
//     message: 'User not found'
//   });
// }

// req.user = user;
// next();

//   } catch (error) {
//     res.status(401).json({
//       success: false,
//       message: 'Not authorized, token failed'
//     });
//   }
// };

// module.exports = { protect };



const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
};

module.exports = { protect };