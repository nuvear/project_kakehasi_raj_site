# Cloud Run Service Configuration
resource "google_cloud_run_v2_service" "kakehashi_app" {
  name     = "kakehashi-app"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    # Scale-to-zero configuration (min: 0, max: 5)
    scaling {
      min_instance_count = 0
      max_instance_count = 5
    }

    # Bind the custom service account
    service_account = google_service_account.kakehashi_app.email

    containers {
      image = var.container_image

      # Compute resources (1 CPU, 512MiB RAM)
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      # Standard environment variables
      env {
        name  = "FIREBASE_PROJECT_ID"
        value = var.project_id
      }

      env {
        name  = "PORT"
        value = "8787"
      }
    }
  }
}

# Allow public (unauthenticated) access to the service
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  project  = var.project_id
  location = google_cloud_run_v2_service.kakehashi_app.location
  name     = google_cloud_run_v2_service.kakehashi_app.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
