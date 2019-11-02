/* jshint node: true */
'use strict';

modelExists = model => {
  if (!model)
    throw new Error('No model sent');

  if (!_.isFunction(model))
    throw new Error('model is not a function');

  return true;
}

methodExists = (model, methodPath) => {
  modelExists(model);

  if (!_.has(model, methodPath))
    throw new Error('model does not have a ' + methodPath + ' key');

  if (!_.isFunction(_.get(model, methodPath)))
    throw new Error('model.' + methodPath + ' is not a function');

  return true;
}

getModelName = model => {
  var modelName = _.get(model, 'definition.name');
  if (!modelName)
    throw new Error('model does not have a name');
  if (!_.isString(modelName))
    throw new Error('model "definition.name" is not a string');

  return modelName;
}

create = model => {

  methodExists(model, 'create');
  var modelName = getModelName(model);
  var log = requireHelper.createBunyanLogger(modelName);

  return (createObj, callback) => {
    var languageCode = this.languageCode || constants.DEFAULT_LANG;
    model.create(createObj)
      .then(result => {
        log.debug(modelName);
        log.debug(result);
        return callback(null, response({
          success: true,
          template: 'model.model_created',
          variables: {
            key: modelName
          },
          languageCode: languageCode,
          data: result
        }));
      })
      .catch(error => {
        log.error('error');
        log.error(error);
        return callback(response({
          success: false,
          template: 'common.default_error_res',
          languageCode: languageCode,
          data: []
        }));
      });
  };
}

findById = (model, cache) => {

  methodExists(model, 'findById');
  var modelName = getModelName(model);
  var log = requireHelper.createBunyanLogger(modelName);

  return (id, callback) => {
    var languageCode = this.languageCode || constants.DEFAULT_LANG;
    model.findById(id)
      .then(result => {
        log.debug(modelName);
        log.debug(result);
        if (result) {
          return callback(null, result);
        } else {
          return callback(response({
            success: false,
            template: 'common.not_found',
            variables: {
              key: modelName
            },
            languageCode: languageCode,
            data: []
          }));
        }
      })
      .catch(error => {
        log.error('error');
        log.error(error);
        return callback(response({
          success: false,
          template: 'common.default_error_res',
          languageCode: languageCode,
          data: []
        }));
      });
  };
}

count = model => {

  methodExists(model, 'count');
  var modelName = getModelName(model);
  var log = requireHelper.createBunyanLogger(modelName);

  return (filter, callback) => {
    var languageCode = this.languageCode || constants.DEFAULT_LANG;
    model.count(filter)
      .then(count => {
        log.debug(modelName + 'count');
        log.debug(count);
        return callback(null, count);
      })
      .catch(error => {
        log.error('error');
        log.error(error);
        return callback(response({
          success: false,
          template: 'common.default_error_res',
          languageCode: languageCode,
          data: []
        }));
      });
  };
}

find = model => {

  methodExists(model, 'find');
  var modelName = getModelName(model);
  var log = requireHelper.createBunyanLogger(modelName);

  return (filter, callback) => {
    var languageCode = this.languageCode || constants.DEFAULT_LANG;
    // console.log('174 model-helper.js find filter::: ', JSON.stringify(filter), '  modelName:: ', modelName)
    model.find(filter)
      .then(result => {
        // log.debug(modelName);
        // log.debug(result);
        return callback(null, result);
      }).catch(error => {
        log.error('error');
        log.error(error);
        return callback(response({
          success: false,
          template: 'common.default_error_res',
          languageCode: languageCode,
          data: []
        }));
      });
  };
}

findOne = model => {

  methodExists(model, 'findOne');
  var modelName = getModelName(model);
  var log = requireHelper.createBunyanLogger(modelName);

  return (filter, callback) => {
    var languageCode = this.languageCode || constants.languageCode;
    model.findOne(filter)
      .then(result => {
        log.debug(modelName);
        log.debug(result);
        if (result) {
          return callback(null, result);
        } else {
          return callback(response({
            success: false,
            template: 'common.not_found',
            variables: {
              key: modelName
            },
            languageCode: languageCode,
            data: []
          }));
        }
      })
      .catch(error => {
        log.error('error');
        log.error(error);
        return callback(response({
          success: false,
          template: 'common.default_error_res',
          languageCode: languageCode,
          data: []
        }));
      });
  };
}

module.exports = {
  create: create,
  findById: findById,
  count: count,
  find: find,
  findOne: findOne
};