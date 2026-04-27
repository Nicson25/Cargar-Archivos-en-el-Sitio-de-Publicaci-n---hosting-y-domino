-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: maisonsabor
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Café y bebidas calientes'),(2,'Bebida frias sin cafe'),(3,'Panaderia y pasteleria'),(4,'Snacks y acompañamiento');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `cajero_id` int DEFAULT NULL,
  `tipo` enum('presencial','domicilio') DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `metodo_pago` varchar(50) DEFAULT NULL,
  `numero_pedido` varchar(50) DEFAULT NULL,
  `estado` enum('pendiente','pagado','cancelado') DEFAULT 'pagado',
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_pedido` (`numero_pedido`),
  KEY `cliente_id` (`cliente_id`),
  KEY `cajero_id` (`cajero_id`),
  CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `usuario` (`id`),
  CONSTRAINT `pedido_ibfk_2` FOREIGN KEY (`cajero_id`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (1,NULL,NULL,'presencial',46400.00,'2026-03-11 01:02:39','efectivo',NULL,'pagado'),(2,NULL,NULL,'presencial',35468.00,'2026-03-11 02:12:11','nequi',NULL,'pagado'),(3,NULL,NULL,'presencial',41500.00,'2026-03-11 04:34:26','nequi',NULL,'pagado'),(4,NULL,NULL,'presencial',28468.00,'2026-03-11 04:42:50','nequi',NULL,'pagado'),(5,NULL,NULL,'presencial',33936.00,'2026-03-11 04:44:14','nequi',NULL,'pagado'),(6,NULL,NULL,'presencial',11100.00,'2026-03-11 04:50:18','nequi',NULL,'pagado'),(7,NULL,NULL,'presencial',10000.00,'2026-03-11 05:04:46','nequi',NULL,'pagado'),(8,NULL,NULL,'presencial',10000.00,'2026-03-11 05:21:22','nequi',NULL,'pagado'),(9,NULL,NULL,'presencial',28468.00,'2026-03-11 05:29:52','nequi',NULL,'pagado'),(10,NULL,NULL,'domicilio',7800.00,'2026-03-21 23:17:16','efectivo',NULL,'pagado'),(11,NULL,NULL,'domicilio',7800.00,'2026-03-21 23:17:46','efectivo',NULL,'pagado'),(12,NULL,NULL,'domicilio',7800.00,'2026-03-21 23:18:41','efectivo',NULL,'pagado'),(13,NULL,NULL,'domicilio',7800.00,'2026-03-21 23:19:39','efectivo',NULL,'pagado'),(14,NULL,NULL,'domicilio',7800.00,'2026-03-21 23:25:14','efectivo',NULL,'pagado'),(15,NULL,NULL,'domicilio',7800.00,'2026-03-21 23:26:37','efectivo',NULL,'pagado'),(16,NULL,NULL,'domicilio',7800.00,'2026-03-21 23:28:28','efectivo',NULL,'pagado'),(17,NULL,NULL,'domicilio',7800.00,'2026-03-22 02:46:30','efectivo',NULL,'pagado'),(18,NULL,NULL,'domicilio',7800.00,'2026-03-22 03:03:00','efectivo',NULL,'pagado'),(19,NULL,NULL,'domicilio',7800.00,'2026-03-22 03:18:57','efectivo',NULL,'pagado'),(20,NULL,NULL,'domicilio',7800.00,'2026-03-22 03:23:27','efectivo',NULL,'pagado'),(21,NULL,NULL,'domicilio',7800.00,'2026-03-22 03:23:38','efectivo',NULL,'pagado'),(22,NULL,NULL,'domicilio',7800.00,'2026-03-22 03:24:20','efectivo',NULL,'pagado');
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_detalle`
--

