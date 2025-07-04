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
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `notification_type` varchar(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_notice_sender` (`sender_id`),
  KEY `fk_notice_receiver` (`receiver_id`),
  CONSTRAINT `fk_notice_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_notice_sender` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,4,1,'joonsun님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-19 06:37:27'),(2,4,1,'joonsun님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-19 06:37:39'),(3,5,1,'파파보이님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-19 06:38:26'),(4,5,1,'파파보이님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-19 06:38:37'),(5,4,1,'joonsun님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-19 06:40:30'),(6,4,1,'joonsun님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-19 10:29:43'),(7,4,1,'joonsun님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-19 10:30:24'),(8,4,1,'joonsun님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-19 10:30:29'),(9,4,1,'joonsun님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-19 10:43:41'),(10,4,1,'joonsun님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-19 11:02:41'),(11,4,1,'joonsun님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-19 11:47:45'),(12,4,1,'joonsun님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-19 11:47:49'),(13,4,1,'joonsun님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-19 11:53:43'),(14,1,2,'블렌디오님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-19 16:06:46'),(15,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 01:16:57'),(16,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:06:23'),(17,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:30:20'),(18,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:30:31'),(19,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:39:55'),(20,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:40:03'),(21,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:40:06'),(22,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:40:06'),(23,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:41:16'),(24,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:41:21'),(25,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:43:44'),(26,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:44:55'),(27,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:45:06'),(28,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:49:46'),(29,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:50:18'),(30,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:50:34'),(31,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:50:36'),(32,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:50:36'),(33,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:50:36'),(34,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:50:36'),(35,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 03:50:42'),(36,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:08:18'),(37,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:08:20'),(38,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:08:23'),(39,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:08:29'),(40,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:08:54'),(41,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:09:49'),(42,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:10:03'),(43,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:11:18'),(44,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:11:51'),(45,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:13:10'),(46,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:16:35'),(47,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:17:32'),(48,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:25:00'),(49,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:25:13'),(50,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:26:14'),(51,6,5,'기염뽀짞님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 04:27:07'),(52,6,5,'기염뽀짞님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 04:31:59'),(53,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:32:05'),(54,6,5,'기염뽀짞님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 04:32:14'),(55,5,6,'파파보이님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 08:13:03'),(56,5,6,'파파보이님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 08:13:06'),(57,4,6,'joonsun님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 08:43:21'),(58,15,4,'Jsun님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 08:48:49'),(59,1,16,'블렌디오님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 13:45:45'),(60,1,16,'블렌디오님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 13:59:23'),(61,1,16,'블렌디오님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 13:59:29'),(62,2,16,'임채준님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 14:11:48'),(63,4,16,'joonsun님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 14:13:13'),(64,4,16,'joonsun님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 14:13:15'),(65,7,16,'원우바보님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 14:13:33'),(66,6,16,'판콜님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 14:14:32'),(67,2,16,'임채준님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 14:15:51'),(68,7,16,'zㅣ존 기타 마스터님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 14:15:51'),(69,5,16,'까망베르베르님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 14:17:17'),(70,2,16,'임채준님이 새로운 댓글을 다셨습니다.',0,'COMMENT','2025-02-20 14:20:41'),(71,1,16,'블렌디오님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 14:21:12'),(72,1,16,'블렌디오님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 14:31:31'),(73,1,16,'블렌디오님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 14:31:40'),(74,6,1,'판콜님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 18:06:06'),(75,6,1,'판콜님이 회원님의 게시물을 좋아합니다.',0,'LIKE','2025-02-20 18:10:13');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-21  9:55:45
