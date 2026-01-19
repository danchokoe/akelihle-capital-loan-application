-- Akelihle Capital Database Schema
-- Import this file into your cPanel MySQL database

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Database: akelihle_capital

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `LoanApplication`
--

CREATE TABLE `LoanApplication` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employmentStatus` enum('EMPLOYED','SELF_EMPLOYED','UNEMPLOYED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `companyName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monthlyIncome` decimal(10,2) NOT NULL,
  `loanAmount` decimal(10,2) NOT NULL,
  `loanTerm` int NOT NULL,
  `loanPurpose` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `interestRate` decimal(5,2) NOT NULL,
  `repaymentFee` decimal(10,2) NOT NULL,
  `totalRepayment` decimal(10,2) NOT NULL,
  `idDocument` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proofOfResidence` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proofOfSalary` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `contractSent` tinyint(1) NOT NULL DEFAULT '0',
  `contractDate` datetime(3) DEFAULT NULL,
  `applicationDate` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `AuditLog`
--

CREATE TABLE `AuditLog` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applicationId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `changedBy` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CommunicationLog`
--

CREATE TABLE `CommunicationLog` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applicationId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contentSnippet` text COLLATE utf8mb4_unicode_ci,
  `sentAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `LoanApplication`
--
ALTER TABLE `LoanApplication`
  ADD PRIMARY KEY (`id`),
  ADD KEY `LoanApplication_userId_fkey` (`userId`);

--
-- Indexes for table `AuditLog`
--
ALTER TABLE `AuditLog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `AuditLog_applicationId_fkey` (`applicationId`);

--
-- Indexes for table `CommunicationLog`
--
ALTER TABLE `CommunicationLog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `CommunicationLog_applicationId_fkey` (`applicationId`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `LoanApplication`
--
ALTER TABLE `LoanApplication`
  ADD CONSTRAINT `LoanApplication_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `AuditLog`
--
ALTER TABLE `AuditLog`
  ADD CONSTRAINT `AuditLog_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `LoanApplication` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `CommunicationLog`
--
ALTER TABLE `CommunicationLog`
  ADD CONSTRAINT `CommunicationLog_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `LoanApplication` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;