var mongoose = require("mongoose");
const url = process.env.DB;
var _db;


var options = {
  server: {
      socketOptions: {
          autoReconnect: true,
          keepAlive: 1,
          connectTimeoutMS: 30000,
          socketTimeoutMS: 0
      }
  }, useNewUrlParser: true ,
  replSet: {
      socketOptions: {
          keepAlive: 1,
          connectTimeoutMS: 30000,
          socketTimeoutMS: 0
      }
  }
}


module.exports = {
    connectToServer: async function main(){
        try{
           _db = await mongoose.connect(url, options);
        }  
    
        catch(err){ console.error(err); } 
        finally{ console.log("db connected!") } // make sure to close your connection after
       },

  getDb: async function() {
    return _db;
  }
};

