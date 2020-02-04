const log = require('../../../config/log_config').logger('appointment_investigations_role_mappings_controller');

module.exports = AppointmentInvestigationsRoleMapping => {

  AppointmentInvestigationsRoleMapping.fetchAppointmentInvestigationsRoleMapping = (req, res) => {
    let where_Obj = {
      ...req.params,
      include: [{
        model: models.InvestigationsRoleMapping,
        as: 'investigations_role_mapping'
      }, {
        model: models.Roles,
        as: 'role'
      }]
    };
    models.AppointmentInvestigationsRoleMapping.findOne(where_Obj)
      .then(fetchRes => {
        log.info('---PATIENT_PRESCRIPTION_FETCH_SUCCESS---');
        log.info(fetchRes);
        return res.send({
          success: true,
          message: 'Patient Investigations Role Mapping fetching success',
          data: {
            appointment_investigations_role_mapping: fetchRes
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
            appointment_investigations_role_mapping: fetchErr
          }
        });
      });
  }
}