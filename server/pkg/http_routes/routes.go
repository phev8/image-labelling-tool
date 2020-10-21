package http_routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/phev8/image-tagging-server/pkg/types"
)

func (h *HttpEndpoints) AddAPI(rg *gin.RouterGroup) {
	// studiesGroup := rg.Group("/studies")

	rg.GET("/images", h.handlGetAllImageData)
	rg.POST("/image", h.handlSaveImageData)
}

func (h *HttpEndpoints) handlSaveImageData(c *gin.Context) {
	var image types.TaggedImage
	if err := c.BindJSON(&image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	resp, err := h.dbService.SaveImageData(image)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

func (h *HttpEndpoints) handlGetAllImageData(c *gin.Context) {
	images, err := h.dbService.GetImages()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"images": images})
}
