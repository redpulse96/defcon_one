CREATE TABLE IF NOT EXISTS `appointments` (
  `appointment_id` BIGINT(11) NOT NULL PRIMARY KEY,
  `appointment_name` VARCHAR(50) DEFAULT NULL,
  `appointment_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('closed', 'pending', 'rescheduled', 'operating') DEFAULT `pending`,
  `rescheduled_date` DATE NULL DEFAULT NULL,
  `from_time` time DEFAULT NULL,
  `to_time` time DEFAULT NULL,
  `created_by` varchar(50) NOT NULL DEFAULT '',
  `doctor_remarks` VARCHAR(100) DEFAULT NULL,
  `is_active` TINYINT(4) NOT NULL DEFAULT '1',
  `is_archived` TINYINT(4) NOT NULL DEFAULT '0',
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `patient_id` (`patient_id`),
  CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `appointment_logs` (
  `appointment_log_id` BIGINT(11) NOT NULL PRIMARY KEY,
  `appointment_id` BIGINT(11) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `is_active` TINYINT(4) NOT NULL DEFAULT '1',
  `is_archived` TINYINT(4) NOT NULL DEFAULT '0',
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `appointment_logs_ibfk_1` (`appointment_id`),
  CONSTRAINT `appointment_logs_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;