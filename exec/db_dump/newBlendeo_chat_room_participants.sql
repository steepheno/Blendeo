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
-- Table structure for table `chat_room_participants`
--

DROP TABLE IF EXISTS `chat_room_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room_participants` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `chat_room_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `chat_room_id` (`chat_room_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `chat_room_participants_ibfk_1` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_rooms` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_room_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room_participants`
--

LOCK TABLES `chat_room_participants` WRITE;
/*!40000 ALTER TABLE `chat_room_participants` DISABLE KEYS */;
INSERT INTO `chat_room_participants` VALUES (1,1,2,'2025-02-19 06:33:11'),(2,1,1,'2025-02-19 06:33:11'),(3,2,4,'2025-02-19 06:44:13'),(4,2,1,'2025-02-19 06:44:13'),(5,3,2,'2025-02-19 06:44:58'),(6,3,5,'2025-02-19 06:44:58'),(7,4,5,'2025-02-19 06:45:01'),(8,4,1,'2025-02-19 06:45:01'),(9,5,5,'2025-02-20 03:18:39'),(10,5,6,'2025-02-20 03:18:39'),(11,6,4,'2025-02-20 11:23:10'),(12,6,6,'2025-02-20 11:23:10'),(13,7,1,'2025-02-20 13:53:18'),(14,7,6,'2025-02-20 13:53:18'),(15,8,1,'2025-02-20 14:50:23'),(16,8,16,'2025-02-20 14:50:23'),(17,9,6,'2025-02-20 18:50:00'),(18,9,7,'2025-02-20 18:50:00'),(19,9,5,'2025-02-20 18:50:00'),(20,9,16,'2025-02-20 18:50:00'),(21,9,2,'2025-02-20 18:50:00'),(22,9,4,'2025-02-20 18:50:00'),(23,10,7,'2025-02-20 18:57:22'),(24,10,20,'2025-02-20 18:57:22'),(25,11,6,'2025-02-20 19:12:28'),(26,11,19,'2025-02-20 19:12:28');
/*!40000 ALTER TABLE `chat_room_participants` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21  9:55:40
