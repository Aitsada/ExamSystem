SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `SeatMapping`;
DROP TABLE IF EXISTS `Seat`;
DROP TABLE IF EXISTS `SeatRow`;
DROP TABLE IF EXISTS `Room`;
DROP TABLE IF EXISTS `Applicant`;
DROP TABLE IF EXISTS `Floor`;
DROP TABLE IF EXISTS `Position`;
DROP TABLE IF EXISTS `Building`;
DROP TABLE IF EXISTS `Exam`;
DROP TABLE IF EXISTS `Facility`;
DROP TABLE IF EXISTS `Organization`;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE `Organization` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` VARCHAR(50) NULL,
  `LastModifiedDateTime` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `LastModifiedBy` VARCHAR(50) NULL,

  `Name` VARCHAR(200) NOT NULL,
  `Description` VARCHAR(2000) NULL,
  `Logo` varbinary(max) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `Facility` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `CreatedDateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` INT NULL,
  `LastModifiedDateTime` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `LastModifiedBy` INT NULL,

  `Name` VARCHAR(255) NOT NULL,
  `Description` TEXT NULL,
  `DisplayName` VARCHAR(255) NULL,
  `IsActive` BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `Exam` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `CreatedDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` INT NULL,
  `LastModifiedDateTime` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `LastModifiedBy` INT NULL,

  `OrganizationID` INT NOT NULL,
  `Name` VARCHAR(255) NOT NULL,
  `StatusID` INT NULL,
  `StartDateTime` DATETIME NOT NULL,
  `EndDateTime` DATETIME NULL,

  INDEX `idx_exam_organization_id` (`OrganizationID`),

  CONSTRAINT `fk_exam_organization`
    FOREIGN KEY (`OrganizationID`)
    REFERENCES `Organization` (`id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `Building` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `CreatedDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` INT NULL,
  `LastModifiedDateTime` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `LastModifiedBy` INT NULL,

  `FacilityID` INT NOT NULL,
  `Name` VARCHAR(255) NOT NULL,
  `Alias` VARCHAR(100) NULL,
  `Description` TEXT NULL,
  `IsActive` BOOLEAN NOT NULL DEFAULT TRUE,

  INDEX `idx_building_facility_id` (`FacilityID`),

  CONSTRAINT `fk_building_facility`
    FOREIGN KEY (`FacilityID`)
    REFERENCES `Facility` (`id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `Position` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `CreatedDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` INT NULL,
  `LastModifiedDateTime` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `LastModifiedBy` INT NULL,

  `ExamID` INT NOT NULL,
  `Number` INT NOT NULL,
  `Name` VARCHAR(255) NOT NULL,
  `Description` TEXT NULL,

  INDEX `idx_position_exam_id` (`ExamID`),

  CONSTRAINT `fk_position_exam`
    FOREIGN KEY (`ExamID`)
    REFERENCES `Exam` (`id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `Floor` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `CreatedDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` INT NULL,
  `LastModifiedDateTime` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `LastModifiedBy` INT NULL,

  `BuildingID` INT NOT NULL,
  `Number` INT NOT NULL,
  `Name` VARCHAR(255) NULL,
  `Description` TEXT NULL,
  `IsActive` BOOLEAN NOT NULL DEFAULT TRUE,

  INDEX `idx_floor_building_id` (`BuildingID`),

  CONSTRAINT `fk_floor_building`
    FOREIGN KEY (`BuildingID`)
    REFERENCES `Building` (`id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `Applicant` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `CreatedDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` INT NULL,
  `LastModifiedDateTime` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `LastModifiedBy` INT NULL,

  `PositionID` INT NOT NULL,
  `Prefix` VARCHAR(50) NULL,
  `FirstName` VARCHAR(100) NOT NULL,
  `LastName` VARCHAR(100) NOT NULL,
  `ApplicantNumber` VARCHAR(50) NOT NULL,
  `CitizenNumber` VARCHAR(13) NOT NULL,
  `SeatRow` VARCHAR(50) NULL,

  INDEX `idx_applicant_position_id` (`PositionID`),

  CONSTRAINT `fk_applicant_position`
    FOREIGN KEY (`PositionID`)
    REFERENCES `Position` (`id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `Room` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `CreatedDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` INT NULL,
  `LastModifiedDateTime` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `LastModifiedBy` INT NULL,

  `FloorID` INT NOT NULL,
  `No` VARCHAR(50) NOT NULL,
  `Name` VARCHAR(255) NOT NULL,
  `Description` TEXT NULL,
  `Rows` INT NOT NULL,
  `Columns` INT NOT NULL,
  `TemplateID` INT NULL,
  `IsActive` BOOLEAN NOT NULL DEFAULT TRUE,

  INDEX `idx_room_floor_id` (`FloorID`),

  CONSTRAINT `fk_room_floor`
    FOREIGN KEY (`FloorID`)
    REFERENCES `Floor` (`id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `SeatRow` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `CreatedDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` INT NULL,
  `LastModifiedDateTime` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `LastModifiedBy` INT NULL,

  `RoomID` INT NOT NULL,
  `Name` VARCHAR(50) NOT NULL,
  `Description` TEXT NULL,

  INDEX `idx_seatrow_room_id` (`RoomID`),

  CONSTRAINT `fk_seatrow_room`
    FOREIGN KEY (`RoomID`)
    REFERENCES `Room` (`id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `Seat` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `CreatedDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` INT NULL,
  `LastModifiedDateTime` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `LastModifiedBy` INT NULL,

  `SeatRowID` INT NOT NULL,
  `Name` VARCHAR(50) NOT NULL,
  `Description` TEXT NULL,

  INDEX `idx_seat_seatrow_id` (`SeatRowID`),

  CONSTRAINT `fk_seat_seatrow`
    FOREIGN KEY (`SeatRowID`)
    REFERENCES `SeatRow` (`id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `SeatMapping` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `CreatedDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CreatedBy` INT NULL,
  `LastModifiedDateTime` DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `LastModifiedBy` INT NULL,

  `SeatID` INT NOT NULL,
  `ApplicantID` INT NOT NULL,

  INDEX `idx_seatmapping_seat_id` (`SeatID`),
  INDEX `idx_seatmapping_applicant_id` (`ApplicantID`),

  CONSTRAINT `fk_seatmapping_seat`
    FOREIGN KEY (`SeatID`)
    REFERENCES `Seat` (`id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT `fk_seatmapping_applicant`
    FOREIGN KEY (`ApplicantID`)
    REFERENCES `Applicant` (`id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;