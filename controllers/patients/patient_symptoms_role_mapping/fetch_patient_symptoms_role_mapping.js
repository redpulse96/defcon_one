const log = require('../../../config/log_config').logger('patient_symptoms_role_mappings_controller');

module.exports = PatientSymptomsRoleMapping => {

  PatientSymptomsRoleMapping.fetchPatientSymptomsRoleMapping = (req, res) => {
    let whereObj = {
      ...req.params,
      include: [{
        model: models.SymptomsRoleMapping,
        as: 'symptoms_role_mapping'
      }, {
        model: models.Roles,
        as: 'role'
      }]
    };
    models.PatientSymptomsRoleMapping.findOne(whereObj)
      .then(fetchRes => {
        log.info('---PATIENT_PRESCRIPTION_FETCH_SUCCESS---');
        log.info(fetchRes);
        return res.send({
          success: true,
          message: 'Patient Symptoms Role Mapping fetching success',
          data: {
            patient_symptoms_role_mapping: fetchRes
          }
        });
      })
      .catch(fetchErr => {
        log.info('---PATIENT_PRESCRIPTION_FETCH_FAILURE---');
        log.info(fetchErr);
        return res.send({
          success: false,
          message: 'Patient Symptoms Role Mapping fetching failure',
          data: {}
        });
      });
  }
}