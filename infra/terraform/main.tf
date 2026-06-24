terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 5.0.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

variable "project_id" {
  type        = string
  description = "The GCP project ID"
  default     = "rajagobalan-site"
}

variable "region" {
  type        = string
  description = "The target region for GCP resources (e.g. Cloud Run)"
  default     = "us-central1"
}

variable "firestore_location" {
  type        = string
  description = "The location for the Firestore database"
  default     = "nam5"
}

variable "container_image" {
  type        = string
  description = "The container image to deploy to Cloud Run"
  default     = "gcr.io/rajagobalan-site/kakehashi-app:latest"
}

output "cloud_run_url" {
  description = "The URL of the deployed Cloud Run service"
  value       = google_cloud_run_v2_service.kakehashi_app.uri
}
