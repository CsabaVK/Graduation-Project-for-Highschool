-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2020. Már 30. 20:34
-- Kiszolgáló verziója: 10.4.11-MariaDB
-- PHP verzió: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `okjproject`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `market`
--

CREATE TABLE `market` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `created_at` date NOT NULL,
  `title` varchar(100) NOT NULL,
  `price` int(11) NOT NULL,
  `make` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `shape` varchar(20) NOT NULL,
  `fuel_type` varchar(20) NOT NULL,
  `cubic_capacity` int(11) NOT NULL,
  `milage` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `doors` int(11) NOT NULL,
  `seats` int(11) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- A tábla adatainak kiíratása `market`
--

INSERT INTO `market` (`id`, `owner_id`, `created_at`, `title`, `price`, `make`, `model`, `shape`, `fuel_type`, `cubic_capacity`, `milage`, `year`, `doors`, `seats`, `description`) VALUES
(1, 6, '2020-03-29', 'Subaru WRX', 22000, 'Subaru', 'WRX', 'Sedan', 'Benzin', 2000, 245000, 2002, 4, 5, 'SUPŐOrjmsa gjnadvbnadvbi fadgshb'),
(2, 6, '2020-03-20', 'Subaru STI', 23500, 'Subaru', 'STI', 'Sedan', 'Benzin', 2200, 270000, 2001, 4, 5, 'Second subaru');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birth_date` date NOT NULL,
  `lang` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `birth_date`, `lang`) VALUES
(1, 'vaganykarc', 'Asd1', 'csabavk@outlook.com', '2000-02-02', 'English'),
(2, 'KUiki jános', 'sha1$bfbbcc7b$1$d33542465921be3d6183b0f5090c0b941acfec8c', 'kukijani@buzivok.eu', '1980-03-31', 'English'),
(3, 'specialcharoff', 'sha1$312313f2$1$6473e9acbb29ba7428212c7a86d71046d81aca04', 'asdasd@asd.hu', '1999-09-09', 'English'),
(4, 'cjbsadvbasdhbda', 'sha1$a9adf260$1$122ab5b5b144675a1deba4affcbb3d3f054c34d6', 'mckjsqnfjsab@kjsanfdjqsdb.com', '1999-02-11', 'English'),
(5, 'csabavk', 'sha1$c804fa8f$1$73dfe6233bf1599cf304a634e9da45b1306106b0', 'Asd123@email.com', '1999-09-09', 'English'),
(6, 'asdAsd123', 'sha1$8788b278$1$9885115efe238ffc295cf7ce62f76ed9a2152889', 'csabavkvvv@outlook.com', '2000-02-02', 'English'),
(7, 'BAZDMEGEEE', 'TUHj1', 'bazdmeggecim@mukodj.com', '2000-03-07', 'English');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `market`
--
ALTER TABLE `market`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `market`
--
ALTER TABLE `market`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
