import { NextResponse } from "next/server";

export async function GET() {
  const openApiDoc = {
    openapi: "3.0.0",
    info: {
      title: "Project Kakehashi REST Tools API",
      version: "1.0.0",
      description: "REST API endpoints serving as MCP tools for Project Kakehashi"
    },
    servers: [
      {
        url: "/api/mcp/tools"
      }
    ],
    paths: {
      "/search_public_content": {
        post: {
          summary: "Search public site content",
          description: "Performs text search or semantic vector similarity search on ingested portfolio content.",
          operationId: "searchPublicContent",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    query: {
                      type: "string",
                      description: "Search text query"
                    },
                    embedding: {
                      type: "array",
                      items: {
                        type: "number"
                      },
                      description: "Optional query embedding for vector-based search"
                    },
                    limit: {
                      type: "integer",
                      default: 3,
                      description: "Maximum number of search results to return"
                    }
                  },
                  required: ["query"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Successful search results",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        entity_id: { type: "string" },
                        locale: { type: "string" },
                        title: { type: "string" },
                        content: { type: "string" },
                        score: { type: "number" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/get_entity": {
        post: {
          summary: "Retrieve entity metadata",
          description: "Returns metadata for a specific entity (education, experience, venture, etc.) and optionally its translation.",
          operationId: "getEntity",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      description: "Unique entity identifier (e.g. education.stanford-executive-program)"
                    },
                    locale: {
                      type: "string",
                      description: "Preferred translation locale (en or ja)",
                      default: "en"
                    }
                  },
                  required: ["id"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Entity details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      entity: {
                        type: "object",
                        description: "Raw entity metadata properties"
                      },
                      translation: {
                        type: "object",
                        description: "Localization frontmatter and markdown body"
                      }
                    }
                  }
                }
              }
            },
            "404": {
              description: "Entity not found"
            }
          }
        }
      },
      "/get_entity_timeline": {
        post: {
          summary: "Retrieve entity history timeline",
          description: "Generates timeline events associated with a specific entity or across all entities sorted by date.",
          operationId: "getEntityTimeline",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      description: "Optional entity identifier to filter timeline"
                    },
                    locale: {
                      type: "string",
                      default: "en",
                      description: "Translation locale for timeline titles and descriptions"
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Timeline events list",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        entity_id: { type: "string" },
                        title: { type: "string" },
                        start_date: { type: "string" },
                        end_date: { type: "string", nullable: true },
                        type: { type: "string" },
                        description: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/get_related_entities": {
        post: {
          summary: "List related entities",
          description: "Finds entities connected by workspace relationships, capabilities, or historical sequence.",
          operationId: "getRelatedEntities",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "string",
                      description: "Entity identifier to query relations for"
                    },
                    locale: {
                      type: "string",
                      default: "en"
                    }
                  },
                  required: ["id"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "List of related entity metadata objects",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object"
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/get_public_media": {
        post: {
          summary: "Fetch public media assets",
          description: "Retrieves media gallery listings, images, documents, and videos associated with the target entity.",
          operationId: "getPublicMedia",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    entityId: {
                      type: "string",
                      description: "Entity identifier to lookup media for"
                    }
                  },
                  required: ["entityId"]
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Entity media catalog details",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      entity_id: { type: "string" },
                      media: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            type: { type: "string" },
                            url: { type: "string" },
                            mime_type: { type: "string" },
                            locale: { type: "string" },
                            permissions: { type: "string" },
                            captions: { type: "object" },
                            alt_text: { type: "object" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  return NextResponse.json(openApiDoc);
}
