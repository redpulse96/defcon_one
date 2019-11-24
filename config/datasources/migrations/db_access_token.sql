CREATE TABLE `access_token` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `access_token` varchar(250) NOT NULL DEFAULT '',
  `username` varchar(50) NOT NULL DEFAULT '',
  `ttl` int(11) DEFAULT '43200' COMMENT 'time to live of the access token',
  `is_active` tinyint(4) DEFAULT '1',
  `is_archived` tinyint(4) DEFAULT '0',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;