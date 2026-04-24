CREATE TYPE "public"."statut_contrat" AS ENUM('brouillon', 'envoye', 'signe', 'resilie');--> statement-breakpoint
CREATE TYPE "public"."statut_prospect" AS ENUM('nouveau', 'contacte', 'en_cours', 'converti', 'perdu');--> statement-breakpoint
CREATE TYPE "public"."type_contrat" AS ENUM('location_courte', 'mise_a_disposition');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contrats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prospect_id" uuid NOT NULL,
	"distributeur_id" uuid,
	"type" "type_contrat" NOT NULL,
	"statut" "statut_contrat" DEFAULT 'brouillon' NOT NULL,
	"date_debut" timestamp NOT NULL,
	"date_fin" timestamp,
	"pdf_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "distributeurs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" text NOT NULL,
	"adresse" text NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"prospect_id" uuid,
	"statut" text DEFAULT 'actif' NOT NULL,
	"actif" boolean DEFAULT true NOT NULL,
	"installe_le" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "metriques" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"distributeur_id" uuid NOT NULL,
	"type" text NOT NULL,
	"valeur" real NOT NULL,
	"unite" text,
	"alerte" boolean DEFAULT false NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prospects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nom" text NOT NULL,
	"email" text NOT NULL,
	"telephone" text,
	"entreprise" text NOT NULL,
	"adresse" text,
	"effectif" integer,
	"statut" "statut_prospect" DEFAULT 'nouveau' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "prospects_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "relances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prospect_id" uuid NOT NULL,
	"type" text NOT NULL,
	"statut" text DEFAULT 'planifie' NOT NULL,
	"date_planifiee" timestamp NOT NULL,
	"date_realisee" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contrats" ADD CONSTRAINT "contrats_prospect_id_prospects_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contrats" ADD CONSTRAINT "contrats_distributeur_id_distributeurs_id_fk" FOREIGN KEY ("distributeur_id") REFERENCES "public"."distributeurs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distributeurs" ADD CONSTRAINT "distributeurs_prospect_id_prospects_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metriques" ADD CONSTRAINT "metriques_distributeur_id_distributeurs_id_fk" FOREIGN KEY ("distributeur_id") REFERENCES "public"."distributeurs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relances" ADD CONSTRAINT "relances_prospect_id_prospects_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;