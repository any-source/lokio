/**
 * @author lokio
 * @generated at <%= created_at %>
 */

<%
// Fungsi untuk mengubah string menjadi format PascalCase
function toPascalCase(str) {
    return str.replace(/(^\w|-\w)/g, (match) => match.replace(/-/, '').toUpperCase());
}
%>

package http

import (
	"<%= package %>/internal/delivery/middleware"
	"<%= package %>/internal/model"
	"<%= package %>/internal/usecase"

	"github.com/gofiber/fiber/v2"
	"github.com/sirupsen/logrus"
)

type <%= toPascalCase(name) %> struct {
	Log     *logrus.Logger
	UseCase *usecase.<%= name %>
}

func New<%= toPascalCase(name) %>(useCase *usecase.<%= name %>, logger *logrus.Logger) *<%= toPascalCase(name) %> {
	return &<%= Name %>{
		Log:     logger,
		UseCase: useCase,
	}
}

// Example endpoint
//
// @Summary Example Endpoint
// @Description Example Endpoint
// @Tags <%= name %>
// @Accept json
// @Produce json
// @Success 200 {object} model.WebResponse{data=string}
// @Router /<%= name %>/example [get]
func (c *<%= toPascalCase(name) %>) Example(ctx *fiber.Ctx) error {
	return ctx.JSON(model.WebResponse[string]{Data: "Hello, Fiber!"})
}


