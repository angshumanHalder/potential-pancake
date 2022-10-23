package routes

import (
	"log"
	"net/http"

	"github.com/angshumanHalder/potential-pancake/pkg/controllers"
	"go.mongodb.org/mongo-driver/mongo"
)

func Serve(db *mongo.Database, port string) {
	// handlers
	http.Handle("/api/login", controllers.Login(db))
	http.Handle("/api/authorize-calendar", controllers.AuthorizeCalendar(db))

	log.Printf("JSON API server listening on %v \n", port)
	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatalf("JSON server error: %v", err)
	}
}
