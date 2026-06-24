# Service Account for Kakehashi App
resource "google_service_account" "kakehashi_app" {
  project      = var.project_id
  account_id   = "kakehashi-app-sa"
  display_name = "Service Account for Kakehashi App Cloud Run"
}

# Bind roles/datastore.user role to grant standard datastore (Firestore) access
resource "google_project_iam_member" "datastore_user" {
  project = var.project_id
  role    = "roles/datastore.user"
  member  = "serviceAccount:${google_service_account.kakehashi_app.email}"
}

# Bind roles/aiplatform.user role to grant Vertex AI access
resource "google_project_iam_member" "aiplatform_user" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.kakehashi_app.email}"
}
