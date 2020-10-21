package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/phev8/image-tagging-server/pkg/db_client"
	"github.com/phev8/image-tagging-server/pkg/http_routes"
)

func main() {
	dbService := db_client.NewDBService()

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"POST", "GET", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type", "Content-Length"},
		ExposeHeaders:    []string{"Authorization", "Content-Type", "Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	router.Static("/assets", "./static")
	v1Root := router.Group("/v1")

	v1APIHandlers := http_routes.NewHTTPHandler(dbService)
	v1APIHandlers.AddAPI(v1Root)

	port := "3500"
	log.Printf("gateway listening on port %s", port)
	log.Fatal(router.Run(":" + port))
}
