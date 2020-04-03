
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE IF NOT EXISTS `okjproject` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `okjproject`;

CREATE TABLE IF NOT EXISTS `market` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ownerid` int(11) NOT NULL DEFAULT '0',
  `created_at` date NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `price` int(11) NOT NULL DEFAULT '0',
  `make` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `model` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `shape` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `fuel_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `horsepower` int(11) NOT NULL DEFAULT '0',
  `cubic_capacity` int(11) NOT NULL DEFAULT '0',
  `milage` int(11) NOT NULL DEFAULT '0',
  `year` int(11) NOT NULL DEFAULT '0',
  `doors` int(11) NOT NULL DEFAULT '0',
  `seats` int(11) NOT NULL DEFAULT '0',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table stores information about market ads.';

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `password` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci NULL DEFAULT '',
  `country` varchar(60) COLLATE utf8mb4_unicode_ci NULL DEFAULT '',
  `birth_date` date NOT NULL,
  `language` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `register_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='This table stores basic information about users.';

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
