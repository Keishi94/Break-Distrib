CREATE TYPE "public"."stage_opportunite" AS ENUM('decouverte', 'qualification', 'proposition', 'negociation', 'signe', 'perdu');--> statement-breakpoint
CREATE TYPE "public"."statut_arret" AS ENUM('a_faire', 'en_cours', 'fait', 'ignore');--> statement-breakpoint
CREATE TYPE "public"."statut_client" AS ENUM('actif', 'suspendu', 'archive');--> statement-breakpoint
CREATE TYPE "public"."statut_demande_contrat" AS ENUM('envoye', 'en_cours', 'signe', 'expire', 'annule');--> statement-breakpoint
CREATE TYPE "public"."statut_distributeur" AS ENUM('actif', 'maintenance', 'panne', 'inactif');--> statement-breakpoint
CREATE TYPE "public"."statut_tournee" AS ENUM('planifiee', 'en_cours', 'terminee', 'annulee');--> statement-breakpoint
CREATE TYPE "public"."type_intervention" AS ENUM('maintenance', 'reparation', 'reassort', 'installation', 'retrait');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'direction', 'commercial', 'technique');--> statement-breakpoint
CREATE TABLE "arrets_tournee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tournee_id" uuid NOT NULL,
	"distributeur_id" uuid NOT NULL,
	"ordre" integer NOT NULL,
	"statut" "statut_arret" DEFAULT 'a_faire' NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prospect_origine_id" uuid,
	"raison_sociale" text NOT NULL,
	"forme_juridique" text,
	"siren" text,
	"tva_intra" text,
	"capital" integer,
	"adresse_siege" text NOT NULL,
	"email" text,
	"telephone" text,
	"effectif" integer,
	"statut" "statut_client" DEFAULT 'actif' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"nom" text NOT NULL,
	"prenom" text,
	"email" text,
	"telephone" text,
	"fonction" text,
	"is_principal" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "demandes_contrat" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"prospect_id" uuid NOT NULL,
	"statut" "statut_demande_contrat" DEFAULT 'envoye' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"payload" jsonb,
	"pdf_url" text,
	"signature_base64" text,
	"signataire_nom" text,
	"signataire_email" text,
	"ville_signature" text,
	"date_signature" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "demandes_contrat_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "interventions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"distributeur_id" uuid NOT NULL,
	"technicien_id" text NOT NULL,
	"tournee_id" uuid,
	"type" "type_intervention" NOT NULL,
	"notes" text,
	"realisee_le" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "opportunites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prospect_id" uuid,
	"client_id" uuid,
	"titre" text NOT NULL,
	"stage" "stage_opportunite" DEFAULT 'decouverte' NOT NULL,
	"montant" real,
	"probabilite" integer DEFAULT 0 NOT NULL,
	"date_cloture_probable" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "opportunites_cible_check" CHECK ("opportunites"."prospect_id" IS NOT NULL OR "opportunites"."client_id" IS NOT NULL),
	CONSTRAINT "opportunites_probabilite_check" CHECK ("opportunites"."probabilite" BETWEEN 0 AND 100)
);
--> statement-breakpoint
CREATE TABLE "parametres_entreprise" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"forme_juridique" text,
	"capital" integer,
	"adresse_siege" text,
	"ville_rcs" text,
	"siren" text,
	"tva_intra" text,
	"nom_dirigeant" text,
	"qualite_dirigeant" text,
	"telephone" text,
	"ville_juridiction" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "parametres_entreprise_singleton" CHECK ("parametres_entreprise"."id" = 1)
);
--> statement-breakpoint
CREATE TABLE "tournees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"technicien_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"statut" "statut_tournee" DEFAULT 'planifiee' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "metriques" DROP CONSTRAINT "metriques_distributeur_id_distributeurs_id_fk";
--> statement-breakpoint
ALTER TABLE "relances" DROP CONSTRAINT "relances_prospect_id_prospects_id_fk";
--> statement-breakpoint
ALTER TABLE "contrats" ALTER COLUMN "prospect_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "distributeurs" ALTER COLUMN "statut" SET DATA TYPE statut_distributeur USING statut::statut_distributeur;--> statement-breakpoint
ALTER TABLE "contrats" ADD COLUMN "client_id" uuid;--> statement-breakpoint
ALTER TABLE "contrats" ADD COLUMN "montant_mensuel" real;--> statement-breakpoint
ALTER TABLE "contrats" ADD COLUMN "signature_base64" text;--> statement-breakpoint
ALTER TABLE "contrats" ADD COLUMN "signataire_nom" text;--> statement-breakpoint
ALTER TABLE "contrats" ADD COLUMN "signataire_email" text;--> statement-breakpoint
ALTER TABLE "distributeurs" ADD COLUMN "modele" text;--> statement-breakpoint
ALTER TABLE "distributeurs" ADD COLUMN "place" text;--> statement-breakpoint
ALTER TABLE "distributeurs" ADD COLUMN "client_id" uuid;--> statement-breakpoint
ALTER TABLE "distributeurs" ADD COLUMN "stock_actuel" integer;--> statement-breakpoint
ALTER TABLE "distributeurs" ADD COLUMN "temp_actuelle" real;--> statement-breakpoint
ALTER TABLE "distributeurs" ADD COLUMN "derniere_sync" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" DEFAULT 'commercial' NOT NULL;--> statement-breakpoint
ALTER TABLE "arrets_tournee" ADD CONSTRAINT "arrets_tournee_tournee_id_tournees_id_fk" FOREIGN KEY ("tournee_id") REFERENCES "public"."tournees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "arrets_tournee" ADD CONSTRAINT "arrets_tournee_distributeur_id_distributeurs_id_fk" FOREIGN KEY ("distributeur_id") REFERENCES "public"."distributeurs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_prospect_origine_id_prospects_id_fk" FOREIGN KEY ("prospect_origine_id") REFERENCES "public"."prospects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demandes_contrat" ADD CONSTRAINT "demandes_contrat_prospect_id_prospects_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_distributeur_id_distributeurs_id_fk" FOREIGN KEY ("distributeur_id") REFERENCES "public"."distributeurs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_technicien_id_user_id_fk" FOREIGN KEY ("technicien_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interventions" ADD CONSTRAINT "interventions_tournee_id_tournees_id_fk" FOREIGN KEY ("tournee_id") REFERENCES "public"."tournees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunites" ADD CONSTRAINT "opportunites_prospect_id_prospects_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "opportunites" ADD CONSTRAINT "opportunites_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tournees" ADD CONSTRAINT "tournees_technicien_id_user_id_fk" FOREIGN KEY ("technicien_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "arrets_tournee_ordre_unique" ON "arrets_tournee" USING btree ("tournee_id","ordre");--> statement-breakpoint
ALTER TABLE "contrats" ADD CONSTRAINT "contrats_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "distributeurs" ADD CONSTRAINT "distributeurs_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metriques" ADD CONSTRAINT "metriques_distributeur_id_distributeurs_id_fk" FOREIGN KEY ("distributeur_id") REFERENCES "public"."distributeurs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relances" ADD CONSTRAINT "relances_prospect_id_prospects_id_fk" FOREIGN KEY ("prospect_id") REFERENCES "public"."prospects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "metriques_distributeur_timestamp_idx" ON "metriques" USING btree ("distributeur_id","timestamp" desc);