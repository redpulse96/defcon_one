CREATE TABLE IF NOT EXISTS `appointments` (
  `appointment_id` BIGINT(11) NOT NULL PRIMARY KEY,
  `appointment_name` VARCHAR(50) DEFAULT NULL,
  `appointment_date` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `status` ENUM('closed', 'pending', 'rescheduled', 'operating') NOT NULL,
  `rescheduled_date` DATE NULL DEFAULT NULL,
  `from_time` DATETIME NULL DEFAULT NULL,
  `to_time` DATETIME NULL DEFAULT NULL,
  `created_by` BIGINT(11) NOT NULL,
  `doctor_remarks` VARCHAR(100) DEFAULT NULL,
  `is_active` TINYINT(4) NOT NULL DEFAULT '1',
  `is_archived` TINYINT(4) NOT NULL DEFAULT '0',
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

CREATE TABLE IF NOT EXISTS `appointments_log` (
  `appointment_log_id` BIGINT(11) NOT NULL PRIMARY KEY,
  `appointment_id` BIGINT(11) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `is_active` TINYINT(4) NOT NULL DEFAULT '1',
  `is_archived` TINYINT(4) NOT NULL DEFAULT '0',
  `created_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `appointments_log_ibfk_1` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;