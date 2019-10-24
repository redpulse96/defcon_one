module.exports = {
  dev: {
    mysql: {
      host: 'ec2-3-132-138-87.us-east-2.compute.amazonaws.com',
      user: 'test_user',
      password: 'Daressalam',
      database: 'test_db',
      connector: "mysql",
      connectTimeout: 100000,
      acquireTimeout: 100000,
      port: 3306
    }
  },
  production: {
    mysql: {}
  },
}