DROP TABLE IF EXISTS `pedido_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_detalle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pedido_id` int DEFAULT NULL,
  `producto` varchar(100) DEFAULT NULL,
  `producto_id` int DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `pedido_detalle_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedido` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pedido_detalle_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_detalle`
--

LOCK TABLES `pedido_detalle` WRITE;
/*!40000 ALTER TABLE `pedido_detalle` DISABLE KEYS */;
INSERT INTO `pedido_detalle` VALUES (1,1,'Café helado',2,8900.00,1),(2,1,'Café dalgona',1,7500.00,1),(3,1,'Brazo de reina',8,30000.00,1),(4,2,'Bowl saludable',10,23000.00,1),(5,2,'Galleta 5 granos',11,5468.00,1),(6,2,'Merenguitos',12,7000.00,1),(7,3,'Brazo de reina',8,30000.00,1),(8,3,'Genovesa',9,11500.00,1),(9,4,'Galleta 5 granos',11,5468.00,1),(10,4,'Bowl saludable',10,23000.00,1),(11,5,'Galleta 5 granos',11,5468.00,2),(12,5,'Bowl saludable',10,23000.00,1),(13,6,'Jarra de whisky y jengibre',6,5600.00,1),(14,6,'Macchiato de caramelo helado',5,5500.00,1),(15,7,'Té helado de romero y naranja',4,4500.00,1),(16,7,'Macchiato de caramelo helado',5,5500.00,1),(17,8,'Té helado de romero y naranja',4,4500.00,1),(18,8,'Macchiato de caramelo helado',5,5500.00,1),(19,9,'Bowl saludable',10,23000.00,1),(20,9,'Galleta 5 granos',11,5468.00,1),(21,10,'Café dalgona',1,7800.00,1),(22,11,'Café dalgona',1,7800.00,1),(23,12,'Café dalgona',1,7800.00,1),(24,13,'Café dalgona',1,7800.00,1),(25,14,'Café dalgona',1,7800.00,1),(26,15,'Café dalgona',1,7800.00,1),(27,16,'Café dalgona',1,7800.00,1),(28,17,'Café dalgona',1,7800.00,1),(29,18,'Café dalgona',1,7800.00,1),(30,19,'Café dalgona',1,7800.00,1),(31,20,'Café dalgona',1,7800.00,1),(32,21,'Café dalgona',1,7800.00,1),(33,22,'Café dalgona',1,7800.00,1);
/*!40000 ALTER TABLE `pedido_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `stock` int DEFAULT '0',
  `categoria_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Café dalgona',7800.00,'cafedalgona.jpg',26,1),(2,'Café helado',8900.00,'cafehelado.jpg',39,1),(3,'Café espresso',4800.00,'cafeespreso.jpg',40,1),(4,'Té helado de romero y naranja',5500.00,'teheladoromeronaranja.jpg',38,2),(5,'Macchiato de caramelo helado',5500.00,'macchiato.jpg',37,2),(6,'Jarra de whisky y jengibre',5600.00,'whiskyjengibre.jpg',39,2),(7,'Mojito de bocadillo',4800.00,'mojitobocadillo.jpg',40,3),(8,'Brazo de reina',30000.00,'brazoreina.jpg',38,3),(9,'Genovesa',11500.00,'genovesa.jpg',39,3),(10,'Bowl saludable',23000.00,'bowl.jpeg',36,4),(11,'Galleta 5 granos',5468.00,'galleta5granos.jpg',35,4),(12,'Merenguitos',7000.00,'merenguitos.jpg',39,4);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (3,'administrador'),(2,'cajero'),(1,'cliente');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `rol_id` int NOT NULL DEFAULT '1',
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Cajera I','Principal','cajera1@mainsonsabor.com','local','0000000000',2,'$2b$10$kCMwkKrMsianS9PkGZ/yKuG4VchLT89ptyPzMNjLSniuojlVFSLY6'),(2,'Administrador','Sistema','admin@mainsonsabor.com','Oficina','0000000000',3,'$2b$10$aZib6TT.WAsw5/PdgL9cRexqPG9Km3ZYe6TKEROKp63JVRAVVnp0y'),(3,'Iori','Prueba','prueba@gmail.com','calle 3 4 5','3214567898',1,'$2b$10$yBOHaGeozB4vth58BOTxiuOVwHwgBNnXUiCsQ0z9KHf2SyvERHQ7C');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-25 16:04:40
