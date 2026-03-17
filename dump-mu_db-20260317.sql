-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: mu_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `mu_tb_customer`
--

DROP TABLE IF EXISTS `mu_tb_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mu_tb_customer` (
  `cus_no` int NOT NULL AUTO_INCREMENT COMMENT '고객번호',
  `cus_nm` varchar(255) NOT NULL COMMENT '고객성명',
  `cus_phone` varchar(20) NOT NULL COMMENT '전화번호',
  `cus_chnnel` varchar(50) DEFAULT NULL COMMENT '문의채널',
  `reg_nm` varchar(100) DEFAULT NULL COMMENT '등록자',
  `reg_date` datetime DEFAULT NULL COMMENT '등록알자',
  `upd_date` datetime DEFAULT NULL COMMENT '수정일자',
  `upd_nm` varchar(100) DEFAULT NULL COMMENT '수정자',
  PRIMARY KEY (`cus_no`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb3 COMMENT='고객정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mu_tb_customer`
--

LOCK TABLES `mu_tb_customer` WRITE;
/*!40000 ALTER TABLE `mu_tb_customer` DISABLE KEYS */;
INSERT INTO `mu_tb_customer` VALUES (1,'권고객','01099073962','C1','테스트','2025-04-08 12:12:02','2025-04-08 12:12:02',NULL),(11,'','','C1','무릉방앗간','2025-04-09 12:26:33','2025-04-09 12:26:33','무릉방앗간'),(12,'하하하','0105555555','C1','무릉방앗간','2025-04-11 15:24:10','2025-04-11 15:24:10','무릉방앗간'),(13,'fffff','0102232323','C4','무릉방앗간','2025-04-11 16:30:30','2025-04-11 16:30:30','무릉방앗간'),(14,'','ㄴㅇㄴㅇ','C3','무릉방앗간','2025-04-12 04:15:18','2025-04-12 04:15:18','무릉방앗간'),(15,'ㅌㅊ','0102223232323','C1','무릉방앗간','2025-04-12 04:37:59','2025-04-12 04:37:59','무릉방앗간'),(16,'김김고객','0101111111','C3','무릉방앗간','2025-04-12 04:52:15','2025-04-12 04:52:15','무릉방앗간'),(17,'김김고객','01011111111','C3','무릉방앗간','2025-04-12 04:53:11','2025-04-12 04:53:11','무릉방앗간'),(18,'dsfsdf','0112323','C1','무릉방앗간','2025-04-16 03:23:13','2025-04-16 03:23:13','무릉방앗간'),(19,'차니','010555666777','C2','무릉방앗간','2025-04-18 04:04:59','2025-04-18 04:04:59','무릉방앗간'),(22,'궈','234213123','C1','무릉방앗간','2025-04-19 22:02:58','2025-04-19 22:02:58','무릉방앗간'),(23,'하하','01033334444','C1','무릉방앗간','2025-04-20 21:32:57','2025-04-20 21:32:57','무릉방앗간'),(24,'하하하하','01022341233','C1','무릉방앗간','2025-04-22 07:24:16','2025-04-22 07:24:16','무릉방앗간'),(25,'ddd','01099933333',NULL,'무릉방앗간','2025-04-22 16:49:51','2025-04-22 16:49:51','무릉방앗간'),(26,'권봉찬','01099063962223',NULL,'무릉방앗간','2025-04-22 17:22:39','2025-04-22 17:22:39','무릉방앗간'),(27,'하하하','01011112222',NULL,'무릉방앗간','2025-04-22 17:31:07','2025-04-22 17:31:07','무릉방앗간'),(28,'이지상','01033214431',NULL,'무릉방앗간','2026-03-16 16:06:18','2026-03-16 16:06:18','무릉방앗간'),(29,'구글1','01044449910',NULL,'무릉방앗간','2026-03-16 16:29:31','2026-03-16 16:29:31','무릉방앗간'),(30,'하하하','01071234213',NULL,'무릉방앗간','2026-03-16 16:32:35','2026-03-16 16:32:35','무릉방앗간'),(31,'DSAD','01013223423',NULL,'무릉방앗간','2026-03-16 16:35:13','2026-03-16 16:35:13','무릉방앗간');
/*!40000 ALTER TABLE `mu_tb_customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mu_tb_file`
--

DROP TABLE IF EXISTS `mu_tb_file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mu_tb_file` (
  `file_id` int NOT NULL AUTO_INCREMENT COMMENT '파일id',
  `orig_nm` varchar(255) NOT NULL COMMENT '원본 파일명',
  `stored_path` varchar(512) NOT NULL COMMENT '서버 저장 경로',
  `fsize` bigint NOT NULL COMMENT '파일 크기',
  `mime_type` varchar(100) DEFAULT NULL COMMENT 'MIME 타입',
  `server_nm` varchar(100) NOT NULL COMMENT '서버 파일명',
  `reg_date` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT '등록일자',
  `reg_nm` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT '등록자',
  `upd_date` varchar(100) DEFAULT NULL COMMENT '수정일자',
  `upd_nm` varchar(100) DEFAULT NULL COMMENT '수정자',
  `ref_no` int NOT NULL COMMENT '참조번호',
  PRIMARY KEY (`file_id`),
  KEY `mu_tb_file_mu_tb_order_FK` (`ref_no`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mu_tb_file`
--

LOCK TABLES `mu_tb_file` WRITE;
/*!40000 ALTER TABLE `mu_tb_file` DISABLE KEYS */;
INSERT INTO `mu_tb_file` VALUES (27,'eImg0','C:\\dev\\upload\\20250420\\c37c6473-a4e4-4016-8251-9a02cd5a7702_eImg0_20250420065626491',230151,'application/octet-stream','c37c6473-a4e4-4016-8251-9a02cd5a7702_eImg0_20250420065626491','2025-04-19 21:56:27','무릉방앗간',NULL,NULL,12),(28,'eImg1','C:\\dev\\upload\\20250420\\03461a63-4d09-42eb-8e3e-f899c6f366b0_eImg1_20250420065626768',212874,'image/jpeg','03461a63-4d09-42eb-8e3e-f899c6f366b0_eImg1_20250420065626768','2025-04-19 21:56:27','무릉방앗간',NULL,NULL,12),(32,'eImg0','C:\\dev\\upload\\20250420\\1ad8efb8-7494-4511-808a-2dc4ec1abbc1_eImg0_20250420070324876',212874,'application/octet-stream','1ad8efb8-7494-4511-808a-2dc4ec1abbc1_eImg0_20250420070324876','2025-04-19 22:03:25','무릉방앗간',NULL,NULL,18),(33,'eImg1','C:\\dev\\upload\\20250420\\d44a1b57-7f8a-4545-9833-fdac9bc74952_eImg1_20250420070325130',212874,'application/octet-stream','d44a1b57-7f8a-4545-9833-fdac9bc74952_eImg1_20250420070325130','2025-04-19 22:03:25','무릉방앗간',NULL,NULL,18),(34,'eImg2','C:\\dev\\upload\\20250420\\165149d7-9e5c-4e2a-a0bb-d586536b12e1_eImg2_20250420070325384',212874,'application/octet-stream','165149d7-9e5c-4e2a-a0bb-d586536b12e1_eImg2_20250420070325384','2025-04-19 22:03:26','무릉방앗간',NULL,NULL,18),(35,'eImg0','C:\\dev\\upload\\20250421\\b9923f09-169a-409e-a62c-d3d988336553_eImg0_20250421063257216',227374,'image/jpeg','b9923f09-169a-409e-a62c-d3d988336553_eImg0_20250421063257216','2025-04-20 21:32:58','무릉방앗간',NULL,NULL,19),(40,'img0','C:\\dev\\upload\\20250422\\c5eb3b56-a981-4a3c-ab68-4905c9d7bd66_img0_20250422164951560',176796,'image/jpeg','c5eb3b56-a981-4a3c-ab68-4905c9d7bd66_img0_20250422164951560','2025-04-22 16:49:51','무릉방앗간',NULL,NULL,21),(41,'img0','\\var\\www\\html\\file/20250422/820c7c82-4a2d-409b-89aa-b663ea7ed1fb_img0_20250422082239287',176796,'image/jpeg','820c7c82-4a2d-409b-89aa-b663ea7ed1fb_img0_20250422082239287','2025-04-22 17:22:39','무릉방앗간',NULL,NULL,22),(46,'img0','\\home\\web\\mureung\\imageUpload\\20260316\\3fbd8455-6079-48ed-88f8-b1dd57bf4b5f_img0_20260316104932133',34937,'image/png','3fbd8455-6079-48ed-88f8-b1dd57bf4b5f_img0_20260316104932133','2026-03-16 10:49:32','무릉방앗간',NULL,NULL,25),(50,'img0','\\home\\web\\mureung\\imageUpload\\20260316\\ce94c6e2-4803-407a-ac2c-c8c45830b17e_img0_20260316140043561',34937,'application/octet-stream','ce94c6e2-4803-407a-ac2c-c8c45830b17e_img0_20260316140043561','2026-03-16 14:00:43','무릉방앗간',NULL,NULL,27),(54,'img0','\\home\\web\\mureung\\imageUpload\\20260317\\adf48a4c-23a0-4492-8d38-9690e8c4f7f2_img0_20260317141109180',69544,'image/png','adf48a4c-23a0-4492-8d38-9690e8c4f7f2_img0_20260317141109180','2026-03-17 14:11:09','무릉방앗간',NULL,NULL,39),(55,'img0','\\home\\web\\mureung\\imageUpload\\20260317\\0bd14c60-9b71-4bca-aab2-50770e1ca141_img0_20260317141329816',201403,'image/png','0bd14c60-9b71-4bca-aab2-50770e1ca141_img0_20260317141329816','2026-03-17 14:13:29','무릉방앗간',NULL,NULL,40);
/*!40000 ALTER TABLE `mu_tb_file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mu_tb_order`
--

DROP TABLE IF EXISTS `mu_tb_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mu_tb_order` (
  `order_no` int NOT NULL AUTO_INCREMENT COMMENT '주문번호',
  `prod_nm` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT '상품명',
  `conn` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT '상담내용',
  `con_date` datetime DEFAULT NULL COMMENT '상담일자',
  `ord_date` datetime NOT NULL COMMENT '주문일자',
  `reg_date` datetime NOT NULL COMMENT '등록일자',
  `reg_nm` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '등록자',
  `upd_date` datetime DEFAULT NULL COMMENT '수정일자',
  `upd_nm` varchar(100) DEFAULT NULL COMMENT '수정자',
  `cus_no` int NOT NULL COMMENT '고객번호',
  `comp_yn` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT '픽업여부',
  `pay_md` varchar(100) DEFAULT NULL COMMENT '결제수단',
  `pay_nt` varchar(100) DEFAULT NULL COMMENT '결제여부',
  `ord_amt` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT '기타금액',
  `ord_time` varchar(100) DEFAULT NULL COMMENT '픽업시간',
  `cus_chnnel` varchar(100) DEFAULT NULL COMMENT '주문채널',
  `ord_other_amt` varchar(100) DEFAULT NULL COMMENT '예약금',
  PRIMARY KEY (`order_no`),
  KEY `FK_mu_tb_customer_TO_mu_tb_order` (`cus_no`),
  CONSTRAINT `FK_mu_tb_customer_TO_mu_tb_order` FOREIGN KEY (`cus_no`) REFERENCES `mu_tb_customer` (`cus_no`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb3 COMMENT='주문정보';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mu_tb_order`
--

LOCK TABLES `mu_tb_order` WRITE;
/*!40000 ALTER TABLE `mu_tb_order` DISABLE KEYS */;
INSERT INTO `mu_tb_order` VALUES (33,'떡케이크 3종 세트','<p><img src=\"serverUrl\" width=\"253\" style=\"\"></p><p><br></p><p><br></p><p>하하하하하</p>','2026-03-17 10:33:00','2026-03-17 00:00:00','2026-03-17 10:33:46','무릉방앗간','2026-03-17 12:15:37','무릉방앗간',1,'Y','P1','N1','10000','12:00','C1',''),(34,'떡케이크 조회 테스트','<p><img src=\"serverUrl\"></p>','2026-03-17 11:34:00','2026-03-17 00:00:00','2026-03-17 11:34:20','무릉방앗간','2026-03-17 13:36:14','무릉방앗간',12,'Y','P1','N1','100000','11:00','C3','50000'),(35,'떡케이크','','2026-03-17 12:03:00','2026-03-17 00:00:00','2026-03-17 12:03:24','무릉방앗간','2026-03-17 13:33:16','무릉방앗간',1,'Y','P2','N1','100000','09:00','C1','10000'),(36,'떡케이크 3종세트','<p>123123</p>','2026-03-17 13:51:06','2026-03-17 00:00:00','2026-03-17 13:51:06','무릉방앗간','2026-03-17 13:51:06','무릉방앗간',1,'Y','P1','N1','90000','08:00','C1','40000'),(37,'떡케이크 3종세트','','2026-03-17 13:57:34','2026-03-17 00:00:00','2026-03-17 13:57:34','무릉방앗간','2026-03-17 13:57:34','무릉방앗간',12,'Y','P2','N1','50000','21:00','C3','20000'),(38,'떡케이크 3종세트','','2026-03-17 14:00:26','2026-03-17 00:00:00','2026-03-17 14:00:26','무릉방앗간','2026-03-17 14:00:26','무릉방앗간',1,'Y','P3','N2','1000000','17:00','C1','0'),(39,'떡케이크 만드자','<p><img src=\"serverUrl\"></p>','2026-03-17 14:10:00','2026-03-17 00:00:00','2026-03-17 14:10:38','무릉방앗간','2026-03-17 14:11:09','무릉방앗간',1,'Y','P1','N1','100000','11:00','C1','2000'),(40,'떡케이크','<p><img src=\"serverUrl\"></p><p>모바일이다ㅎ하하하하</p>','2026-03-17 14:13:29','2026-03-17 00:00:00','2026-03-17 14:13:29','무릉방앗간','2026-03-17 14:13:29','무릉방앗간',1,'Y','P2','N1','200000','09:00','C2','10000');
/*!40000 ALTER TABLE `mu_tb_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mu_tb_roles`
--

DROP TABLE IF EXISTS `mu_tb_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mu_tb_roles` (
  `id` varchar(100) NOT NULL,
  `roles` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mu_tb_roles`
--

LOCK TABLES `mu_tb_roles` WRITE;
/*!40000 ALTER TABLE `mu_tb_roles` DISABLE KEYS */;
INSERT INTO `mu_tb_roles` VALUES ('test','USER');
/*!40000 ALTER TABLE `mu_tb_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mu_tb_user`
--

DROP TABLE IF EXISTS `mu_tb_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mu_tb_user` (
  `id` varchar(100) NOT NULL,
  `pw` varchar(100) NOT NULL,
  `nm` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mu_tb_user`
--

LOCK TABLES `mu_tb_user` WRITE;
/*!40000 ALTER TABLE `mu_tb_user` DISABLE KEYS */;
INSERT INTO `mu_tb_user` VALUES ('test','test','무릉방앗간');
/*!40000 ALTER TABLE `mu_tb_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'mu_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-17 14:20:16
