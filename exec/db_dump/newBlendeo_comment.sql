-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: i12a602.p.ssafy.io    Database: newBlendeo
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `project_id` int NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (3,5,6,'꺅 팬이에요','2025-02-19 06:38:36'),(4,1,6,'중간발표는 매우 성공적!','2025-02-19 06:39:47'),(6,4,6,'아주 나이스~','2025-02-19 10:29:43'),(7,6,29,'기타 잘 치시네요!','2025-02-20 01:16:57'),(8,6,25,'계란말이요','2025-02-20 03:06:23'),(9,6,25,'계란말이요','2025-02-20 03:30:20'),(10,6,25,'계란말이요','2025-02-20 03:30:31'),(11,6,25,'계란말이요','2025-02-20 03:39:55'),(12,6,25,'계란말이요','2025-02-20 03:40:03'),(13,6,25,'계란말이요','2025-02-20 03:40:06'),(14,6,25,'계란말이요','2025-02-20 03:40:06'),(15,6,25,'계란말이요','2025-02-20 03:41:16'),(16,6,25,'계란말이요','2025-02-20 03:41:21'),(17,6,25,'기염뽀쨕','2025-02-20 03:43:43'),(18,6,25,'기염뽀쨕','2025-02-20 03:44:55'),(19,6,25,'기염뽀쨕','2025-02-20 03:45:06'),(20,6,25,'기염뽀쨕','2025-02-20 03:49:46'),(21,6,25,'기염뽀쨕','2025-02-20 03:50:18'),(22,6,25,'기염뽀쨕','2025-02-20 03:50:34'),(23,6,25,'기염뽀쨕','2025-02-20 03:50:36'),(24,6,25,'기염뽀쨕','2025-02-20 03:50:36'),(25,6,25,'기염뽀쨕','2025-02-20 03:50:36'),(26,6,25,'기염뽀쨕','2025-02-20 03:50:36'),(27,6,25,'기염뽀쨕','2025-02-20 03:50:42'),(28,6,25,'다희는바보야','2025-02-20 04:08:18'),(29,6,25,'다희는바보야','2025-02-20 04:08:20'),(30,6,25,'다희는바보야','2025-02-20 04:08:23'),(31,6,25,'다희는바보야','2025-02-20 04:08:29'),(32,6,25,'다희는바보야','2025-02-20 04:08:54'),(33,6,25,'다희는바보야','2025-02-20 04:09:49'),(34,6,25,'다희는바보야','2025-02-20 04:10:03'),(35,6,25,'다희는바보야','2025-02-20 04:11:18'),(36,6,25,'다희는바보야','2025-02-20 04:11:51'),(37,6,25,'다희는바보야','2025-02-20 04:13:10'),(38,6,25,'다희는바보야','2025-02-20 04:16:35'),(39,6,25,'다희는바보야','2025-02-20 04:17:32'),(40,6,25,'다희는바보야','2025-02-20 04:25:00'),(41,6,25,'다희는바보야','2025-02-20 04:25:13'),(42,6,25,'다희는바보야','2025-02-20 04:26:14'),(43,6,25,'다희는바보야','2025-02-20 04:32:05'),(44,6,25,'다희는바보야','2025-02-20 04:32:14'),(45,1,52,'이런게 바로 루프스테이션?!?','2025-02-20 13:45:45'),(46,1,46,'너무 신나는 비트네요! ㅎ','2025-02-20 13:48:18'),(47,4,50,'대박대박~!','2025-02-20 14:13:13'),(48,7,50,'각자의 장소에서...,,, 이렇게 멋찐 !! 합주라니 ^^ 세상.. 참 좋아졌읍니다...~~','2025-02-20 14:13:33'),(49,6,50,'보컬이 들어가면 더 좋을 듯요 ^^!','2025-02-20 14:14:32'),(50,2,50,'베이스 연주자분 메세지 드렸습니다!! 확인 한번만 부탁드려요~!~!!','2025-02-20 14:20:41');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21  9:55:43
