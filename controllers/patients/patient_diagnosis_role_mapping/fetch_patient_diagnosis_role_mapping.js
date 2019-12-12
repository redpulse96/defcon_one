const log = require('../../../config/log_config').logger('patient_diagnosis_role_mappings_controller');

module.exports = PatientDiagnosisRoleMapping => {

  PatientDiagnosisRoleMapping.fetchPatientDiagnosisRoleMapping = (req, res) => {
    let whereObj = Object.assign({}, req.params, {
      include: [{
        model: models.DiagnosisRoleMapping,
        as: 'diagnosis_role_mapping'
      }, {
        model: models.Roles,
        as: 'role'
      }]
    });
    models.PatientDiagnosisRoleMapping.findOne(whereObj)
      .then(fetchRes => {
        log.info('---PATIENT_PRESCRIPTION_FETCH_SUCCESS---');
        log.info(fetchRes);
        return res.send({
          success: true,
          message: 'Patient Diagnosis Role Mapping fetching success',
          data: {
            patient_diagnosis_role_mapping: fetchRes
          }
        });
      })
      .catch(fetchErr => {
        log.info('---PATIENT_PRESCRIPTION_FETCH_FAILURE---');
        log.info(fetchErr);
        return res.send({
          success: false,
          message: 'Patient Diagnosis Role Mapping fetching failure',
          data: {
            patient_diagnosis_role_mapping: fetchErr
          }
        });
      });
  }
}