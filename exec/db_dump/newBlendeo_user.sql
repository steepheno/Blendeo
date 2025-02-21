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
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nickname` varchar(30) DEFAULT NULL,
  `profile_image` text,
  `push_alarm` tinyint DEFAULT NULL,
  `provider_id` varchar(50) DEFAULT NULL,
  `provider` varchar(50) DEFAULT NULL,
  `header` text,
  `intro` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'blendeo.ssafy@gmail.com','$2a$10$EDMn7rJqbdxCSgGZF4AoR.qax5KtCUk.K.itQn5Rka6TmKgMz.kaW','블렌디오','https://blendeo-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/image_3fe56643-928f-449b-af99-694fe80825b7.jpeg',NULL,NULL,NULL,'https://blendeo-s3-bucket.s3.ap-northeast-2.amazonaws.com/header/image_0aad02b2-dd2f-4cde-bcb5-f371126eda4d.jpeg','안녕하세요. 시대를 변화시키는 블랜디오입니다! ㅎㅎ'),(2,'dlacowns21@naver.com','$2a$10$cC9z0a3Q3TuPyKttTvTkyOSj6buHoDxI1CAAtf2aNx2YQ92yaBniW','둠치퐉취두둠팍','https://blendeo-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/image_68481c34-cffd-4f20-91bc-93597ccd231d.jpeg',NULL,NULL,NULL,NULL,'안녕하세요!! 베이스 유망주입니다!!!'),(4,'rjs7289@naver.com','$2a$10$WKKhpDDCS4EInW5tU/H9Lu9rSoGbykpc.vog.q8ivdvrj6tBa84RG','베이스럼','https://blendeo-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/image_275b5a35-d741-4059-a4dd-5f97fe02bfe6.jpeg',NULL,NULL,NULL,NULL,'하이루'),(5,'ms9648@naver.com','$2a$10$MQftT6OiwP6zsoGxRvEfae7po45VQcQ9tfRHyKeyQFopB8PwEgcGO','까망베르베르','https://blendeo-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/image_ed253f0f-0a68-4537-a40d-1c575d504c1a.jpeg',NULL,NULL,NULL,NULL,'그거 아세요? 귤에 붙어있는 하얀거 이름은 귤락입니다아\r\n찰떡아이스는 세 알이었고, 하와이안 피자는 케나다에서 만들어쬬'),(6,'ekgml3219@naver.com','$2a$10$SiAOQlN1iUUZVvssImA90.JVp6P8V3yuZ1TPZOhkDvD7Qpipy1aIy','판콜','https://blendeo-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/image_9a18310d-e0d9-4665-8c24-02ac24dc85ec.jpeg',NULL,NULL,NULL,NULL,NULL),(7,'bin5459@naver.com','$2a$10$Bn9xo02NYYoh3Ed5idjGreHVp2p1jdc/JlN6I3w3y1wSNQA5c10fO','zㅣ존 기타 마스터','https://blendeo-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/image_c08a2798-b191-4b9f-a430-f6c74838ebb2.jpeg',NULL,NULL,NULL,NULL,'기타 잘 칩니다 ^^'),(8,'limchaejun21@gmail.com','$2a$10$RsJWh.b1wYjEtfXUpvUYoOkQx9Y1xZijehr56Ao4244E.MyQ484Ui','Limchaejun',NULL,NULL,NULL,NULL,NULL,NULL),(10,'kyjjulia07@gmail.com','$2a$10$iGM1TnCFzbBtpB9OfXBMduMhMb5mCFvfGa6iUYdrdbZmQ8e485HVq','아리아나',NULL,NULL,NULL,NULL,NULL,NULL),(11,'rjs7289@gmail.com','$2a$10$SXEiJ8P25WCKCnnD//WUO.k9Y74L9oyE3RoKBoQeOyqwYvo0gyIfi','JS',NULL,NULL,NULL,NULL,NULL,NULL),(12,'ms9648@uos.ac.kr','$2a$10$AkiK1BeXvc44NmJajgT1XuUd.zTK.K4RIrwnyqJZANHNq4EQBVEmm','마루킁킁',NULL,NULL,NULL,NULL,NULL,NULL),(15,'jsr2198@gmail.com','$2a$10$nfuUqU7pONn2.c3tLPVATe9LwjTMbQf0lK.2dQNrVgVo6VopRsfN.','Jsun',NULL,NULL,NULL,NULL,NULL,'하이'),(16,'kyjjulia07@naver.com','$2a$10$u9IiK2aDdrKaIsP7yMV9p.W2sPlQCUMYhb8GzPFE6AV2QrSbraaYS','유로스케','https://blendeo-s3-bucket.s3.ap-northeast-2.amazonaws.com/profile/image_fd291668-02b3-4a2d-a8a1-abbd8d4b78fe.jpeg',NULL,NULL,NULL,'https://blendeo-s3-bucket.s3.ap-northeast-2.amazonaws.com/header/image_9d710d71-4c2e-4608-9a87-b0bdffb52e73.jpeg',NULL),(17,'foxy0423@naver.com','$2a$10$ylKSvFObqq.dMBraSrCErOxO3X0eF57H6U9Qrw3Kkry8/e46CraRy','rlagustn0423',NULL,NULL,NULL,NULL,NULL,NULL),(19,'ekgml3219@gmail.com','$2a$10$GBsBJ50zYRz.tXHIE0iMeO4ZcK5GZvKsOzu1Hk1FKplTnzmc.KPHa','코코빵떡',NULL,NULL,NULL,NULL,NULL,NULL),(20,'pww1101@gmail.com','$2a$10$oS9W5TDZQxorzMbp1gXkU.HPbTZVVue0IOeWn4V6xNEetLWT0X2PK','supernova',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
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
