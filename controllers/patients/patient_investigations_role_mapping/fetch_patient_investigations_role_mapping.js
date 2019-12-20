const log = require('../../../config/log_config').logger('patient_investigations_role_mappings_controller');

module.exports = PatientInvestigationsRoleMapping => {

  PatientInvestigationsRoleMapping.fetchPatientInvestigationsRoleMapping = (req, res) => {
    let whereObj = {
      ...req.params,
      include: [{
        model: models.InvestigationsRoleMapping,
        as: 'investigations_role_mapping'
      }, {
        model: models.Roles,
        as: 'role'
      }]
    };
    models.PatientInvestigationsRoleMapping.findOne(whereObj)
      .then(fetchRes => {
        log.info('---PATIENT_PRESCRIPTION_FETCH_SUCCESS---');
        log.info(fetchRes);
        return res.send({
          success: true,
          message: 'Patient Investigations Role Mapping fetching success',
          data: {
            patient_investigations_role_mapping: fetchRes
          }
        });
      })
      .catch(fetchErr => {
        log.info('---PATIENT_PRESCRIPTION_FETCH_FAILURE---');
        log.info(fetchErr);
        return res.send({
          success: false,
          message: 'Patient Investigations Role Mapping fetching failure',
          data: {
            patient_investigations_role_mapping: fetchErr
          }
        });
      });
  }
}