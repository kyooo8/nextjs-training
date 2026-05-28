CREATE TABLE `Owners` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`img_url` text,
	`introduction` text,
	`created_at` text
);
--> statement-breakpoint
CREATE TABLE `Profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`img_url` text NOT NULL,
	`introduction` text NOT NULL,
	`owner_id` text NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')),
	FOREIGN KEY (`owner_id`) REFERENCES `Owners`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `Reactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`owner_id` text NOT NULL,
	`profile_id` integer NOT NULL,
	`created_at` text DEFAULT (datetime('now', 'localtime')),
	FOREIGN KEY (`owner_id`) REFERENCES `Owners`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`profile_id`) REFERENCES `Profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `ViewLog` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profile_id` integer,
	`created_at` text,
	FOREIGN KEY (`profile_id`) REFERENCES `Profiles`(`id`) ON UPDATE no action ON DELETE no action
);
