package http_routes

import "github.com/phev8/image-tagging-server/pkg/db_client"

type HttpEndpoints struct {
	dbService *db_client.DBService
}

func NewHTTPHandler(dbService *db_client.DBService) *HttpEndpoints {
	return &HttpEndpoints{dbService: dbService}
}
