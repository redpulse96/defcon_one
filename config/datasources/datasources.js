module.exports = {
  dev: {
    mysql: {
      host: 'ec2-3-132-138-87.us-east-2.compute.amazonaws.com',
      username: 'test_user',
      password: 'Daressalam',
      database: 'test_db',
      connector: "mysql",
      multipleStatements: true,
      connectTimeout: 100000,
      acquireTimeout: 100000,
      port: 3306
    },
    mongo: {
      url: 'mongodb+srv://admin:Daressalam@defconone-ak0ki.mongodb.net/Defcon_One_Auth?retryWrites=true&w=majority'
    }
  },
  // This will be configured on the server
  uat: {
    mysql: {},
    mongo: {}
  },
  // This will be configured on the server
  production: {
    mysql: {},
    mongo: {}
  }
};
