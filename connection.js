const mongoose = require('mongoose');
require('dotenv').config();

// mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@cluster0.trdujnc.mongodb.net/chatapp?retryWrites=true&w=majority`, ()=> {
//   console.log('connected to mongodb ...')
// })

mongoose.connect("mongodb+srv://siresire:siresire@cluster0.xjh8kjw.mongodb.net/?retryWrites=true&w=majority", ()=> {
  console.log('connected to mongodb ...')

})