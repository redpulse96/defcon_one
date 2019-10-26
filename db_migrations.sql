CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `role` ENUM('r_dentist', 'r_ortho') NOT NULL,
  `role_name` varchar(50) DEFAULT NULL,
  `role_code` varchar(10) NOT NULL,
  `role_description` varchar(50) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `symptoms` (
  `symptom_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `symptom_name` varchar(50) DEFAULT NULL,
  `symptom_code` varchar(10) NOT NULL,
  `symptom_description` varchar(50) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `symptoms_role_mapping` (
  `symptoms_role_mapping_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `symptom_id` bigInt(11) NOT NULL,
  `role_id` bigInt(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `examinations` (
  `examination_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `examination_name` varchar(50) DEFAULT NULL,
  `examination_code` varchar(10) NOT NULL,
  `examination_description` varchar(50) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `examinations_role_mapping` (
  `examination_role_mapping_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `examination_id` bigInt(11) NOT NULL,
  `role_id` bigInt(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


CREATE TABLE IF NOT EXISTS `investigations` (
  `investigation_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `investigation_name` varchar(50) DEFAULT NULL,
  `investigation_code` varchar(10) NOT NULL,
  `investigation_description` varchar(50) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `investigations_role_mapping` (
  `investigation_role_mapping_id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `investigation_id` bigInt(11) NOT NULL,
  `role_id` bigInt(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `diagnosis` (
  `diagnosis_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `diagnosis_name` varchar(50) DEFAULT NULL,
  `diagnosis_code` varchar(10) NOT NULL,
  `diagnosis_description` varchar(50) DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `diagnosis_role_mapping` (
  `diagnosis_role_id` bigInt(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `diagnosis_id` bigInt(11) NOT NULL
  `role_id` bigInt(11) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT '1',
  `is_archived` tinyint(4) NOT NULL DEFAULT '0',
  `created_date` datetime NOT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

ALTER TABLE `symptoms_role_mapping` ADD FOREIGN KEY (`symptom_id`) REFERENCES `symptoms` (`symptom_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `diagnosis_role_mapping` ADD FOREIGN KEY (`diagnosis_id`) REFERENCES `diagnosis` (`diagnosis_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `investigations_role_mapping` ADD FOREIGN KEY (`investigation_id`) REFERENCES `investigations` (`investigation_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `examinations_role_mapping` ADD FOREIGN KEY (`examination_id`) REFERENCES `examinations` (`examination_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `symptoms_role_mapping` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `diagnosis_role_mapping` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `investigations_role_mapping` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE `examinations_role_mapping` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON UPDATE CASCADE ON DELETE CASCADE;