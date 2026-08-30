CREATE TABLE `ecosystem_components` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(80) NOT NULL,
	`name` varchar(120) NOT NULL,
	`role` text NOT NULL,
	`status` enum('VERIFIED','PREPARED','ROADMAP','NOT_VERIFIED') NOT NULL,
	`repositoryUrl` varchar(500),
	`surfaceUrl` varchar(500),
	`boundary` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ecosystem_components_id` PRIMARY KEY(`id`),
	CONSTRAINT `ecosystem_components_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `evidence_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`title` varchar(180) NOT NULL,
	`kind` varchar(60) NOT NULL,
	`status` enum('VERIFIED','PREPARED','ROADMAP','NOT_VERIFIED') NOT NULL,
	`summary` text NOT NULL,
	`commitSha` varchar(80),
	`checksum` varchar(128),
	`releaseTag` varchar(80),
	`sourceUrl` varchar(500),
	`artifactUrl` varchar(500),
	`observedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `evidence_records_id` PRIMARY KEY(`id`),
	CONSTRAINT `evidence_records_slug_unique` UNIQUE(`slug`)
);
