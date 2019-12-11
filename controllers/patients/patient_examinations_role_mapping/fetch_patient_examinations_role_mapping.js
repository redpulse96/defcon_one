const log = require('../../../config/log_config').logger('patient_examinations_role_mappings_controller');

module.exports = PatientExaminationsRoleMapping => {

  PatientExaminationsRoleMapping.fetchPatientExaminationsRoleMapping = (req, res) => {
    let whereObj = Object.assign({}, req.params, {
      include: [{
        model: models.ExaminationsRoleMapping,
        as: 'examinations_role_mapping'
      }, {
        model: models.Roles,
        as: 'role'
      }]
    });
    models['PatientExaminationsRoleMapping'].findOne(whereObj)
      .then(fetch_res => {
        log.info('---PATIENT_PRESCRIPTION_FETCH_SUCCESS---');
        log.info(fetch_res);
        return res.send({
          success: true,
          message: 'Patient Examinations Role Mapping fetching success',
          data: {
            patient_examinations_role_mapping: fetch_res
          }
        });
      })
      .catch(fetch_err => {
        log.info('---PATIENT_PRESCRIPTION_FETCH_FAILURE---');
        log.info(fetch_err);
        return res.send({
          success: false,
          message: 'Patient Examinations Role Mapping fetching failure',
          data: {
            patient_examinations_role_mapping: fetch_err
          }
        });
      });
  }
}