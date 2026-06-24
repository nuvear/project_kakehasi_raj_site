# Cloud Firestore Native Database Configuration
resource "google_firestore_database" "default" {
  project                 = var.project_id
  name                    = "(default)"
  location_id             = var.firestore_location
  type                    = "FIRESTORE_NATIVE"
  deletion_policy         = "ABANDON" # Safely retain default database resource if Terraform configuration is destroyed
}

# Vector Index for Semantic/Vector Search
# Configures a vector search index on the 'content_vectors' collection, 'embedding' field with 768 dimensions.
# Note: Cloud Firestore vector indexes are built using flat index structures. The distance measure (e.g., COSINE, EUCLIDEAN, or DOT_PRODUCT)
# is specified during query execution in application code (e.g. find_nearest query parameters) rather than at index creation time.
resource "google_firestore_index" "content_vectors_embedding" {
  project    = var.project_id
  database   = google_firestore_database.default.name
  collection = "content_vectors"

  # For vector search indexes, the __name__ field must be defined as ASCENDING prior to the vector field configuration.
  fields {
    field_path = "__name__"
    order      = "ASCENDING"
  }

  fields {
    field_path = "embedding"
    vector_config {
      dimension = 768
      flat {}
    }
  }
}
