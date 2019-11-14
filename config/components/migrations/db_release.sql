CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `role` ENUM('r_dentist', 'r_ortho') NOT NULL,
  `role_name` varchar(50) DEFAULT NULL,
  `role_code` varchar(10) NOT NULL,
  `role_description` varchar(50) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `symptoms` (
  `symptom_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `symptom_name` varchar(50) DEFAULT NULL,
  `symptom_code` varchar(10) NOT NULL,
  `symptom_description` varchar(50) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `symptoms_role_mapping` (
  `symptom_role_mapping_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `symptom_id` bigInt(11) NOT NULL,
  `role_id` bigInt(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `examinations` (
  `examination_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `examination_name` varchar(50) DEFAULT NULL,
  `examination_code` varchar(10) NOT NULL,
  `examination_description` varchar(50) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `examinations_role_mapping` (
  `examination_role_mapping_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `examination_id` bigInt(11) NOT NULL,
  `role_id` bigInt(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


CREATE TABLE IF NOT EXISTS `investigations` (
  `investigation_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `investigation_name` varchar(50) DEFAULT NULL,
  `investigation_code` varchar(10) NOT NULL,
  `investigation_description` varchar(50) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `investigations_role_mapping` (
  `investigation_role_mapping_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `investigation_id` bigInt(11) NOT NULL,
  `role_id` bigInt(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `diagnosis` (
  `diagnosis_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `diagnosis_name` varchar(50) DEFAULT NULL,
  `diagnosis_code` varchar(10) NOT NULL,
  `diagnosis_description` varchar(50) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `diagnosis_role_mapping` (
  `diagnosis_role_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `diagnosis_id` bigInt(11) NOT NULL
  `role_id` bigInt(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `patients` (
  `patient_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `patient_name` varchar(50) DEFAULT NULL,
  `phone_code` int(5) DEFAULT 91,
  `mobile_no` int(15) NOT NULL,
  `age` int(10) DEFAULT NULL,
  `gender` ENUM('Male', 'Female', 'Others') NOT NULL,
  `height` int(100) DEFAULT NULL COMMENT 'in cms',
  `weight` int(100) DEFAULT NULL COMMENT 'in Kgs',
  `blood_type` varchar(5) DEFAULT NULL,
  `date_of_birth` datetime NOT NULL,
  `email` varchar(20) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `patient_symptoms_role_mapping` (
  `patient_symptom_role_mapping_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `patient_id` bigInt(11) NOT NULL,
  `symptom_role_mapping_id` bigInt(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `patient_examinations_role_mapping` (
  `patient_examination_role_mapping_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `patient_id` bigInt(11) NOT NULL,
  `examination_role_mapping_id` bigInt(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `patient_investigations_role_mapping` (
  `patient_investigation_role_mapping_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `patient_id` bigInt(11) NOT NULL,
  `investigation_role_mapping_id` bigInt(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `patient_diagnosis_role_mapping` (
  `patient_diagnosis_role_mapping_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `patient_id` bigInt(11) NOT NULL,
  `diagnosis_role_mapping_id` bigInt(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `patient_prescription` (
  `patient_prescription_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `patient_id` bigInt(11) NOT NULL,
  `patient_symptom_role_mapping_id` bigInt(11) NOT NULL,
  `patient_examination_role_mapping_id` bigInt(11) NOT NULL,
  `patient_investigation_role_mapping_id` bigInt(11) NOT NULL,
  `patient_diagnosis_role_mapping_id` bigInt(11) NOT NULL,
  `reference_id` varchar(10) DEFAULT NULL,
  `medicine_id` bigint(11) DEFAULT NULL,
  `doctor_remarks` varchar(100) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE `prescription_charges` (
  `prescription_charge_id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `patient_prescription_id` bigint(20) DEFAULT NULL,
  `charges` int(11) DEFAULT NULL,
  `is_active` tinyint(4) DEFAULT '1',
  `is_archived` tinyint(4) DEFAULT '0',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`prescription_charge_id`),
  KEY `patient_prescription_id` (`patient_prescription_id`),
  CONSTRAINT `prescription_charges_ibfk_1` FOREIGN KEY (`patient_prescription_id`) REFERENCES `patient_prescription` (`patient_prescription_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `patients` ADD CONSTRAINT unique_mobile UNIQUE (`mobile_no`);

ALTER TABLE `symptoms_role_mapping` ADD FOREIGN KEY (`symptom_id`) REFERENCES `symptoms` (`symptom_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `diagnosis_role_mapping` ADD FOREIGN KEY (`diagnosis_id`) REFERENCES `diagnosis` (`diagnosis_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `investigations_role_mapping` ADD FOREIGN KEY (`investigation_id`) REFERENCES `investigations` (`investigation_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `examinations_role_mapping` ADD FOREIGN KEY (`examination_id`) REFERENCES `examinations` (`examination_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `symptoms_role_mapping` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `diagnosis_role_mapping` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `investigations_role_mapping` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `examinations_role_mapping` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `patient_symptoms_role_mapping` ADD FOREIGN KEY (`symptom_role_mapping_id`) REFERENCES `symptoms_role_mapping` (`symptom_role_mapping_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `patient_diagnosis_role_mapping` ADD FOREIGN KEY (`diagnosis_role_mapping_id`) REFERENCES `diagnosis_role_mapping` (`diagnosis_role_mapping_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `patient_investigations_role_mapping` ADD FOREIGN KEY (`investigation_role_mapping_id`) REFERENCES `investigations_role_mapping` (`investigation_role_mapping_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `patient_examinations_role_mapping` ADD FOREIGN KEY (`examination_role_mapping_id`) REFERENCES `examinations_role_mapping` (`examination_role_mapping_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `patient_prescription` ADD FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `patient_prescription` ADD FOREIGN KEY (`patient_symptom_role_mapping_id`) REFERENCES `patient_symptoms_role_mapping` (`patient_symptom_role_mapping_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `patient_prescription` ADD FOREIGN KEY (`patient_diagnosis_role_mapping_id`) REFERENCES `patient_diagnosis_role_mapping` (`patient_diagnosis_role_mapping_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `patient_prescription` ADD FOREIGN KEY (`patient_investigation_role_mapping_id`) REFERENCES `patient_investigations_role_mapping` (`patient_investigation_role_mapping_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `patient_prescription` ADD FOREIGN KEY (`patient_examination_role_mapping_id`) REFERENCES `patient_examinations_role_mapping` (`patient_examination_role_mapping_id`) ON UPDATE CASCADE ON DELETE CASCADE;