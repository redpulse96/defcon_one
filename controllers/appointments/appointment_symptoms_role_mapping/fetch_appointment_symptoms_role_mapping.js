const log = require('../../../config/log_config').logger('appointment_symptoms_role_mappings_controller');

module.exports = AppointmentSymptomsRoleMapping => {

  AppointmentSymptomsRoleMapping.fetchAppointmentSymptomsRoleMapping = (req, res) => {
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
    models.AppointmentSymptomsRoleMapping.findOne(whereObj)
      .then(fetchRes => {
        log.info('---PATIENT_PRESCRIPTION_FETCH_SUCCESS---');
        log.info(fetchRes);
        return res.send({
          success: true,
          message: 'Patient Symptoms Role Mapping fetching success',
          data: {
            appointment_symptoms_role_mapping: fetchRes
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